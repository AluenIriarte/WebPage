param(
  [string]$CampaignId = "dashboard_comercial_test_v1",
  [string]$LocalDate,
  [string]$WeekStart,
  [int]$Limit = 5000,
  [string]$OutputJson = (Join-Path $PSScriptRoot "..\reports\ops-funnel-$((Get-Date).ToString('yyyy-MM-dd')).json"),
  [string]$ReadyValidationCsv,
  [string]$ReadyPublishCsv,
  [string]$ScheduledTodayCsv,
  [string]$FollowupsCsv,
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-BuenosAiresToday {
  return [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(-3)).DateTime.Date
}

function Get-NextMonday {
  param([datetime]$FromDate)

  $candidate = $FromDate.Date.AddDays(1)
  while ($candidate.DayOfWeek -ne [System.DayOfWeek]::Monday) {
    $candidate = $candidate.AddDays(1)
  }
  return $candidate
}

function Add-BusinessDays {
  param(
    [datetime]$StartDate,
    [int]$BusinessDays
  )

  $cursor = $StartDate.Date
  $remaining = $BusinessDays
  while ($remaining -gt 0) {
    $cursor = $cursor.AddDays(1)
    if ($cursor.DayOfWeek -in @([System.DayOfWeek]::Saturday, [System.DayOfWeek]::Sunday)) {
      continue
    }
    $remaining -= 1
  }
  return $cursor
}

function Convert-ToBuenosAiresLocalDate {
  param([string]$UtcIso)

  if ([string]::IsNullOrWhiteSpace($UtcIso)) {
    return $null
  }

  return [DateTimeOffset]::Parse($UtcIso).ToOffset([TimeSpan]::FromHours(-3)).DateTime
}

function Invoke-D1Query {
  param([string]$Sql)

  $command = ($Sql -replace "\s+", " ").Trim()
  $json = npx wrangler d1 execute divine-bread-quote-requests --remote --config $WranglerConfig --json --command $command
  $raw = ($json | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }) -join "`n"
  $parsed = $raw | ConvertFrom-Json
  $result = if ($parsed -is [System.Array]) { $parsed[0] } else { $parsed }

  if ($null -eq $result) {
    throw "Wrangler D1 devolvio una respuesta vacia."
  }

  $propertyNames = @($result.PSObject.Properties.Name)
  if ($propertyNames -contains "results") {
    return @($result.results)
  }

  if (($propertyNames -contains "success") -and (-not $result.success)) {
    $message = if ($propertyNames -contains "errors") { ($result.errors | ConvertTo-Json -Compress) } else { $raw }
    throw "Wrangler D1 devolvio error: $message"
  }

  throw "Formato JSON inesperado desde Wrangler D1: $raw"
}

function Group-CountBy {
  param(
    [object[]]$Rows,
    [string]$Field
  )

  if ($null -eq $Rows -or $Rows.Count -eq 0) {
    return @()
  }

  return @(
    $Rows |
      Group-Object $Field |
      ForEach-Object {
        [pscustomobject]@{
          key = if ([string]::IsNullOrWhiteSpace([string]$_.Name)) { "unknown" } else { $_.Name }
          count = $_.Count
        }
      } |
      Sort-Object @{ Expression = "count"; Descending = $true }, key
  )
}

function New-DirectoryForFile {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) {
    return
  }

  New-Item -ItemType Directory -Path (Split-Path -Parent $Path) -Force | Out-Null
}

$baToday = Get-BuenosAiresToday
if ([string]::IsNullOrWhiteSpace($LocalDate)) {
  $LocalDate = $baToday.ToString("yyyy-MM-dd")
}
if ([string]::IsNullOrWhiteSpace($WeekStart)) {
  $WeekStart = (Get-NextMonday -FromDate $baToday).ToString("yyyy-MM-dd")
}

$localDateValue = [datetime]::ParseExact($LocalDate, "yyyy-MM-dd", [System.Globalization.CultureInfo]::InvariantCulture)
$weekStartDate = [datetime]::ParseExact($WeekStart, "yyyy-MM-dd", [System.Globalization.CultureInfo]::InvariantCulture)
$weekEndDate = $weekStartDate.AddDays(4)

if (-not $ReadyValidationCsv) {
  $ReadyValidationCsv = Join-Path $PSScriptRoot "..\reports\ops-ready-validation-$LocalDate.csv"
}
if (-not $ReadyPublishCsv) {
  $ReadyPublishCsv = Join-Path $PSScriptRoot "..\reports\ops-ready-publish-$LocalDate.csv"
}
if (-not $ScheduledTodayCsv) {
  $ScheduledTodayCsv = Join-Path $PSScriptRoot "..\reports\ops-scheduled-$LocalDate.csv"
}
if (-not $FollowupsCsv) {
  $FollowupsCsv = Join-Path $PSScriptRoot "..\reports\ops-followups-$WeekStart.csv"
}

