param(
  [string]$CampaignId = "dashboard_comercial_test_v1",
  [int]$NextStep = 2,
  [int]$Limit = 500,
  [string]$OutputCsv = (Join-Path $PSScriptRoot "..\reports\followups-$((Get-Date).ToString('yyyy-MM-dd')).csv"),
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$query = @"
SELECT
  prospect_id,
  account_id,
  account_name,
  account_domain,
  vertical,
  geo,
  country,
  priority_tier,
  email,
  contact_name,
  contact_role,
  email_type,
  contact_type,
  message_variant,
  primary_goal,
  lane_priority,
  account_contact_rank,
  campaign_segment,
  current_step_number,
  next_step_number,
  next_step_delay_days,
  current_step_sent_at
FROM outbound_next_followup_candidates
WHERE campaign_id = '$CampaignId'
  AND next_step_number = $NextStep
  AND COALESCE(campaign_segment, '') != 'internal_test'
ORDER BY lane_priority DESC, account_contact_rank ASC, current_step_sent_at ASC, prospecting_score DESC
LIMIT $Limit;
"@
$query = ($query -replace "\s+", " ").Trim()

$json = npx wrangler d1 execute divine-bread-quote-requests --remote --config $WranglerConfig --json --command $query
$parsed = ($json -join "`n") | ConvertFrom-Json
$result = if ($parsed -is [array]) { $parsed[0] } else { $parsed }
$rows = @($result.results)

New-Item -ItemType Directory -Path (Split-Path -Parent $OutputCsv) -Force | Out-Null
$rows | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Encoding UTF8

[pscustomobject]@{
  campaign_id = $CampaignId
  next_step = $NextStep
  count = $rows.Count
  output_csv = $OutputCsv
} | ConvertTo-Json
