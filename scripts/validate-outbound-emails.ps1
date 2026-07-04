param(
  [string]$InputCsv = (Join-Path $PSScriptRoot "..\outbound\data\prospects\prospects_ramp_5_business_days.csv"),
  [string]$OutputApprovedCsv = (Join-Path $PSScriptRoot "..\outbound\data\validation\preflight\prospects_preflight_approved.csv"),
  [string]$OutputReviewCsv = (Join-Path $PSScriptRoot "..\outbound\data\validation\preflight\prospects_preflight_needs_review.csv"),
  [string]$OutputRejectedCsv = (Join-Path $PSScriptRoot "..\outbound\data\validation\preflight\prospects_preflight_rejected.csv"),
  [string]$OutputSummary = (Join-Path $PSScriptRoot "..\outbound\data\validation\preflight\prospects_preflight_summary.md"),
  [string]$OutputSql = (Join-Path $PSScriptRoot "..\outbound\sql\generated\d1-outbound-preflight-clean-2026-04-22.sql"),
  [string]$CampaignId = "dashboard_comercial_test_v1",
  [string[]]$KnownHardBounceEmails = @(),
  [string[]]$KnownSoftBounceEmails = @(),
  [string[]]$KnownBadDomains = @()
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$GenericLocals = @(
  "info",
  "contacto",
  "contact",
  "ventas",
  "sales",
  "administracion",
  "admin",
  "comercial",
  "compras",
  "facturacion",
  "rrhh"
)

function Normalize-Text {
  param([object]$Value)
  if ($null -eq $Value) { return "" }
  return ([string]$Value).Trim()
}

function Normalize-Key {
  param([object]$Value)
  return (Normalize-Text $Value).ToLowerInvariant()
}

function Add-Flag {
  param(
    [System.Collections.Generic.List[string]]$Flags,
    [string]$Flag
  )
  if ($Flag -and -not $Flags.Contains($Flag)) {
    [void]$Flags.Add($Flag)
  }
}

function Get-EmailDomain {
  param([string]$Email)
  $emailClean = Normalize-Key $Email
  if ($emailClean -notmatch "@") { return "" }
  return ($emailClean.Split("@")[-1]).Trim(".")
}

function Get-EmailLocal {
  param([string]$Email)
  $emailClean = Normalize-Key $Email
  if ($emailClean -notmatch "@") { return "" }
  return $emailClean.Split("@")[0]
}

function Test-EmailSyntax {
  param([string]$Email)
  $emailClean = Normalize-Key $Email
  if ($emailClean -notmatch "^[a-z0-9.!#$%&'*+/=?^_``{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$") {
    return $false
  }

  $domain = Get-EmailDomain $emailClean
  if ($domain -match "\.\." -or $domain -match "^-|-$") {
    return $false
  }

  foreach ($part in $domain.Split(".")) {
    if (-not $part -or $part -match "^-|-$") {
      return $false
    }
  }

  return $true
}

function Test-DomainMx {
  param(
    [string]$Domain,
    [hashtable]$Cache
  )

  $domainKey = Normalize-Key $Domain
  if (-not $domainKey) {
    return [PSCustomObject]@{ has_mx = $false; status = "missing_domain"; mx = "" }
  }
  if ($Cache.ContainsKey($domainKey)) {
    return $Cache[$domainKey]
  }

  try {
    $records = @(Resolve-DnsName -Name $domainKey -Type MX -ErrorAction Stop)
    $exchanges = @($records | Where-Object { $_.Type -eq "MX" -and $_.NameExchange } | ForEach-Object { $_.NameExchange.Trim(".") })
    if ($exchanges.Count -gt 0) {
      $result = [PSCustomObject]@{ has_mx = $true; status = "mx_ok"; mx = ($exchanges -join "|") }
    } else {
      $result = [PSCustomObject]@{ has_mx = $false; status = "no_mx"; mx = "" }
    }
  } catch {
    $result = [PSCustomObject]@{ has_mx = $false; status = "no_mx"; mx = "" }
  }

  $Cache[$domainKey] = $result
  return $result
}

function Sql-String {
  param([object]$Value)
  if ($null -eq $Value) { return "NULL" }
  $text = [string]$Value
  if ($text.Length -eq 0) { return "NULL" }
  return "'" + ($text -replace "'", "''") + "'"
}

if (-not (Test-Path -LiteralPath $InputCsv)) {
  throw "Input CSV not found: $InputCsv"
}

$hardBounceSet = @{}
foreach ($email in $KnownHardBounceEmails) {
  $key = Normalize-Key $email
  if ($key) { $hardBounceSet[$key] = $true }
}

$softBounceSet = @{}
foreach ($email in $KnownSoftBounceEmails) {
  $key = Normalize-Key $email
  if ($key) { $softBounceSet[$key] = $true }
}

$badDomainSet = @{}
foreach ($domain in $KnownBadDomains) {
  $key = Normalize-Key $domain
  if ($key) { $badDomainSet[$key] = $true }
}

$rows = @(Import-Csv -LiteralPath $InputCsv)
$mxCache = @{}
$approved = New-Object "System.Collections.Generic.List[object]"
$review = New-Object "System.Collections.Generic.List[object]"
$rejected = New-Object "System.Collections.Generic.List[object]"

foreach ($row in $rows) {
  $email = Normalize-Key $row.email
  $domain = Get-EmailDomain $email
  $local = Get-EmailLocal $email
  $flags = New-Object "System.Collections.Generic.List[string]"
  $decision = "approved"
  $reason = ""

  if (-not (Test-EmailSyntax $email)) {
    Add-Flag $flags "invalid_email_syntax"
    $decision = "rejected"
    $reason = "invalid_email_syntax"
  }

  if ($hardBounceSet.ContainsKey($email)) {
    Add-Flag $flags "known_hard_bounce"
    $decision = "rejected"
    $reason = "known_hard_bounce"
  }

  if ($badDomainSet.ContainsKey($domain)) {
    Add-Flag $flags "known_bad_domain"
    $decision = "rejected"
    $reason = "known_bad_domain"
  }

  if ($decision -ne "rejected") {
    $mx = Test-DomainMx -Domain $domain -Cache $mxCache
    Add-Flag $flags $mx.status
    if (-not $mx.has_mx) {
      $decision = "rejected"
      $reason = $mx.status
    }
  } else {
    $mx = [PSCustomObject]@{ has_mx = $false; status = ""; mx = "" }
  }

  if ($decision -ne "rejected") {
    if ($softBounceSet.ContainsKey($email)) {
      Add-Flag $flags "known_soft_bounce"
      $decision = "needs_review"
      $reason = "known_soft_bounce"
    } elseif ($GenericLocals -contains $local) {
      Add-Flag $flags "generic_inbox"
      $decision = "needs_review"
      $reason = "generic_inbox"
    }
  }

  $row | Add-Member -NotePropertyName preflight_decision -NotePropertyValue $decision -Force
  $row | Add-Member -NotePropertyName preflight_reason -NotePropertyValue $reason -Force
  $row | Add-Member -NotePropertyName preflight_flags -NotePropertyValue ($flags -join ",") -Force
  $row | Add-Member -NotePropertyName mx_records -NotePropertyValue $mx.mx -Force

  switch ($decision) {
    "approved" { [void]$approved.Add($row) }
    "needs_review" { [void]$review.Add($row) }
    default { [void]$rejected.Add($row) }
  }
}

New-Item -ItemType Directory -Path (Split-Path -Parent $OutputApprovedCsv) -Force | Out-Null
$approved | Export-Csv -LiteralPath $OutputApprovedCsv -NoTypeInformation -Encoding UTF8
$review | Export-Csv -LiteralPath $OutputReviewCsv -NoTypeInformation -Encoding UTF8
$rejected | Export-Csv -LiteralPath $OutputRejectedCsv -NoTypeInformation -Encoding UTF8

$reasonSummary = $rows |
  Group-Object preflight_decision, preflight_reason |
  Sort-Object Count -Descending |
  ForEach-Object { "- $($_.Name): $($_.Count)" }

$summary = @(
  "# Prospect preflight summary",
  "",
  "- Input rows: $($rows.Count)",
  "- Approved: $($approved.Count)",
  "- Needs review: $($review.Count)",
  "- Rejected: $($rejected.Count)",
  "- Unique domains checked: $($mxCache.Count)",
  "",
  "## Breakdown",
  ""
) + $reasonSummary

$summary -join "`n" | Set-Content -LiteralPath $OutputSummary -Encoding UTF8

$sql = New-Object "System.Collections.Generic.List[string]"
$sql.Add("-- Generated by scripts/validate-outbound-emails.ps1") | Out-Null
$sql.Add("-- Cancels held/pending queue rows that failed preflight validation.") | Out-Null
$sql.Add("") | Out-Null

foreach ($row in $rejected) {
  $message = "preflight_$($row.preflight_reason)"
  $sql.Add(@"
UPDATE outbound_prospects
SET status = 'do_not_contact',
    do_not_contact_reason = $(Sql-String $message),
    validation_flags = CASE
      WHEN validation_flags IS NULL OR validation_flags = '' THEN $(Sql-String $row.preflight_flags)
      ELSE validation_flags || ',preflight:' || $(Sql-String $row.preflight_flags)
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE sequence_id = $(Sql-String $CampaignId)
  AND id = $(Sql-String $row.id)
  AND status NOT IN ('sent_step_1', 'sent_step_2', 'sent_step_3', 'replied', 'unsubscribed');

UPDATE outbound_send_queue
SET status = 'cancelled',
    error_message = $(Sql-String $message),
    updated_at = CURRENT_TIMESTAMP
WHERE campaign_id = $(Sql-String $CampaignId)
  AND prospect_id = $(Sql-String $row.id)
  AND status IN ('pending', 'held');
"@) | Out-Null
}

foreach ($row in $review) {
  $message = "preflight_review_$($row.preflight_reason)"
  $sql.Add(@"
UPDATE outbound_prospects
SET validation_flags = CASE
      WHEN validation_flags IS NULL OR validation_flags = '' THEN $(Sql-String $row.preflight_flags)
      ELSE validation_flags || ',preflight:' || $(Sql-String $row.preflight_flags)
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE sequence_id = $(Sql-String $CampaignId)
  AND id = $(Sql-String $row.id)
  AND status NOT IN ('sent_step_1', 'sent_step_2', 'sent_step_3', 'replied', 'unsubscribed');

UPDATE outbound_send_queue
SET error_message = $(Sql-String $message),
    updated_at = CURRENT_TIMESTAMP
WHERE campaign_id = $(Sql-String $CampaignId)
  AND prospect_id = $(Sql-String $row.id)
  AND status IN ('pending', 'held');
"@) | Out-Null
}

New-Item -ItemType Directory -Path (Split-Path -Parent $OutputSql) -Force | Out-Null
$sql -join "`n" | Set-Content -LiteralPath $OutputSql -Encoding UTF8

[PSCustomObject]@{
  input = $InputCsv
  approved_csv = $OutputApprovedCsv
  review_csv = $OutputReviewCsv
  rejected_csv = $OutputRejectedCsv
  summary = $OutputSummary
  sql = $OutputSql
  rows = $rows.Count
  approved = $approved.Count
  needs_review = $review.Count
  rejected = $rejected.Count
  domains_checked = $mxCache.Count
}