$readyValidationQuery = @"
SELECT
  pc.contact_id,
  pc.cohort_id,
  pc.account_id,
  a.company_name,
  a.domain,
  a.vertical,
  a.country,
  a.priority_tier,
  pc.email,
  pc.full_name,
  pc.role_guess,
  pc.department_guess,
  pc.contact_type,
  pc.message_variant,
  pc.primary_goal,
  pc.verification_status,
  COALESCE(pc.pipeline_status, pc.final_status) AS pipeline_status,
  pc.final_status,
  pc.prospecting_score,
  pc.source_confidence
FROM outbound_prospect_contacts pc
LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
WHERE COALESCE(pc.pipeline_status, pc.final_status) IN ('candidate_validation', 'routing_only_pre_validation')
  AND COALESCE(pc.verification_status, 'pending') IN ('', 'pending')
ORDER BY
  pc.cohort_id ASC,
  pc.prospecting_score DESC,
  pc.source_confidence DESC,
  pc.email ASC
LIMIT $Limit;
"@

$readyPublishQuery = @"
SELECT
  pc.contact_id,
  pc.cohort_id,
  pc.account_id,
  a.company_name,
  a.domain,
  a.vertical,
  a.country,
  a.priority_tier,
  pc.email,
  pc.full_name,
  pc.role_guess,
  pc.department_guess,
  pc.contact_type,
  pc.message_variant,
  pc.primary_goal,
  pc.verification_status,
  COALESCE(pc.pipeline_status, pc.final_status) AS pipeline_status,
  pc.final_status,
  pc.prospecting_score,
  pc.deliverability_score
FROM outbound_prospect_contacts pc
LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
WHERE pc.verification_status = 'valid_send'
  AND NOT EXISTS (
    SELECT 1
    FROM outbound_prospects p
    WHERE p.source_contact_id = pc.contact_id
       OR lower(p.email) = lower(pc.email)
  )
ORDER BY
  pc.cohort_id ASC,
  pc.prospecting_score DESC,
  pc.deliverability_score DESC,
  pc.email ASC
LIMIT $Limit;
"@

$scheduledTodayQuery = @"
SELECT
  q.id AS queue_id,
  q.status AS queue_status,
  q.step_number,
  q.scheduled_at,
  p.cohort_id,
  p.account_id,
  p.company_name,
  p.domain,
  p.industry AS vertical,
  p.priority AS priority_tier,
  p.email,
  p.contact_name,
  COALESCE(p.email_type, 'unknown') AS contact_type,
  p.verification_status
FROM outbound_send_queue q
JOIN outbound_prospects p ON p.id = q.prospect_id
WHERE q.campaign_id = '$CampaignId'
  AND date(datetime(q.scheduled_at, '-3 hours')) = '$LocalDate'
ORDER BY
  q.scheduled_at ASC,
  q.status ASC,
  p.company_name ASC,
  p.email ASC
LIMIT $Limit;
"@

$followupCandidatesQuery = @"
SELECT
  f.prospect_id,
  p.cohort_id,
  f.account_id,
  f.account_name,
  f.account_domain,
  f.vertical,
  f.geo,
  f.country,
  f.priority_tier,
  f.email,
  f.contact_name,
  f.contact_role,
  f.email_type,
  COALESCE(f.contact_type, f.email_type, 'unknown') AS contact_type,
  COALESCE(f.message_variant, 'routing_v1') AS message_variant,
  f.primary_goal,
  COALESCE(f.lane_priority, 0) AS lane_priority,
  COALESCE(f.account_contact_rank, 9999) AS account_contact_rank,
  f.prospecting_score,
  f.current_step_number,
  f.next_step_number,
  f.next_step_delay_days,
  f.current_step_sent_at
FROM outbound_next_followup_candidates f
LEFT JOIN outbound_prospects p ON p.id = f.prospect_id
WHERE f.campaign_id = '$CampaignId'
  AND f.next_step_number = 2
  AND COALESCE(f.campaign_segment, '') != 'internal_test'
ORDER BY
  f.current_step_sent_at ASC,
  f.prospecting_score DESC
LIMIT $Limit;
"@

$readyValidationRows = @(Invoke-D1Query -Sql $readyValidationQuery)
$readyPublishRows = @(Invoke-D1Query -Sql $readyPublishQuery)
$scheduledTodayRows = @(Invoke-D1Query -Sql $scheduledTodayQuery)
$followupRowsRaw = @(Invoke-D1Query -Sql $followupCandidatesQuery)

