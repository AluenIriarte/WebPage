param(
  [string]$CampaignId = "dashboard_comercial_test_v1",
  [string]$LocalDate,
  [string]$ValidationPolicy = "valid-only",
  [string]$WranglerConfig = (Join-Path $PSScriptRoot "..\workers\wrangler.toml")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $LocalDate) {
  throw "Use -LocalDate yyyy-MM-dd"
}

$validationPolicyNormalized = $ValidationPolicy.ToLowerInvariant()
$validationFilter = switch ($validationPolicyNormalized) {
  "valid-only" { "AND p.verification_status = 'valid_send'" }
  "valid-and-review" { "AND p.verification_status IN ('valid_send', 'accept_all_review', 'risky_review')" }
  "any" { "" }
  default { throw "Invalid -ValidationPolicy. Use valid-only, valid-and-review, or any." }
}

$start = [DateTimeOffset]::Parse("$LocalDate`T00:00:00-03:00").UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.000Z")
$end = [DateTimeOffset]::Parse("$LocalDate`T23:59:59-03:00").UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.000Z")

$command = @"
UPDATE outbound_send_queue
SET status='pending', updated_at=CURRENT_TIMESTAMP
WHERE campaign_id='$CampaignId'
  AND status='held'
  AND scheduled_at >= '$start'
  AND scheduled_at <= '$end'
  AND EXISTS (
    SELECT 1
    FROM outbound_prospects p
    WHERE p.id = outbound_send_queue.prospect_id
      $validationFilter
  );

UPDATE outbound_prospects
SET status='scheduled', updated_at=CURRENT_TIMESTAMP
WHERE id IN (
  SELECT q.prospect_id
  FROM outbound_send_queue q
  WHERE q.campaign_id='$CampaignId'
    AND q.status='pending'
    AND q.scheduled_at >= '$start'
    AND q.scheduled_at <= '$end'
    AND EXISTS (
      SELECT 1
      FROM outbound_prospects p
      WHERE p.id = q.prospect_id
        $validationFilter
    )
);

UPDATE outbound_campaigns
SET daily_limit = (
    SELECT COUNT(*)
    FROM outbound_send_queue q
    WHERE q.campaign_id='$CampaignId'
      AND q.status='pending'
      AND q.scheduled_at >= '$start'
      AND q.scheduled_at <= '$end'
      AND EXISTS (
        SELECT 1
        FROM outbound_prospects p
        WHERE p.id = q.prospect_id
          $validationFilter
      )
  ),
  updated_at=CURRENT_TIMESTAMP
WHERE id='$CampaignId';
"@

npx wrangler d1 execute divine-bread-quote-requests --remote --command $command --config $WranglerConfig
