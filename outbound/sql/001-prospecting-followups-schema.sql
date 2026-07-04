-- Prospecting source-of-truth tables and follow-up reporting views.
-- Apply additively. For existing D1 databases, add outbound_prospects
-- columns only if they are missing before running the CREATE statements.

ALTER TABLE outbound_prospects ADD COLUMN account_id TEXT;
ALTER TABLE outbound_prospects ADD COLUMN source_contact_id TEXT;
ALTER TABLE outbound_prospects ADD COLUMN source_url TEXT;
ALTER TABLE outbound_prospects ADD COLUMN source_confidence INTEGER;
ALTER TABLE outbound_prospects ADD COLUMN verification_status TEXT;
ALTER TABLE outbound_prospects ADD COLUMN verification_provider TEXT;
ALTER TABLE outbound_prospects ADD COLUMN deliverability_score INTEGER;
ALTER TABLE outbound_prospects ADD COLUMN prospecting_score INTEGER;
ALTER TABLE outbound_prospects ADD COLUMN final_status TEXT;
ALTER TABLE outbound_prospects ADD COLUMN last_verified_at TEXT;

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_account
  ON outbound_prospects(account_id);

CREATE TABLE IF NOT EXISTS outbound_accounts (
  account_id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT,
  website TEXT,
  vertical TEXT,
  geo TEXT,
  country TEXT,
  province TEXT,
  city TEXT,
  size_hint TEXT,
  icp_fit_score INTEGER NOT NULL DEFAULT 0,
  priority_tier TEXT,
  status TEXT NOT NULL DEFAULT 'candidate',
  source TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_accounts_domain
  ON outbound_accounts(domain);

CREATE INDEX IF NOT EXISTS idx_outbound_accounts_status
  ON outbound_accounts(status, priority_tier);

CREATE TABLE IF NOT EXISTS outbound_raw_email_hits (
  hit_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  email TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT,
  source_title TEXT,
  context_snippet TEXT,
  discovered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_raw_email_hits_account
  ON outbound_raw_email_hits(account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_raw_email_hits_email
  ON outbound_raw_email_hits(email);

CREATE TABLE IF NOT EXISTS outbound_emails_normalized (
  email_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  email TEXT NOT NULL,
  email_domain TEXT,
  email_local TEXT,
  normalized_from_hits TEXT,
  syntax_valid INTEGER NOT NULL DEFAULT 0,
  contact_type TEXT,
  person_name TEXT,
  role_guess TEXT,
  department_guess TEXT,
  evidence_score INTEGER NOT NULL DEFAULT 0,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'candidate',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, email)
);

CREATE INDEX IF NOT EXISTS idx_outbound_emails_normalized_account
  ON outbound_emails_normalized(account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_emails_normalized_status
  ON outbound_emails_normalized(status, contact_type);

CREATE TABLE IF NOT EXISTS outbound_email_verifications (
  verification_id TEXT PRIMARY KEY,
  email_id TEXT NOT NULL,
  email TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  quality_score INTEGER,
  is_accept_all INTEGER,
  is_role_based INTEGER,
  is_disposable INTEGER,
  is_toxic INTEGER,
  reason TEXT,
  verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  raw_response_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_outbound_email_verifications_email
  ON outbound_email_verifications(email, verified_at);

CREATE INDEX IF NOT EXISTS idx_outbound_email_verifications_email_id
  ON outbound_email_verifications(email_id, verified_at);

CREATE TABLE IF NOT EXISTS outbound_prospect_contacts (
  contact_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  email_id TEXT,
  email TEXT NOT NULL,
  full_name TEXT,
  role_guess TEXT,
  department_guess TEXT,
  contact_type TEXT,
  source_url TEXT,
  source_confidence INTEGER,
  verification_status TEXT,
  verification_provider TEXT,
  deliverability_score INTEGER NOT NULL DEFAULT 0,
  prospecting_score INTEGER NOT NULL DEFAULT 0,
  final_status TEXT NOT NULL DEFAULT 'review',
  last_verified_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, email)
);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_account
  ON outbound_prospect_contacts(account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_status
  ON outbound_prospect_contacts(final_status, prospecting_score);

CREATE VIEW IF NOT EXISTS outbound_next_followup_candidates AS
SELECT
  p.id AS prospect_id,
  p.account_id,
  p.source_contact_id,
  COALESCE(a.company_name, p.company_name) AS account_name,
  COALESCE(a.domain, p.domain) AS account_domain,
  a.vertical,
  a.geo,
  a.priority_tier,
  p.company_name,
  p.email,
  p.contact_name,
  p.contact_role,
  p.email_type,
  p.prospecting_score,
  p.campaign_segment,
  p.sequence_id AS campaign_id,
  p.sequence_step AS current_step_number,
  s_next.step_number AS next_step_number,
  s_next.delay_days AS next_step_delay_days,
  p.status AS prospect_status,
  p.last_sent_at,
  p.next_send_at,
  q_current.sent_at AS current_step_sent_at
FROM outbound_prospects p
JOIN outbound_campaign_steps s_next
  ON s_next.campaign_id = p.sequence_id
 AND s_next.step_number = p.sequence_step + 1
 AND s_next.active = 1
LEFT JOIN outbound_accounts a ON a.account_id = p.account_id
LEFT JOIN outbound_send_queue q_current
  ON q_current.campaign_id = p.sequence_id
 AND q_current.prospect_id = p.id
 AND q_current.step_number = p.sequence_step
 AND q_current.status = 'sent'
WHERE p.sequence_step >= 1
  AND p.status = 'sent_step_' || p.sequence_step
  AND p.replied_at IS NULL
  AND p.bounced_at IS NULL
  AND p.unsubscribed_at IS NULL
  AND p.do_not_contact_reason IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM outbound_send_queue q_next
    WHERE q_next.campaign_id = p.sequence_id
      AND q_next.prospect_id = p.id
      AND q_next.step_number = s_next.step_number
      AND q_next.status IN ('pending', 'held', 'processing', 'sent')
  );

CREATE VIEW IF NOT EXISTS outbound_account_performance AS
SELECT
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
  COALESCE(a.account_id, p.account_id, p.domain, p.company_name),
  COALESCE(a.company_name, p.company_name),
  COALESCE(a.domain, p.domain),
  COALESCE(a.vertical, p.industry),
  a.geo,
  a.priority_tier,
  p.campaign_segment;