$followupRows = foreach ($row in $followupRowsRaw) {
  $sentLocal = Convert-ToBuenosAiresLocalDate -UtcIso $row.current_step_sent_at
  if ($null -eq $sentLocal) {
    continue
  }

  $dueDate = Add-BusinessDays -StartDate $sentLocal.Date -BusinessDays ([int]$row.next_step_delay_days)
  if ($dueDate -lt $weekStartDate -or $dueDate -gt $weekEndDate) {
    continue
  }

  [pscustomobject]@{
    prospect_id = $row.prospect_id
    cohort_id = $row.cohort_id
    account_id = $row.account_id
    account_name = $row.account_name
    account_domain = $row.account_domain
    vertical = $row.vertical
    geo = $row.geo
    country = $row.country
    priority_tier = $row.priority_tier
    email = $row.email
    contact_name = $row.contact_name
    contact_role = $row.contact_role
    email_type = $row.email_type
    contact_type = $row.contact_type
    message_variant = $row.message_variant
    primary_goal = $row.primary_goal
    lane_priority = [int]$row.lane_priority
    account_contact_rank = [int]$row.account_contact_rank
    prospecting_score = [int]$row.prospecting_score
    current_step_number = [int]$row.current_step_number
    next_step_number = [int]$row.next_step_number
    next_step_delay_days = [int]$row.next_step_delay_days
    current_step_sent_at = $row.current_step_sent_at
    due_local_date = $dueDate.ToString("yyyy-MM-dd")
  }
}
$followupRows = @($followupRows | Sort-Object due_local_date, @{ Expression = "lane_priority"; Descending = $true }, account_contact_rank, current_step_sent_at, @{ Expression = "prospecting_score"; Descending = $true }, email)

$sendableTodayRows = @($scheduledTodayRows | Where-Object { $_.queue_status -in @('held', 'pending') })
$scheduledTodayHeldRows = @($scheduledTodayRows | Where-Object { $_.queue_status -eq 'held' })
$scheduledTodayCancelledRows = @($scheduledTodayRows | Where-Object { $_.queue_status -eq 'cancelled' })
$scheduledTodaySentRows = @($scheduledTodayRows | Where-Object { $_.queue_status -eq 'sent' })
$sendableTodayValidSendRows = @($sendableTodayRows | Where-Object { $_.verification_status -eq 'valid_send' })

foreach ($path in @($OutputJson, $ReadyValidationCsv, $ReadyPublishCsv, $ScheduledTodayCsv, $FollowupsCsv)) {
  New-DirectoryForFile -Path $path
}

@($readyValidationRows) | Export-Csv -LiteralPath $ReadyValidationCsv -NoTypeInformation -Encoding UTF8
@($readyPublishRows) | Export-Csv -LiteralPath $ReadyPublishCsv -NoTypeInformation -Encoding UTF8
@($scheduledTodayRows) | Export-Csv -LiteralPath $ScheduledTodayCsv -NoTypeInformation -Encoding UTF8
@($followupRows) | Export-Csv -LiteralPath $FollowupsCsv -NoTypeInformation -Encoding UTF8

$report = [pscustomobject]@{
  generated_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
  local_date = $LocalDate
  week_start = $WeekStart
  week_end = $weekEndDate.ToString("yyyy-MM-dd")
  campaign_id = $CampaignId
  definitions = [pscustomobject]@{
    ready_validation = "Contactos pre-validacion en outbound_prospect_contacts con verification_status pendiente y pipeline_status candidate_validation o routing_only_pre_validation."
    ready_publish = "Contactos en outbound_prospect_contacts con verification_status valid_send que aun no fueron publicados a outbound_prospects."
    scheduled_today = "Rows de outbound_send_queue con scheduled_at en la fecha local consultada."
    sendable_today = "Subset de scheduled_today con queue_status held o pending."
    followups_next_week = "Rows de outbound_next_followup_candidates para step 2 cuya fecha due cae entre el lunes y viernes de la semana indicada."
  }
  counts = [pscustomobject]@{
    ready_validation = $readyValidationRows.Count
    ready_publish = $readyPublishRows.Count
    scheduled_today = $scheduledTodayRows.Count
    sendable_today = $sendableTodayRows.Count
    sendable_today_valid_send = $sendableTodayValidSendRows.Count
    held_today = $scheduledTodayHeldRows.Count
    cancelled_today = $scheduledTodayCancelledRows.Count
    sent_today = $scheduledTodaySentRows.Count
    followups_next_week = $followupRows.Count
  }
  breakdowns = [pscustomobject]@{
    ready_validation_by_cohort = @(Group-CountBy -Rows $readyValidationRows -Field "cohort_id")
    ready_publish_by_cohort = @(Group-CountBy -Rows $readyPublishRows -Field "cohort_id")
    sendable_today_by_cohort = @(Group-CountBy -Rows $sendableTodayRows -Field "cohort_id")
    sendable_today_by_status = @(Group-CountBy -Rows $scheduledTodayRows -Field "queue_status")
    sendable_today_by_verification = @(Group-CountBy -Rows $sendableTodayRows -Field "verification_status")
    sendable_today_valid_send_by_cohort = @(Group-CountBy -Rows $sendableTodayValidSendRows -Field "cohort_id")
    sendable_today_by_contact_type = @(Group-CountBy -Rows $sendableTodayRows -Field "contact_type")
    followups_next_week_by_cohort = @(Group-CountBy -Rows $followupRows -Field "cohort_id")
    followups_next_week_by_contact_type = @(Group-CountBy -Rows $followupRows -Field "contact_type")
  }
  files = [pscustomobject]@{
    ready_validation_csv = $ReadyValidationCsv
    ready_publish_csv = $ReadyPublishCsv
    scheduled_today_csv = $ScheduledTodayCsv
    followups_csv = $FollowupsCsv
    output_json = $OutputJson
  }
}

$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputJson -Encoding UTF8

$report | ConvertTo-Json -Depth 8
