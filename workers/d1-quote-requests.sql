CREATE TABLE IF NOT EXISTS quote_requests (
  request_id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  source TEXT NOT NULL,
  intent TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  empresa TEXT NOT NULL,
  producto TEXT NOT NULL,
  rol TEXT,
  objetivo TEXT,
  fuentes TEXT,
  destinatarios TEXT,
  plazo TEXT,
  desafio TEXT,
  status TEXT NOT NULL,
  brevo_contact_synced_at TEXT,
  lead_email_sent_at TEXT,
  internal_notified_at TEXT,
  error_message TEXT,
  raw_payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_submitted_at
  ON quote_requests(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_requests_email
  ON quote_requests(email);

CREATE INDEX IF NOT EXISTS idx_quote_requests_empresa
  ON quote_requests(empresa);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status
  ON quote_requests(status);
