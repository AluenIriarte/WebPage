param(
  [string]$OutputCsv = (Join-Path $PSScriptRoot "..\reports\monthly-performance-$((Get-Date).ToString('yyyy-MM')).csv"),
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$query = @"
SELECT
  account_key,
  account_name,
  domain,
  vertical,
  geo,
  country,
  priority_tier,
  campaign_segment,
  contacts,
  emails_sent,
  step_1_sent,
  step_2_sent,
  step_3_sent,
  replied_contacts,
  positive_reply_contacts,
  wrong_person_contacts,
  not_interested_contacts,
  bounced_contacts,
  unsubscribed_contacts,
  do_not_contact_contacts
FROM outbound_account_performance
ORDER BY positive_reply_contacts DESC, replied_contacts DESC, emails_sent DESC;
"@
$query = ($query -replace "\s+", " ").Trim()

$json = npx wrangler d1 execute divine-bread-quote-requests --remote --config $WranglerConfig --json --command $query
$parsed = ($json -join "`n") | ConvertFrom-Json
$result = if ($parsed -is [array]) { $parsed[0] } else { $parsed }
$rows = @($result.results)

New-Item -ItemType Directory -Path (Split-Path -Parent $OutputCsv) -Force | Out-Null
$rows | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Encoding UTF8

[pscustomobject]@{
  count = $rows.Count
  output_csv = $OutputCsv
} | ConvertTo-Json
