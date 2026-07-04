param(
  [string]$CohortId = "icp_cosmetica_2026_04",
  [int]$Limit = 2000,
  [string]$OutputCsv = (Join-Path $PSScriptRoot "..\reports\contact-stock-$CohortId-$((Get-Date).ToString('yyyy-MM-dd')).csv"),
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$query = @"
SELECT
  pc.contact_id,
  pc.cohort_id,
  pc.account_id,
  a.company_name,
  a.domain,
  a.vertical,
  a.geo,
  a.priority_tier,
  a.icp_fit_score,
  pc.email,
  pc.email_domain,
  pc.full_name,
  pc.role_guess,
  pc.department_guess,
  pc.contact_type,
  pc.message_variant,
  pc.primary_goal,
  pc.lane_priority,
  pc.account_contact_rank,
  pc.source_url,
  pc.source_confidence,
  pc.relevance_score,
  pc.prospecting_score,
  pc.verification_status,
  COALESCE(pc.pipeline_status, pc.final_status) AS pipeline_status,
  pc.final_status,
  pc.notes
FROM outbound_prospect_contacts pc
LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
WHERE pc.cohort_id = '$CohortId'
  AND COALESCE(pc.pipeline_status, pc.final_status) IN ('candidate_validation', 'routing_only_pre_validation', 'review_pre_validation')
  AND COALESCE(pc.verification_status, 'pending') IN ('', 'pending')
ORDER BY
  CASE COALESCE(pc.pipeline_status, pc.final_status)
    WHEN 'candidate_validation' THEN 0
    WHEN 'routing_only_pre_validation' THEN 1
    WHEN 'review_pre_validation' THEN 2
    ELSE 3
  END,
  pc.lane_priority DESC,
  pc.account_contact_rank ASC,
  pc.prospecting_score DESC,
  pc.source_confidence DESC,
  pc.email ASC
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
  cohort_id = $CohortId
  count = $rows.Count
  output_csv = $OutputCsv
} | ConvertTo-Json
