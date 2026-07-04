param(
  [string]$CampaignId = "dashboard_comercial_test_v1",
  [string]$WeekStart,
  [int]$Limit = 1000,
  [int]$BlockSize = 25,
  [string[]]$Times = @("09:30", "12:00", "15:30"),
  [string]$ReviewCsv,
  [string]$SummaryCsv,
  [string]$MetricsCsv,
  [string]$SqlOutput,
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

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

function Convert-LocalBuenosAiresToUtcIso {
  param(
    [datetime]$LocalDate,
    [string]$LocalTime
  )

  $offset = [TimeSpan]::FromHours(-3)
  $local = [DateTimeOffset]::ParseExact(
    ("{0}T{1}:00" -f $LocalDate.ToString("yyyy-MM-dd"), $LocalTime),
    "yyyy-MM-ddTHH:mm:ss",
    [System.Globalization.CultureInfo]::InvariantCulture,
    [System.Globalization.DateTimeStyles]::None
  )
  $withOffset = [DateTimeOffset]::new($local.Year, $local.Month, $local.Day, $local.Hour, $local.Minute, $local.Second, $offset)
  return $withOffset.UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.000Z")
}

function Sql-String {
  param([object]$Value)

  if ($null -eq $Value) {
    return "NULL"
  }

  $text = [string]$Value
  if ([string]::IsNullOrWhiteSpace($text)) {
    return "NULL"
  }

  return "'" + ($text -replace "'", "''") + "'"
}

function Invoke-D1Query {
  param([string]$Sql)

  $command = ($Sql -replace "\s+", " ").Trim()
  $json = npx wrangler d1 execute divine-bread-quote-requests --remote --config $WranglerConfig --json --command $command
  $parsed = ($json -join "`n") | ConvertFrom-Json
  $result = if ($parsed -is [array]) { $parsed[0] } else { $parsed }
  return @($result.results)
}

if ([string]::IsNullOrWhiteSpace($WeekStart)) {
  $WeekStart = (Get-NextMonday -FromDate (Get-Date)).ToString("yyyy-MM-dd")
}

$weekStartDate = [datetime]::ParseExact($WeekStart, "yyyy-MM-dd", [System.Globalization.CultureInfo]::InvariantCulture)
$weekEndDate = $weekStartDate.AddDays(4)

if (-not $ReviewCsv) {
  $ReviewCsv = Join-Path $PSScriptRoot "..\reports\followup-review-$WeekStart.csv"
}
if (-not $SummaryCsv) {
  $SummaryCsv = Join-Path $PSScriptRoot "..\reports\followup-summary-$WeekStart.csv"
}
if (-not $MetricsCsv) {
  $MetricsCsv = Join-Path $PSScriptRoot "..\reports\followup-contact-type-metrics-$WeekStart.csv"
}
if (-not $SqlOutput) {
  $SqlOutput = Join-Path $PSScriptRoot "..\sql\generated\d1-outbound-followups-held-$WeekStart.sql"
}

$candidateQuery = @"
SELECT
  prospect_id,
  account_id,
  account_name,
  account_domain,
  vertical,
  geo,
  country,
  priority_tier,
  company_name,
  email,
  contact_name,
  contact_role,
  email_type,
  contact_type,
  message_variant,
  primary_goal,
  lane_priority,
  account_contact_rank,
  prospecting_score,
  campaign_segment,
  current_step_number,
  next_step_number,
  next_step_delay_days,
  current_step_sent_at
FROM outbound_next_followup_candidates
WHERE campaign_id = '$CampaignId'
  AND next_step_number = 2
  AND COALESCE(campaign_segment, '') != 'internal_test'
ORDER BY
  lane_priority DESC,
  account_contact_rank ASC,
  current_step_sent_at ASC,
  prospecting_score DESC
LIMIT $Limit;
"@

$metricQuery = @"
SELECT
  COALESCE(p.contact_type, p.email_type, 'unknown') AS contact_type,
  COALESCE(p.message_variant, 'routing_v1') AS message_variant,
  COUNT(DISTINCT CASE
    WHEN q.step_number = 2 AND q.status IN ('pending', 'held', 'processing', 'sent')
    THEN p.id
  END) AS followups,
  COUNT(DISTINCT CASE WHEN p.status = 'replied' THEN p.id END) AS replies,
  COUNT(DISTINCT CASE WHEN e.event_type = 'wrong_person' THEN p.id END) AS useful_referrals,
  COUNT(DISTINCT CASE WHEN p.status = 'bounced' THEN p.id END) AS bounces,
  COUNT(DISTINCT CASE
    WHEN COALESCE(p.message_variant, 'routing_v1') = 'routing_v1'
     AND e.event_type = 'wrong_person'
    THEN COALESCE(p.account_id, p.domain, p.company_name)
  END) AS generic_routing_unlocked_accounts,
  COUNT(DISTINCT CASE
    WHEN COALESCE(p.message_variant, 'routing_v1') = 'admin_rescue_v1'
     AND e.event_type = 'wrong_person'
    THEN COALESCE(p.account_id, p.domain, p.company_name)
  END) AS admin_ops_unlocked_accounts
FROM outbound_prospects p
LEFT JOIN outbound_send_queue q
  ON q.prospect_id = p.id
 AND q.campaign_id = p.sequence_id
LEFT JOIN outbound_email_events e
  ON e.prospect_id = p.id
 AND e.campaign_id = p.sequence_id
WHERE p.sequence_id = '$CampaignId'
GROUP BY
  COALESCE(p.contact_type, p.email_type, 'unknown'),
  COALESCE(p.message_variant, 'routing_v1')
ORDER BY followups DESC, replies DESC;
"@

$candidateRows = Invoke-D1Query -Sql $candidateQuery
$metricRows = Invoke-D1Query -Sql $metricQuery

$eligible = foreach ($row in $candidateRows) {
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
    account_id = $row.account_id
    account_name = $row.account_name
    account_domain = $row.account_domain
    vertical = $row.vertical
    geo = $row.geo
    country = $row.country
    priority_tier = $row.priority_tier
    company_name = $row.company_name
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
    campaign_segment = $row.campaign_segment
    current_step_number = [int]$row.current_step_number
    next_step_number = [int]$row.next_step_number
    next_step_delay_days = [int]$row.next_step_delay_days
    current_step_sent_at = $row.current_step_sent_at
    due_local_date = $dueDate.ToString("yyyy-MM-dd")
  }
}

