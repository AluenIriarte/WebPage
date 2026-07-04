CREATE TABLE IF NOT EXISTS outbound_cohorts (
  cohort_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE outbound_prospects ADD COLUMN cohort_id TEXT;
ALTER TABLE outbound_accounts ADD COLUMN cohort_id TEXT;
ALTER TABLE outbound_accounts ADD COLUMN last_public_discovery_at TEXT;
ALTER TABLE outbound_raw_email_hits ADD COLUMN cohort_id TEXT;
ALTER TABLE outbound_raw_email_hits ADD COLUMN crawl_job_id TEXT;
ALTER TABLE outbound_raw_email_hits ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE outbound_emails_normalized ADD COLUMN cohort_id TEXT;
ALTER TABLE outbound_emails_normalized ADD COLUMN source_url TEXT;
ALTER TABLE outbound_prospect_contacts ADD COLUMN cohort_id TEXT;
ALTER TABLE outbound_prospect_contacts ADD COLUMN email_domain TEXT;
ALTER TABLE outbound_prospect_contacts ADD COLUMN relevance_score INTEGER;

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_cohort
  ON outbound_prospects(cohort_id);

CREATE INDEX IF NOT EXISTS idx_outbound_accounts_cohort
  ON outbound_accounts(cohort_id, status, priority_tier);

CREATE INDEX IF NOT EXISTS idx_outbound_raw_email_hits_cohort
  ON outbound_raw_email_hits(cohort_id, account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_emails_normalized_cohort
  ON outbound_emails_normalized(cohort_id, status, contact_type);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_cohort
  ON outbound_prospect_contacts(cohort_id, final_status, prospecting_score);

CREATE TABLE IF NOT EXISTS outbound_crawl_jobs (
  crawl_job_id TEXT PRIMARY KEY,
  cohort_id TEXT,
  account_id TEXT,
  job_type TEXT NOT NULL DEFAULT 'public_email_discovery',
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TEXT,
  finished_at TEXT,
  pages_scanned INTEGER NOT NULL DEFAULT 0,
  emails_found INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_crawl_jobs_cohort
  ON outbound_crawl_jobs(cohort_id, status, started_at);

CREATE INDEX IF NOT EXISTS idx_outbound_crawl_jobs_account
  ON outbound_crawl_jobs(account_id, started_at);

INSERT OR IGNORE INTO outbound_cohorts (
  cohort_id,
  name,
  description,
  source,
  status
) VALUES
  (
    'test_juli',
    'Test Juli',
    'Base inicial de testeo provista por Juli, usada para validar flujo Brevo + Worker.',
    'juli_test_base',
    'active'
  ),
  (
    'icp_cosmetica_2026_04',
    'ICP cosmetica mayorista abril 2026',
    'Empresas ICP de perfumeria, cosmetica, belleza y cuidado personal para discovery publico.',
    'ai_account_research',
    'active'
  );

UPDATE outbound_prospects
SET cohort_id = 'test_juli',
    updated_at = CURRENT_TIMESTAMP
WHERE cohort_id IS NULL
  AND sequence_id = 'dashboard_comercial_test_v1';

UPDATE outbound_accounts
SET cohort_id = 'test_juli',
    updated_at = CURRENT_TIMESTAMP
WHERE cohort_id IS NULL
  AND account_id IN (
    SELECT DISTINCT account_id
    FROM outbound_prospects
    WHERE cohort_id = 'test_juli'
      AND account_id IS NOT NULL
  );

DROP VIEW IF EXISTS outbound_account_performance;

CREATE VIEW outbound_account_performance AS
SELECT
  COALESCE(p.cohort_id, a.cohort_id, 'unknown') AS cohort_id,
  COALESCE(a.account_id, p.account_id, p.domain, p.company_name) AS account_key,
  COALESCE(a.company_name, p.company_name) AS account_name,
  COALESCE(a.domain, p.domain) AS domain,
  COALESCE(a.vertical, p.industry) AS vertical,
  a.geo,
  a.priority_tier,
  p.campaign_segment,
  COUNT(DISTINCT p.id) AS contacts,
  COUNT(DISTINCT CASE WHEN q.status = 'sent' THEN q.id END) AS emails_sent,
  COUNT(DISTINCT CASE WHEN q.step_number = 1 AND q.status = 'sent' THEN q.id END) AS step_1_sent,
  COUNT(DISTINCT CASE WHEN q.step_number = 2 AND q.status = 'sent' THEN q.id END) AS step_2_sent,
  COUNT(DISTINCT CASE WHEN q.step_number = 3 AND q.status = 'sent' THEN q.id END) AS step_3_sent,
  COUNT(DISTINCT CASE WHEN p.status = 'replied' THEN p.id END) AS replied_contacts,
  COUNT(DISTINCT CASE WHEN p.status = 'bounced' THEN p.id END) AS bounced_contacts,
  COUNT(DISTINCT CASE WHEN p.status = 'unsubscribed' THEN p.id END) AS unsubscribed_contacts,
  COUNT(DISTINCT CASE WHEN p.status = 'do_not_contact' THEN p.id END) AS do_not_contact_contacts,
  COUNT(DISTINCT CASE WHEN e.event_type IN ('positive_reply', 'interested', 'meeting') THEN p.id END) AS positive_reply_contacts,
  COUNT(DISTINCT CASE WHEN e.event_type = 'wrong_person' THEN p.id END) AS wrong_person_contacts,
  COUNT(DISTINCT CASE WHEN e.event_type = 'not_interested' THEN p.id END) AS not_interested_contacts
FROM outbound_prospects p
LEFT JOIN outbound_accounts a ON a.account_id = p.account_id
LEFT JOIN outbound_send_queue q ON q.prospect_id = p.id
LEFT JOIN outbound_email_events e ON e.prospect_id = p.id
GROUP BY
  COALESCE(p.cohort_id, a.cohort_id, 'unknown'),
  COALESCE(a.account_id, p.account_id, p.domain, p.company_name),
  COALESCE(a.company_name, p.company_name),
  COALESCE(a.domain, p.domain),
  COALESCE(a.vertical, p.industry),
  a.geo,
  a.priority_tier,
  p.campaign_segment;

DROP VIEW IF EXISTS outbound_accounts_pending_discovery;

CREATE VIEW outbound_accounts_pending_discovery AS
SELECT
  a.*
FROM outbound_accounts a
WHERE a.domain IS NOT NULL
  AND TRIM(a.domain) != ''
  AND a.status IN ('candidate', 'approved', 'active')
  AND (
    a.last_public_discovery_at IS NULL
    OR datetime(a.last_public_discovery_at) < datetime('now', '-14 days')
  );
