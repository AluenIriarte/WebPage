param(
  [string]$CohortId = "icp_cosmetica_researchops_2026_04_23",
  [string]$Country = "Argentina",
  [int]$Limit = 100,
  [ValidateSet("strict", "fillup")]
  [string]$Mode = "strict",
  [string]$Tag = "",
  [string]$DatabaseName = "divine-bread-quote-requests",
  [string]$WranglerConfig = "workers/wrangler.toml"
)

$ErrorActionPreference = "Stop"

if (-not $Tag) {
  $Tag = Get-Date -Format "yyyy-MM-dd"
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$accountsPath = Join-Path $repoRoot ("outbound\data\accounts\{0}.tsv" -f $CohortId)
$contactsPath = Join-Path $repoRoot ("outbound\data\discovery\{0}\contacts.csv" -f $CohortId)
$reportsDir = Join-Path $repoRoot "outbound\reports"
$sqlDir = Join-Path $repoRoot "outbound\sql\generated"
$summaryDir = Join-Path $repoRoot "outbound\reports"

if (-not (Test-Path $accountsPath)) { throw "Accounts file not found: $accountsPath" }
if (-not (Test-Path $contactsPath)) { throw "Contacts file not found: $contactsPath" }

New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null
New-Item -ItemType Directory -Force -Path $sqlDir | Out-Null

function Convert-ToSlug {
  param([string]$Value)
  $slug = $Value.ToLowerInvariant()
  $slug = [regex]::Replace($slug, "[^a-z0-9]+", "-")
  return $slug.Trim("-")
}

function Convert-ToSqlValue {
  param($Value)
  if ($null -eq $Value -or $Value -eq "") { return "NULL" }
  if ($Value -is [int] -or $Value -is [double] -or $Value -is [decimal]) { return [string]$Value }
  return "'" + ($Value.ToString().Replace("'", "''")) + "'"
}

function Get-TextValue {
  param(
    $Value,
    [string]$Default = ""
  )
  if ($null -eq $Value) { return $Default }
  $text = $Value.ToString()
  if ($text -eq "") { return $Default }
  return $text
}

function Get-NormalizedDomainRoot {
  param([string]$Domain)
  $value = (Get-TextValue $Domain).Trim().ToLowerInvariant()
  if (-not $value) { return "" }
  if ($value.StartsWith("www.")) { $value = $value.Substring(4) }
  $labels = $value.Split(".") | Where-Object { $_ }
  if (-not $labels.Count) { return "" }
  return ($labels[0] -replace "[^a-z0-9]", "")
}

function Get-LaneConfig {
  param([string]$ContactType)
  switch ($ContactType) {
    "nominal_public" {
      return @{
        message_variant = "nominal_direct_v1"
        primary_goal    = "direct_interest"
        lane_priority   = 100
      }
    }
    "role_based_commercial" {
      return @{
        message_variant = "role_commercial_v1"
        primary_goal    = "direct_interest"
        lane_priority   = 80
      }
    }
    "generic_routing" {
      return @{
        message_variant = "routing_v1"
        primary_goal    = "referral"
        lane_priority   = 55
      }
    }
    "admin_ops" {
      return @{
        message_variant = "admin_rescue_v1"
        primary_goal    = "area_confirmation"
        lane_priority   = 35
      }
    }
    default {
      return @{
        message_variant = "routing_v1"
        primary_goal    = "referral"
        lane_priority   = 55
      }
    }
  }
}

$freeDomains = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
@(
  "gmail.com", "hotmail.com", "hotmail.com.ar", "hotmail.es", "live.com", "live.com.ar",
  "outlook.com", "outlook.com.ar", "yahoo.com", "yahoo.com.ar", "yahoo.es", "ymail.com",
  "aol.com", "icloud.com", "me.com", "msn.com", "proton.me", "protonmail.com", "gmx.com",
  "mail.com", "t-online.de", "cs.com", "netscape.net"
) | ForEach-Object { [void]$freeDomains.Add($_) }
$assetTlds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
@("png", "jpg", "jpeg", "webp", "gif", "svg", "ico", "css", "js") | ForEach-Object { [void]$assetTlds.Add($_) }
$allowedTlds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
@("ar", "com", "net", "org", "info", "biz", "shop", "store", "online", "io", "co", "cl", "uy", "py", "pe", "mx", "br", "ec", "bo", "lat", "pro") | ForEach-Object { [void]$allowedTlds.Add($_) }

$nonTargetPattern = '^(privacy|abuse|noreply|no-reply|webmaster|soporte|support)([+._-].*)?$'

$accounts = Import-Csv -Path $accountsPath -Delimiter "`t"
$contacts = Import-Csv -Path $contactsPath

$countryAccounts = @{}
foreach ($account in $accounts) {
  if ($account.country -eq $Country) {
    $countryAccounts[$account.account_id] = $account
  }
}

if (-not $countryAccounts.Count) {
  throw "No accounts found for country $Country in $accountsPath"
}

$existingQuery = @"
SELECT lower(email) AS email FROM outbound_prospect_contacts
UNION
SELECT lower(email) AS email FROM outbound_prospects
ORDER BY 1;
"@

$existingJson = npx wrangler d1 execute $DatabaseName --remote --config $WranglerConfig --json --command $existingQuery
$existingRows = (($existingJson | ConvertFrom-Json)[0]).results
$existingEmails = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($row in $existingRows) {
  if ($row.email) { [void]$existingEmails.Add($row.email) }
}

$laneOrder = @{
  "nominal_public" = 1
  "role_based_commercial" = 2
  "generic_routing" = 3
  "admin_ops" = 4
}
$tierOrder = @{
  "A" = 1
  "B" = 2
  "C" = 3
}

$candidates = New-Object System.Collections.Generic.List[object]
foreach ($contact in $contacts) {
  if (-not $countryAccounts.ContainsKey($contact.account_id)) { continue }
  $account = $countryAccounts[$contact.account_id]
  $email = (Get-TextValue $contact.email).Trim().ToLowerInvariant()
  if (-not $email -or -not $email.Contains("@")) { continue }
  if ($existingEmails.Contains($email)) { continue }

  $emailParts = $email.Split("@", 2)
  $localPart = $emailParts[0]
  $emailDomain = $emailParts[1]
  if ($freeDomains.Contains($emailDomain)) { continue }
  if ($localPart -match $nonTargetPattern) { continue }
  $emailLabels = $emailDomain.Split(".") | Where-Object { $_ }
  if ($emailLabels.Count -lt 2) { continue }
  $emailTld = $emailLabels[-1]
  if ($assetTlds.Contains($emailTld)) { continue }
  if (-not $allowedTlds.Contains($emailTld)) { continue }
  $accountDomain = (Get-TextValue $account.domain).Trim().ToLowerInvariant()
  $emailRoot = Get-NormalizedDomainRoot $emailDomain
  $accountRoot = Get-NormalizedDomainRoot $accountDomain
  $domainAligned = ($emailRoot -and $accountRoot -and $emailRoot -eq $accountRoot)
  if ($Mode -eq "strict" -and -not $domainAligned) { continue }

  $contactType = (Get-TextValue $contact.contact_type).Trim()
  if (-not $contactType) { continue }

  $laneConfig = Get-LaneConfig -ContactType $contactType
  $priorityTier = ((Get-TextValue $account.priority_tier "C").Trim().ToUpperInvariant())
  if (-not $tierOrder.ContainsKey($priorityTier)) { $priorityTier = "C" }

  $sourceConfidence = 0
  [void][int]::TryParse((Get-TextValue $contact.source_confidence "0"), [ref]$sourceConfidence)
  $relevanceScore = 0
  [void][int]::TryParse((Get-TextValue $contact.relevance_score "0"), [ref]$relevanceScore)
  $contactScore = 0
  [void][int]::TryParse((Get-TextValue $contact.contact_score "0"), [ref]$contactScore)
  $icpFitScore = 0
  [void][int]::TryParse((Get-TextValue $account.icp_fit_score "0"), [ref]$icpFitScore)

  $candidate = [pscustomobject]@{
    contact_id          = $contact.contact_id
    account_id          = $contact.account_id
    email_id            = $contact.contact_id
    company_name        = $contact.company_name
    email               = $email
    email_domain        = $emailDomain
    email_local         = $localPart
    full_name           = (Get-TextValue $contact.full_name).Trim()
    first_name          = (Get-TextValue $contact.first_name).Trim()
    role_guess          = (Get-TextValue $contact.role_guess).Trim()
    department_guess    = (Get-TextValue $contact.department_guess).Trim()
    contact_type        = $contactType
    source_url          = (Get-TextValue $contact.source_url).Trim()
    source_type         = (Get-TextValue $contact.source_type).Trim()
    source_confidence   = $sourceConfidence
    relevance_score     = $relevanceScore
    contact_score       = $contactScore
    visibility_type     = (Get-TextValue $contact.visibility_type).Trim()
    evidence_snippet    = (Get-TextValue $contact.evidence_snippet).Trim()
    notes               = (Get-TextValue $contact.notes).Trim()
    account_domain      = $accountDomain
    website             = (Get-TextValue $account.website).Trim()
    vertical            = (Get-TextValue $account.vertical).Trim()
    sub_vertical        = (Get-TextValue $account.sub_vertical).Trim()
    geo                 = (Get-TextValue $account.geo).Trim()
    country             = (Get-TextValue $account.country).Trim()
    city_or_region      = (Get-TextValue $account.city_or_region).Trim()
    size_hint           = (Get-TextValue $account.size_hint).Trim()
    business_model      = (Get-TextValue $account.business_model).Trim()
    icp_fit_score       = $icpFitScore
    priority_tier       = $priorityTier
    lane_priority       = $laneConfig.lane_priority
    message_variant     = $laneConfig.message_variant
    primary_goal        = $laneConfig.primary_goal
    mode                = $Mode
    domain_aligned      = if ($domainAligned) { 1 } else { 0 }
    _tier_order         = $tierOrder[$priorityTier]
    _lane_order         = $(if ($laneOrder.ContainsKey($contactType)) { $laneOrder[$contactType] } else { 9 })
  }
  $candidates.Add($candidate)
}

$sorted = $candidates |
  Sort-Object `
    @{ Expression = { $_._tier_order } ; Ascending = $true }, `
    @{ Expression = { $_._lane_order } ; Ascending = $true }, `
    @{ Expression = { $_.source_confidence } ; Descending = $true }, `
    @{ Expression = { $_.relevance_score } ; Descending = $true }, `
    @{ Expression = { $_.contact_score } ; Descending = $true }, `
    @{ Expression = { $_.company_name } ; Ascending = $true }, `
    @{ Expression = { $_.email } ; Ascending = $true }

$rankedByAccount = @{}
foreach ($row in $sorted) {
  if (-not $rankedByAccount.ContainsKey($row.account_id)) {
    $rankedByAccount[$row.account_id] = 0
  }
  $rankedByAccount[$row.account_id] += 1
  Add-Member -InputObject $row -NotePropertyName account_contact_rank -NotePropertyValue $rankedByAccount[$row.account_id]
}

$uniqueSorted = New-Object System.Collections.Generic.List[object]
$seenBatchEmails = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($row in $sorted) {
  if ($seenBatchEmails.Contains($row.email)) { continue }
  [void]$seenBatchEmails.Add($row.email)
  $uniqueSorted.Add($row)
}

$selected = $uniqueSorted |
  Sort-Object `
    @{ Expression = { $_.account_contact_rank } ; Ascending = $true }, `
    @{ Expression = { $_._tier_order } ; Ascending = $true }, `
    @{ Expression = { $_._lane_order } ; Ascending = $true }, `
    @{ Expression = { $_.source_confidence } ; Descending = $true }, `
    @{ Expression = { $_.relevance_score } ; Descending = $true }, `
    @{ Expression = { $_.contact_score } ; Descending = $true }, `
    @{ Expression = { $_.company_name } ; Ascending = $true }, `
    @{ Expression = { $_.email } ; Ascending = $true } |
  Select-Object -First $Limit
if (-not $selected.Count) {
  throw "No candidates left after filtering for $Country"
}

$countrySlug = Convert-ToSlug $Country
$csvPath = Join-Path $reportsDir ("quickemail-next-{0}-{1}-{2}-{3}.csv" -f $selected.Count, $countrySlug, "researchops", $Tag)
$sqlPath = Join-Path $sqlDir ("import-researchops-{0}-{1}-prioritized-{2}.sql" -f $selected.Count, $countrySlug, $Tag)
$summaryPath = Join-Path $summaryDir ("quickemail-next-{0}-{1}-{2}-summary-{3}.json" -f $selected.Count, $countrySlug, "researchops", $Tag)

$csvColumns = @(
  "contact_id", "account_id", "company_name", "email", "email_domain", "full_name", "first_name",
  "role_guess", "department_guess", "contact_type", "source_url", "source_type",
  "source_confidence", "relevance_score", "contact_score", "visibility_type", "notes",
  "website", "account_domain", "vertical", "sub_vertical", "geo", "country", "city_or_region",
  "size_hint", "business_model", "icp_fit_score", "priority_tier", "message_variant",
  "primary_goal", "lane_priority", "account_contact_rank", "domain_aligned", "mode"
)
$selected | Select-Object $csvColumns | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

$sqlLines = New-Object System.Collections.Generic.List[string]
$importNote = "researchops $Country $Mode prioritized batch $($selected.Count) import"
$accountIdsSeen = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($row in $selected) {
  if (-not $accountIdsSeen.Contains($row.account_id)) {
    [void]$accountIdsSeen.Add($row.account_id)
    $sqlLines.Add(@"
INSERT INTO outbound_accounts (account_id, cohort_id, company_name, domain, website, vertical, geo, country, icp_fit_score, priority_tier, status, source, notes, updated_at)
VALUES ($(Convert-ToSqlValue $row.account_id), $(Convert-ToSqlValue $CohortId), $(Convert-ToSqlValue $row.company_name), $(Convert-ToSqlValue $row.account_domain), $(Convert-ToSqlValue $row.website), $(Convert-ToSqlValue $row.vertical), $(Convert-ToSqlValue $row.geo), $(Convert-ToSqlValue $row.country), $(Convert-ToSqlValue $row.icp_fit_score), $(Convert-ToSqlValue $row.priority_tier), 'candidate', 'ai_account_research', $(Convert-ToSqlValue $importNote), CURRENT_TIMESTAMP)
ON CONFLICT(account_id) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  company_name = excluded.company_name,
  domain = excluded.domain,
  website = excluded.website,
  vertical = excluded.vertical,
  geo = excluded.geo,
  country = excluded.country,
  icp_fit_score = excluded.icp_fit_score,
  priority_tier = excluded.priority_tier,
  status = excluded.status,
  source = excluded.source,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;
"@)
  }

  $sqlLines.Add(@"
INSERT INTO outbound_emails_normalized (email_id, cohort_id, account_id, email, email_domain, email_local, normalized_from_hits, syntax_valid, contact_type, person_name, role_guess, department_guess, source_url, evidence_score, relevance_score, status, notes, updated_at)
VALUES ($(Convert-ToSqlValue $row.email_id), $(Convert-ToSqlValue $CohortId), $(Convert-ToSqlValue $row.account_id), $(Convert-ToSqlValue $row.email), $(Convert-ToSqlValue $row.email_domain), $(Convert-ToSqlValue $row.email_local), $(Convert-ToSqlValue $row.source_url), 1, $(Convert-ToSqlValue $row.contact_type), $(Convert-ToSqlValue $row.full_name), $(Convert-ToSqlValue $row.role_guess), $(Convert-ToSqlValue $row.department_guess), $(Convert-ToSqlValue $row.source_url), $(Convert-ToSqlValue $row.source_confidence), $(Convert-ToSqlValue $row.relevance_score), 'candidate_validation', $(Convert-ToSqlValue $importNote), CURRENT_TIMESTAMP)
ON CONFLICT(email_id) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  account_id = excluded.account_id,
  email = excluded.email,
  email_domain = excluded.email_domain,
  email_local = excluded.email_local,
  normalized_from_hits = excluded.normalized_from_hits,
  syntax_valid = excluded.syntax_valid,
  contact_type = excluded.contact_type,
  person_name = excluded.person_name,
  role_guess = excluded.role_guess,
  department_guess = excluded.department_guess,
  source_url = excluded.source_url,
  evidence_score = excluded.evidence_score,
  relevance_score = excluded.relevance_score,
  status = excluded.status,
  notes = excluded.notes,
  updated_at = CURRENT_TIMESTAMP;
"@)

  $sqlLines.Add(@"
INSERT INTO outbound_prospect_contacts (contact_id, cohort_id, account_id, email_id, email, email_domain, full_name, role_guess, department_guess, contact_type, source_url, source_confidence, relevance_score, verification_status, verification_provider, deliverability_score, prospecting_score, pipeline_status, final_status, last_verified_at, notes, updated_at, message_variant, primary_goal, lane_priority, account_contact_rank)
VALUES ($(Convert-ToSqlValue $row.contact_id), $(Convert-ToSqlValue $CohortId), $(Convert-ToSqlValue $row.account_id), $(Convert-ToSqlValue $row.email_id), $(Convert-ToSqlValue $row.email), $(Convert-ToSqlValue $row.email_domain), $(Convert-ToSqlValue $row.full_name), $(Convert-ToSqlValue $row.role_guess), $(Convert-ToSqlValue $row.department_guess), $(Convert-ToSqlValue $row.contact_type), $(Convert-ToSqlValue $row.source_url), $(Convert-ToSqlValue $row.source_confidence), $(Convert-ToSqlValue $row.relevance_score), 'pending', NULL, 0, $(Convert-ToSqlValue $row.contact_score), 'candidate_validation', 'candidate_validation', NULL, $(Convert-ToSqlValue $importNote), CURRENT_TIMESTAMP, $(Convert-ToSqlValue $row.message_variant), $(Convert-ToSqlValue $row.primary_goal), $(Convert-ToSqlValue $row.lane_priority), $(Convert-ToSqlValue $row.account_contact_rank))
ON CONFLICT(contact_id) DO UPDATE SET
  cohort_id = excluded.cohort_id,
  account_id = excluded.account_id,
  email_id = excluded.email_id,
  email = excluded.email,
  email_domain = excluded.email_domain,
  full_name = excluded.full_name,
  role_guess = excluded.role_guess,
  department_guess = excluded.department_guess,
  contact_type = excluded.contact_type,
  source_url = excluded.source_url,
  source_confidence = excluded.source_confidence,
  relevance_score = excluded.relevance_score,
  verification_status = excluded.verification_status,
  verification_provider = excluded.verification_provider,
  deliverability_score = excluded.deliverability_score,
  prospecting_score = excluded.prospecting_score,
  pipeline_status = excluded.pipeline_status,
  final_status = excluded.final_status,
  notes = excluded.notes,
  message_variant = excluded.message_variant,
  primary_goal = excluded.primary_goal,
  lane_priority = excluded.lane_priority,
  account_contact_rank = excluded.account_contact_rank,
  updated_at = CURRENT_TIMESTAMP;
"@)
}

$sqlHeader = @(
  "-- Generated by build-researchops-priority-batch.ps1",
  "-- Cohort: $CohortId",
  "-- Country: $Country",
  "-- Count: $($selected.Count)",
  ""
) -join [Environment]::NewLine

Set-Content -Path $sqlPath -Value ($sqlHeader + [Environment]::NewLine + ($sqlLines -join [Environment]::NewLine)) -Encoding UTF8

$summary = [pscustomobject]@{
  cohort_id = $CohortId
  country = $Country
  mode = $Mode
  selected_count = $selected.Count
  raw_country_contacts = ($contacts | Where-Object { $countryAccounts.ContainsKey($_.account_id) }).Count
  unique_existing_emails_global = $existingEmails.Count
  breakdown_by_tier = $selected | Group-Object priority_tier | Sort-Object Name | ForEach-Object {
    [pscustomobject]@{ priority_tier = $_.Name; total = $_.Count }
  }
  breakdown_by_contact_type = $selected | Group-Object contact_type | Sort-Object Name | ForEach-Object {
    [pscustomobject]@{ contact_type = $_.Name; total = $_.Count }
  }
  csv_path = $csvPath
  sql_path = $sqlPath
}
$summary | ConvertTo-Json -Depth 5 | Set-Content -Path $summaryPath -Encoding UTF8

Write-Output ("CSV: {0}" -f $csvPath)
Write-Output ("SQL: {0}" -f $sqlPath)
Write-Output ("SUMMARY: {0}" -f $summaryPath)
Write-Output ("COUNT: {0}" -f $selected.Count)
