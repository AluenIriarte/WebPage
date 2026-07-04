CREATE TABLE IF NOT EXISTS process_evaluations (
  request_id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  source TEXT NOT NULL,
  landing_path TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  estudio TEXT NOT NULL,
  rol TEXT NOT NULL,
  proceso TEXT NOT NULL,
  volumen TEXT NOT NULL,
  sistemas_formatos TEXT NOT NULL,
  cuello_botella TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  brevo_contact_synced_at TEXT,
  lead_email_sent_at TEXT,
  internal_notified_at TEXT,
  error_message TEXT,
  raw_payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_process_evaluations_submitted_at
  ON process_evaluations(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_process_evaluations_email
  ON process_evaluations(email);

CREATE INDEX IF NOT EXISTS idx_process_evaluations_estudio
  ON process_evaluations(estudio);

CREATE INDEX IF NOT EXISTS idx_process_evaluations_proceso
  ON process_evaluations(proceso);

CREATE INDEX IF NOT EXISTS idx_process_evaluations_status
  ON process_evaluations(status);
