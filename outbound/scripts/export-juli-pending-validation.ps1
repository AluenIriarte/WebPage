param(
  [string]$OutputCsv = (Join-Path $PSScriptRoot "..\data\validation\emailable\juli-pending-validation-$((Get-Date).ToString('yyyy-MM-dd-HHmmss')).csv"),
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$query = @"
SELECT
  p.id AS prospect_id,
  p.company_name,
  p.domain,
  p.email,
  p.email_type,
  p.contact_name,
  p.contact_role,
  p.status,
  q.id AS queue_id,
  q.status AS queue_status,
  q.scheduled_at
FROM outbound_prospects p
LEFT JOIN outbound_send_queue q
  ON q.prospect_id = p.id
 AND q.campaign_id = p.sequence_id
 AND q.step_number = 1
WHERE p.cohort_id = 'test_juli'
  AND p.status = 'approved'
  AND COALESCE(p.verification_provider, '') != 'emailable'
  AND COALESCE(p.campaign_segment, '') != 'internal_test'
ORDER BY p.icp_score DESC, p.company_name ASC, p.email ASC;
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