$eligible = @($eligible | Sort-Object due_local_date, @{ Expression = "lane_priority"; Descending = $true }, account_contact_rank, current_step_sent_at, @{ Expression = "prospecting_score"; Descending = $true }, email)

$capacityPerDay = $BlockSize * $Times.Count
$scheduleRows = New-Object System.Collections.Generic.List[object]

foreach ($group in ($eligible | Group-Object due_local_date)) {
  if ($group.Count -gt $capacityPerDay) {
    throw "La fecha $($group.Name) necesita $($group.Count) follow-ups y la capacidad diaria configurada es $capacityPerDay. Agrega mas slots o aumenta BlockSize."
  }

  for ($index = 0; $index -lt $group.Count; $index++) {
    $item = $group.Group[$index]
    $timeIndex = [math]::Floor($index / $BlockSize)
    $localTime = $Times[$timeIndex]
    $localDate = [datetime]::ParseExact($group.Name, "yyyy-MM-dd", [System.Globalization.CultureInfo]::InvariantCulture)
    $scheduledAt = Convert-LocalBuenosAiresToUtcIso -LocalDate $localDate -LocalTime $localTime
    $queueId = "$CampaignId`:$($item.prospect_id):2"

    $scheduleRows.Add([pscustomobject]@{
      queue_id = $queueId
      prospect_id = $item.prospect_id
      account_id = $item.account_id
      account_name = $item.account_name
      email = $item.email
      contact_type = $item.contact_type
      message_variant = $item.message_variant
      primary_goal = $item.primary_goal
      lane_priority = $item.lane_priority
      account_contact_rank = $item.account_contact_rank
      priority_tier = $item.priority_tier
      country = $item.country
      due_local_date = $item.due_local_date
      scheduled_local_date = $group.Name
      scheduled_local_time = $localTime
      scheduled_at = $scheduledAt
      current_step_sent_at = $item.current_step_sent_at
      status = "held"
    }) | Out-Null
  }
}

$summaryRows = @(
  $scheduleRows |
    Group-Object message_variant, priority_tier, country |
    ForEach-Object {
      $parts = $_.Name -split ", "
      [pscustomobject]@{
        message_variant = $parts[0]
        priority_tier = $parts[1]
        country = $parts[2]
        followups = $_.Count
      }
    } |
    Sort-Object @{ Expression = "followups"; Descending = $true }, message_variant, priority_tier, country
)

$sqlLines = New-Object System.Collections.Generic.List[string]
$sqlLines.Add("-- Generated by outbound/scripts/plan-followups-by-lane.ps1") | Out-Null
$sqlLines.Add("-- Campaign: $CampaignId") | Out-Null
$sqlLines.Add("-- Week start: $WeekStart America/Buenos_Aires") | Out-Null
$sqlLines.Add("") | Out-Null

foreach ($row in $scheduleRows) {
  $sqlLines.Add(@"
INSERT OR IGNORE INTO outbound_send_queue (
  id,
  campaign_id,
  prospect_id,
  step_number,
  scheduled_at,
  status,
  attempts,
  created_at,
  updated_at
) VALUES (
  $(Sql-String $row.queue_id),
  $(Sql-String $CampaignId),
  $(Sql-String $row.prospect_id),
  2,
  $(Sql-String $row.scheduled_at),
  'held',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

UPDATE outbound_prospects
SET next_send_at = $(Sql-String $row.scheduled_at),
    updated_at = CURRENT_TIMESTAMP
WHERE id = $(Sql-String $row.prospect_id)
  AND status NOT IN ('replied', 'bounced', 'unsubscribed', 'do_not_contact', 'paused');
"@) | Out-Null
}

foreach ($path in @($ReviewCsv, $SummaryCsv, $MetricsCsv, $SqlOutput)) {
  New-Item -ItemType Directory -Path (Split-Path -Parent $path) -Force | Out-Null
}

@($scheduleRows) | Export-Csv -LiteralPath $ReviewCsv -NoTypeInformation -Encoding UTF8
@($summaryRows) | Export-Csv -LiteralPath $SummaryCsv -NoTypeInformation -Encoding UTF8
@($metricRows) | Export-Csv -LiteralPath $MetricsCsv -NoTypeInformation -Encoding UTF8
$sqlLines -join "`n" | Set-Content -LiteralPath $SqlOutput -Encoding UTF8

[pscustomobject]@{
  campaign_id = $CampaignId
  week_start = $WeekStart
  eligible_followups = $eligible.Count
  scheduled_followups = $scheduleRows.Count
  review_csv = $ReviewCsv
  summary_csv = $SummaryCsv
  metrics_csv = $MetricsCsv
  sql_output = $SqlOutput
} | ConvertTo-Json
