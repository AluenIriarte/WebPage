param(
  [string[]]$Cohorts = @(
    "icp_cosmetica_2026_04",
    "icp_cosmetica_stock_500_2026_04",
    "icp_cosmetica_expansion_2026_04"
  ),
  [int]$Limit = 5000,
  [string]$OutputCsv = (Join-Path $PSScriptRoot "..\reports\borderline-candidates-$((Get-Date).ToString('yyyy-MM-dd')).csv"),
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$freeDomains = @(
  "gmail.com",
  "hotmail.com",
  "hotmail.com.ar",
  "hotmail.es",
  "live.com",
  "live.com.ar",
  "outlook.com",
  "outlook.com.ar",
  "yahoo.com",
  "yahoo.com.ar",
  "yahoo.es",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "msn.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
  "t-online.de",
  "cs.com",
  "netscape.net"
)

$freeDomainsSql = ($freeDomains | ForEach-Object { "'" + ($_ -replace "'", "''") + "'" }) -join ", "
$cohortSql = ($Cohorts | ForEach-Object { "'" + ($_ -replace "'", "''") + "'" }) -join ", "

$query = @"
WITH valid_send_pool AS (
  SELECT
    pc.account_id,
    pc.contact_id AS entity_id,
    lower(pc.email) AS email,
    COALESCE(pc.lane_priority, 0) AS lane_priority,
    COALESCE(pc.account_contact_rank, 9999) AS account_contact_rank
  FROM outbound_prospect_contacts pc
  WHERE pc.verification_status = 'valid_send'

  UNION

  SELECT
    p.account_id,
    COALESCE(p.source_contact_id, p.id) AS entity_id,
    lower(p.email) AS email,
    COALESCE(p.lane_priority, 0) AS lane_priority,
    COALESCE(p.account_contact_rank, 9999) AS account_contact_rank
  FROM outbound_prospects p
  WHERE p.verification_status = 'valid_send'
),
borderline AS (
  SELECT
    pc.contact_id,
    pc.cohort_id,
    pc.account_id,
    a.company_name,
    pc.email,
    COALESCE(pc.email_domain, substr(pc.email, instr(pc.email, '@') + 1)) AS email_domain,
    a.domain AS account_domain,
    a.vertical,
    a.country,
    a.priority_tier,
    a.icp_fit_score,
    pc.contact_type,
    pc.message_variant,
    pc.primary_goal,
    pc.lane_priority,
    pc.account_contact_rank,
    pc.source_confidence,
    pc.prospecting_score,
    pc.verification_status AS verification_status_original,
    pc.verification_provider,
    COALESCE(pc.pipeline_status, pc.final_status) AS pipeline_status,
    pc.final_status,
    CASE
      WHEN lower(COALESCE(pc.email_domain, substr(pc.email, instr(pc.email, '@') + 1))) IN ($freeDomainsSql) THEN 1
      ELSE 0
    END AS is_free_domain,
    CASE
      WHEN lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'privacy*'
        OR lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'abuse*'
        OR lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'noreply*'
        OR lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'no-reply*'
        OR lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'webmaster*'
        OR lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'soporte*'
        OR lower(substr(pc.email, 1, instr(pc.email, '@') - 1)) GLOB 'support*'
      THEN 1
      ELSE 0
    END AS is_non_target_inbox,
    CASE
      WHEN a.domain IS NULL OR a.domain = '' THEN 0
      WHEN lower(COALESCE(pc.email_domain, substr(pc.email, instr(pc.email, '@') + 1))) = lower(a.domain) THEN 1
      WHEN lower(COALESCE(pc.email_domain, substr(pc.email, instr(pc.email, '@') + 1))) LIKE '%.' || lower(a.domain) THEN 1
      WHEN lower(a.domain) LIKE '%.' || lower(COALESCE(pc.email_domain, substr(pc.email, instr(pc.email, '@') + 1))) THEN 1
      ELSE 0
    END AS is_corporate_domain_aligned,
    CASE
      WHEN COALESCE(a.vertical, '') = '' THEN 0
      WHEN lower(a.vertical) LIKE '%cosmet%' THEN 0
      WHEN lower(a.vertical) LIKE '%perfum%' THEN 0
      WHEN lower(a.vertical) LIKE '%skincare%' THEN 0
      WHEN lower(a.vertical) LIKE '%cabell%' THEN 0
      WHEN lower(a.vertical) LIKE '%limpieza%' THEN 0
      WHEN lower(a.vertical) LIKE '%higiene%' THEN 0
      WHEN lower(a.vertical) LIKE '%maquill%' THEN 0
      WHEN lower(a.vertical) LIKE '%unas%' THEN 0
      ELSE 1
    END AS weak_vertical_fit,
    (
      SELECT COUNT(DISTINCT v.email)
      FROM valid_send_pool v
      WHERE v.account_id = pc.account_id
        AND v.entity_id <> pc.contact_id
        AND v.email <> lower(pc.email)
    ) AS account_valid_send_count,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM valid_send_pool v
        WHERE v.account_id = pc.account_id
          AND v.entity_id <> pc.contact_id
          AND v.email <> lower(pc.email)
      ) THEN 1
      ELSE 0
    END AS has_other_valid_send_in_account,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM valid_send_pool v
        WHERE v.account_id = pc.account_id
          AND v.entity_id <> pc.contact_id
          AND v.email <> lower(pc.email)
          AND (
            v.lane_priority > COALESCE(pc.lane_priority, 0)
            OR (
              v.lane_priority = COALESCE(pc.lane_priority, 0)
              AND v.account_contact_rank < COALESCE(pc.account_contact_rank, 9999)
            )
            OR (
              v.lane_priority = COALESCE(pc.lane_priority, 0)
              AND v.account_contact_rank = COALESCE(pc.account_contact_rank, 9999)
              AND v.email < lower(pc.email)
            )
          )
      ) THEN 1
      ELSE 0
    END AS has_better_valid_send_in_account
  FROM outbound_prospect_contacts pc
  LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
  WHERE pc.verification_status IN ('accept_all_review', 'risky_review')
    AND pc.cohort_id IN ($cohortSql)
)
SELECT *
FROM borderline
ORDER BY
  cohort_id ASC,
  priority_tier ASC,
  lane_priority DESC,
  account_contact_rank ASC,
  source_confidence DESC,
  email ASC
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
  cohorts = $Cohorts
  count = $rows.Count
  output_csv = $OutputCsv
} | ConvertTo-Json -Depth 4
