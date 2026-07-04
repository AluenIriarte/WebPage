CREATE TABLE IF NOT EXISTS outbound_prospects (
  id TEXT PRIMARY KEY,
  cohort_id TEXT,
  account_id TEXT,
  source_contact_id TEXT,
  company_name TEXT NOT NULL,
  website TEXT,
  domain TEXT,
  email TEXT NOT NULL UNIQUE,
  email_type TEXT,
  contact_type TEXT,
  contact_route TEXT,
  contact_name TEXT,
  contact_role TEXT,
  industry TEXT,
  sub_industry TEXT,
  company_type TEXT,
  country TEXT,
  province TEXT,
  city TEXT,
  icp_fit TEXT,
  icp_score INTEGER NOT NULL DEFAULT 0,
  priority TEXT,
  source TEXT,
  campaign_segment TEXT,
  sequence_id TEXT,
  sequence_step INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved',
  tags TEXT,
  validation_flags TEXT,
  last_sent_at TEXT,
  next_send_at TEXT,
  replied_at TEXT,
  bounced_at TEXT,
  unsubscribed_at TEXT,
  do_not_contact_reason TEXT,
  notes TEXT,
  brevo_contact_id TEXT,
  brevo_last_event TEXT,
  source_url TEXT,
  source_confidence INTEGER,
  verification_status TEXT,
  verification_provider TEXT,
  deliverability_score INTEGER,
  prospecting_score INTEGER,
  final_status TEXT,
  message_variant TEXT,
  primary_goal TEXT,
  lane_priority INTEGER NOT NULL DEFAULT 0,
  account_contact_rank INTEGER,
  last_verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_email
  ON outbound_prospects(email);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_status
  ON outbound_prospects(status);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_sequence
  ON outbound_prospects(sequence_id, sequence_step);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_segment
  ON outbound_prospects(campaign_segment);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_account
  ON outbound_prospects(account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_cohort
  ON outbound_prospects(cohort_id);

CREATE INDEX IF NOT EXISTS idx_outbound_prospects_lane
  ON outbound_prospects(account_id, lane_priority, account_contact_rank);

CREATE TABLE IF NOT EXISTS outbound_cohorts (
  cohort_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outbound_accounts (
  account_id TEXT PRIMARY KEY,
  cohort_id TEXT,
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
  last_public_discovery_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_accounts_cohort
  ON outbound_accounts(cohort_id, status, priority_tier);

CREATE INDEX IF NOT EXISTS idx_outbound_accounts_domain
  ON outbound_accounts(domain);

CREATE INDEX IF NOT EXISTS idx_outbound_accounts_status
  ON outbound_accounts(status, priority_tier);

CREATE TABLE IF NOT EXISTS outbound_raw_email_hits (
  hit_id TEXT PRIMARY KEY,
  cohort_id TEXT,
  account_id TEXT NOT NULL,
  email TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT,
  source_title TEXT,
  context_snippet TEXT,
  crawl_job_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  discovered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_raw_email_hits_cohort
  ON outbound_raw_email_hits(cohort_id, account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_raw_email_hits_account
  ON outbound_raw_email_hits(account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_raw_email_hits_email
  ON outbound_raw_email_hits(email);

CREATE TABLE IF NOT EXISTS outbound_emails_normalized (
  email_id TEXT PRIMARY KEY,
  cohort_id TEXT,
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
  source_url TEXT,
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

CREATE INDEX IF NOT EXISTS idx_outbound_emails_normalized_cohort
  ON outbound_emails_normalized(cohort_id, status, contact_type);

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
  cohort_id TEXT,
  account_id TEXT NOT NULL,
  email_id TEXT,
  email TEXT NOT NULL,
  email_domain TEXT,
  full_name TEXT,
  role_guess TEXT,
  department_guess TEXT,
  contact_type TEXT,
  message_variant TEXT,
  primary_goal TEXT,
  lane_priority INTEGER NOT NULL DEFAULT 0,
  account_contact_rank INTEGER,
  source_url TEXT,
  source_confidence INTEGER,
  relevance_score INTEGER,
  verification_status TEXT,
  verification_provider TEXT,
  deliverability_score INTEGER NOT NULL DEFAULT 0,
  second_filter_original_status TEXT,
  second_filter_status TEXT,
  second_filter_score INTEGER,
  second_filter_reason TEXT,
  second_filter_at TEXT,
  prospecting_score INTEGER NOT NULL DEFAULT 0,
  pipeline_status TEXT,
  final_status TEXT NOT NULL DEFAULT 'review',
  last_verified_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, email)
);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_account
  ON outbound_prospect_contacts(account_id);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_cohort
  ON outbound_prospect_contacts(cohort_id, final_status, prospecting_score);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_status
  ON outbound_prospect_contacts(final_status, prospecting_score);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_pipeline_status
  ON outbound_prospect_contacts(pipeline_status, prospecting_score);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_lane
  ON outbound_prospect_contacts(account_id, lane_priority, account_contact_rank);

CREATE INDEX IF NOT EXISTS idx_outbound_prospect_contacts_second_filter
  ON outbound_prospect_contacts(second_filter_status, second_filter_at);

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

CREATE TABLE IF NOT EXISTS outbound_campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  timezone TEXT NOT NULL DEFAULT 'America/Buenos_Aires',
  daily_limit INTEGER NOT NULL DEFAULT 150,
  hourly_limit INTEGER NOT NULL DEFAULT 25,
  block_size INTEGER NOT NULL DEFAULT 25,
  send_window_start TEXT NOT NULL DEFAULT '09:30',
  send_window_end TEXT NOT NULL DEFAULT '17:30',
  send_days TEXT NOT NULL DEFAULT '1,2,3,4,5',
  summary_time TEXT NOT NULL DEFAULT '18:15',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outbound_campaign_steps (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  message_variant TEXT NOT NULL DEFAULT 'routing_v1',
  step_number INTEGER NOT NULL,
  delay_days INTEGER NOT NULL DEFAULT 0,
  subject TEXT NOT NULL,
  text_content TEXT NOT NULL,
  html_content TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, message_variant, step_number)
);

CREATE INDEX IF NOT EXISTS idx_outbound_campaign_steps_campaign
  ON outbound_campaign_steps(campaign_id, message_variant, step_number);

CREATE TABLE IF NOT EXISTS outbound_send_queue (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  prospect_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  locked_at TEXT,
  sent_at TEXT,
  failed_at TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  brevo_message_id TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, prospect_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_outbound_send_queue_due
  ON outbound_send_queue(status, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_outbound_send_queue_campaign
  ON outbound_send_queue(campaign_id, step_number);

CREATE TABLE IF NOT EXISTS outbound_email_events (
  id TEXT PRIMARY KEY,
  campaign_id TEXT,
  prospect_id TEXT,
  queue_id TEXT,
  email TEXT,
  event_type TEXT NOT NULL,
  event_at TEXT NOT NULL,
  payload TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_email_events_email
  ON outbound_email_events(email, event_at);

CREATE TABLE IF NOT EXISTS outbound_daily_summaries (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  summary_date TEXT NOT NULL,
  payload TEXT NOT NULL,
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, summary_date)
);

CREATE TABLE IF NOT EXISTS outbound_weekly_summaries (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  week_start_date TEXT NOT NULL,
  week_end_date TEXT NOT NULL,
  payload TEXT NOT NULL,
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, week_start_date)
);

CREATE TABLE IF NOT EXISTS outbound_account_followups (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  campaign_id TEXT,
  prospect_id TEXT,
  followup_kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  owner TEXT,
  current_contact_email TEXT,
  next_action TEXT,
  fallback_action TEXT,
  review_after TEXT,
  notes TEXT,
  resolved_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbound_account_followups_open
  ON outbound_account_followups(status, review_after);

CREATE INDEX IF NOT EXISTS idx_outbound_account_followups_account
  ON outbound_account_followups(account_id, status, followup_kind);

CREATE VIEW IF NOT EXISTS outbound_next_followup_candidates AS
SELECT
  p.id AS prospect_id,
  p.account_id,
  p.source_contact_id,
  COALESCE(a.company_name, p.company_name) AS account_name,
  COALESCE(a.domain, p.domain) AS account_domain,
  COALESCE(a.vertical, p.industry) AS vertical,
  a.geo,
  COALESCE(a.country, p.country) AS country,
  COALESCE(a.priority_tier, p.priority) AS priority_tier,
  p.company_name,
  p.email,
  p.contact_name,
  p.contact_role,
  p.email_type,
  COALESCE(p.contact_type, p.email_type) AS contact_type,
  COALESCE(p.message_variant, 'routing_v1') AS message_variant,
  p.primary_goal,
  COALESCE(p.lane_priority, 0) AS lane_priority,
  COALESCE(p.account_contact_rank, 9999) AS account_contact_rank,
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
 AND s_next.message_variant = COALESCE(p.message_variant, 'routing_v1')
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
  )
  AND NOT EXISTS (
    SELECT 1
    FROM outbound_prospects p_competing
    WHERE p_competing.account_id = p.account_id
      AND p_competing.id != p.id
      AND p_competing.replied_at IS NULL
      AND p_competing.bounced_at IS NULL
      AND p_competing.unsubscribed_at IS NULL
      AND p_competing.do_not_contact_reason IS NULL
      AND (
        p_competing.status LIKE 'sent_step_%'
        OR EXISTS (
          SELECT 1
          FROM outbound_send_queue q_competing
          WHERE q_competing.prospect_id = p_competing.id
            AND q_competing.campaign_id = p_competing.sequence_id
            AND q_competing.status IN ('pending', 'held', 'processing')
        )
      )
      AND (
        COALESCE(p_competing.lane_priority, 0) > COALESCE(p.lane_priority, 0)
        OR (
          COALESCE(p_competing.lane_priority, 0) = COALESCE(p.lane_priority, 0)
          AND COALESCE(p_competing.account_contact_rank, 9999) < COALESCE(p.account_contact_rank, 9999)
        )
        OR (
          COALESCE(p_competing.lane_priority, 0) = COALESCE(p.lane_priority, 0)
          AND COALESCE(p_competing.account_contact_rank, 9999) = COALESCE(p.account_contact_rank, 9999)
          AND p_competing.id < p.id
        )
      )
  );

CREATE VIEW IF NOT EXISTS outbound_account_performance AS
SELECT
  COALESCE(p.cohort_id, a.cohort_id, 'unknown') AS cohort_id,
  COALESCE(a.account_id, p.account_id, p.domain, p.company_name) AS account_key,
  COALESCE(a.company_name, p.company_name) AS account_name,
  COALESCE(a.domain, p.domain) AS domain,
  COALESCE(a.vertical, p.industry) AS vertical,
  a.geo,
  COALESCE(a.country, p.country) AS country,
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
  COALESCE(a.country, p.country),
  a.priority_tier,
  p.campaign_segment;

CREATE VIEW IF NOT EXISTS outbound_contact_type_performance AS
SELECT
  COALESCE(p.cohort_id, a.cohort_id, 'unknown') AS cohort_id,
  COALESCE(p.contact_type, p.email_type, 'unknown') AS contact_type,
  COALESCE(p.message_variant, 'routing_v1') AS message_variant,
  COALESCE(p.primary_goal, 'unknown') AS primary_goal,
  COALESCE(a.priority_tier, p.priority, 'unknown') AS priority_tier,
  COALESCE(a.country, p.country, 'unknown') AS country,
  COUNT(DISTINCT p.id) AS prospects,
  COUNT(DISTINCT CASE
    WHEN q.step_number = 2 AND q.status IN ('pending', 'held', 'processing', 'sent')
    THEN p.id
  END) AS followup_contacts,
  COUNT(DISTINCT CASE WHEN p.status = 'replied' THEN p.id END) AS replied_contacts,
  COUNT(DISTINCT CASE WHEN p.status = 'bounced' THEN p.id END) AS bounced_contacts,
  COUNT(DISTINCT CASE WHEN e.event_type = 'wrong_person' THEN p.id END) AS useful_referral_contacts,
  COUNT(DISTINCT CASE
    WHEN COALESCE(p.message_variant, 'routing_v1') = 'routing_v1'
     AND e.event_type = 'wrong_person'
    THEN COALESCE(a.account_id, p.account_id, p.domain, p.company_name)
  END) AS generic_routing_unlocked_accounts,
  COUNT(DISTINCT CASE
    WHEN COALESCE(p.message_variant, 'routing_v1') = 'admin_rescue_v1'
     AND e.event_type = 'wrong_person'
    THEN COALESCE(a.account_id, p.account_id, p.domain, p.company_name)
  END) AS admin_ops_unlocked_accounts
FROM outbound_prospects p
LEFT JOIN outbound_accounts a ON a.account_id = p.account_id
LEFT JOIN outbound_send_queue q ON q.prospect_id = p.id
LEFT JOIN outbound_email_events e ON e.prospect_id = p.id
GROUP BY
  COALESCE(p.cohort_id, a.cohort_id, 'unknown'),
  COALESCE(p.contact_type, p.email_type, 'unknown'),
  COALESCE(p.message_variant, 'routing_v1'),
  COALESCE(p.primary_goal, 'unknown'),
  COALESCE(a.priority_tier, p.priority, 'unknown'),
  COALESCE(a.country, p.country, 'unknown');

CREATE VIEW IF NOT EXISTS outbound_accounts_pending_discovery AS
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

INSERT OR REPLACE INTO outbound_campaigns (
  id,
  name,
  status,
  timezone,
  daily_limit,
  hourly_limit,
  block_size,
  send_window_start,
  send_window_end,
  send_days,
  summary_time
) VALUES (
  'dashboard_comercial_test_v1',
  'Dashboard comercial test v1',
  'active',
  'America/Buenos_Aires',
  150,
  25,
  25,
  '09:30',
  '17:30',
  '1,2,3,4,5',
  '18:15'
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:1',
  'dashboard_comercial_test_v1',
  'routing_v1',
  1,
  0,
  'Consulta por visibilidad comercial',
  '{{greeting}}

Les escribo porque ayudo a empresas a mejorar la visibilidad de su gestión comercial con dashboards de ventas.

En muchos casos, la información queda repartida entre planillas, reportes y sistemas distintos, y eso dificulta ver con claridad desvíos vs objetivo, cartera por vendedor, márgenes y alertas.

Quería consultar si hoy están evaluando mejorar ese seguimiento.

No sé si esta es la casilla indicada. Si no corresponde, ¿me podrían señalar con qué persona o área convendría verlo?

Muchas gracias.

Alan Pérez
alanlperez.com',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:2',
  'dashboard_comercial_test_v1',
  'routing_v1',
  2,
  3,
  'Re: Consulta por visibilidad comercial',
  'Hola, retomo este mensaje por si quedó pendiente.

Usualmente lo vemos cuando dirección necesita detectar desvíos comerciales antes del cierre del mes.

Si no corresponde por esta casilla, con una línea diciéndome qué área lo ve ya me orienta.

Gracias,
Alan',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:nominal_direct_v1:1',
  'dashboard_comercial_test_v1',
  'nominal_direct_v1',
  1,
  0,
  'Consulta breve sobre seguimiento comercial',
  'Hola {{first_name}}, buen dia.

Te escribo porque estuve viendo {{company_name}} y me dio la impresion de que tienen una operacion comercial con bastante movimiento entre categorias, cuentas y seguimiento.

En empresas con ese formato, muchas veces la informacion comercial queda repartida entre planillas, reportes y sistemas distintos, y eso vuelve mas dificil ver a tiempo desvios vs objetivo, cartera por vendedor, margenes y alertas.

Queria consultarte si hoy ese seguimiento lo ves vos o alguien de tu equipo.

Si tiene sentido, te comparto en dos lineas como lo estoy resolviendo en casos parecidos. Y si lo ve otra persona, con que me indiques con quien conviene hablar ya me orienta.

Gracias,
Alan Perez
alanlperez.com',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:nominal_direct_v1:2',
  'dashboard_comercial_test_v1',
  'nominal_direct_v1',
  2,
  3,
  'Re: Consulta breve sobre seguimiento comercial',
  'Hola {{first_name}}, retomo este mensaje por si te quedo pendiente.

Te escribia porque en varias empresas el seguimiento comercial termina repartido entre planillas, reportes y distintas fuentes, y eso vuelve dificil ver a tiempo donde se estan dando los desvios.

Si esto lo ves vos, te cuento muy breve como lo estoy resolviendo en otros casos parecidos.

Y si lo lleva otra persona, con que me indiques quien lo ve me alcanza.

Gracias,
Alan',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:role_commercial_v1:1',
  'dashboard_comercial_test_v1',
  'role_commercial_v1',
  1,
  0,
  'Consulta para el area comercial',
  'Hola, buen dia.

Les escribo porque trabajo con empresas donde el area comercial necesita ganar visibilidad sobre ventas, cartera, desvios vs objetivo y seguimiento por vendedor sin depender de reportes dispersos.

Vi que {{company_name}} tiene una operacion que probablemente requiera ese tipo de seguimiento comercial con bastante frecuencia.

Queria consultar si hoy eso lo ve alguien de comercial / gerencia comercial dentro del equipo.

Si corresponde a otra persona del area, me ayudan a derivarlo? Y si tiene sentido, les explico brevemente que tipo de tablero suelen usar empresas con una dinamica parecida.

Gracias,
Alan Perez
alanlperez.com',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:role_commercial_v1:2',
  'dashboard_comercial_test_v1',
  'role_commercial_v1',
  2,
  3,
  'Re: Consulta para el area comercial',
  'Hola, retomo este mensaje por si quedo pendiente.

Lo que queria entender es si hoy tienen alguna forma simple de ver en una sola vista desvios comerciales, cartera por vendedor, margenes y alertas de seguimiento.

Si esto lo ve otra persona del area, me ayudan a derivarlo? Y si corresponde a ustedes, les explico en dos lineas el tipo de tablero al que me refiero.

Gracias,
Alan',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:admin_rescue_v1:1',
  'dashboard_comercial_test_v1',
  'admin_rescue_v1',
  1,
  0,
  'Consulta breve sobre seguimiento comercial',
  'Hola, buen dia.

Les escribo con una consulta breve.

Estoy contactando a {{company_name}} por un tema de visibilidad y seguimiento comercial: desvios vs objetivo, cartera, margen y alertas de gestion.

No se si esto lo centraliza administracion, operaciones o comercial. Si no corresponde por esta casilla, me podrian indicar que persona o area lo suele ver internamente?

Con esa orientacion me alcanza para escribir a la persona correcta.

Muchas gracias,
Alan Perez
alanlperez.com',
  NULL,
  1
);

INSERT OR REPLACE INTO outbound_campaign_steps (
  id,
  campaign_id,
  message_variant,
  step_number,
  delay_days,
  subject,
  text_content,
  html_content,
  active
) VALUES (
  'dashboard_comercial_test_v1:admin_rescue_v1:2',
  'dashboard_comercial_test_v1',
  'admin_rescue_v1',
  2,
  3,
  'Re: Consulta breve sobre seguimiento comercial',
  'Hola, retomo este mensaje por unica vez.

Solo buscaba identificar que persona o area centraliza el seguimiento comercial o reporting en {{company_name}}.

Si no corresponde por esta casilla, con que me indiquen a quien conviene escribir ya me ayudan.

Gracias,
Alan',
  NULL,
  1
);
