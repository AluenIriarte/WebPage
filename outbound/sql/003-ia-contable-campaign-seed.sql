UPDATE outbound_campaigns
SET status = 'paused',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'dashboard_comercial_test_v1';

UPDATE outbound_send_queue
SET status = 'held',
    error_message = 'held_after_offer_migration',
    updated_at = CURRENT_TIMESTAMP
WHERE campaign_id = 'dashboard_comercial_test_v1'
  AND status = 'pending';

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
  'ia_estudios_contables_ar_v1',
  'IA aplicada - Estudios contables Argentina v1',
  'draft',
  'America/Buenos_Aires',
  40,
  10,
  10,
  '09:30',
  '16:30',
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
  'ia_estudios_contables_ar_v1:routing_v1:1',
  'ia_estudios_contables_ar_v1',
  'routing_v1',
  1,
  0,
  'Consulta sobre un proceso del estudio',
  '{{greeting}}

Te escribo porque estoy trabajando con flujos de IA aplicada a procesos contables, especialmente preparación de balances y tratamiento de resúmenes bancarios.

La propuesta no reemplaza la revisión profesional: ordena fuentes, prepara sugerencias y separa excepciones para que el equipo concentre el criterio donde hace falta.

Quería consultarte si hoy tienen algún proceso de cierre o preparación de información que siga requiriendo mucho trabajo manual.

Si lo ve otra persona dentro de {{company_name}}, con que me indiques a quién corresponde ya me orienta.

Gracias,
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
  'ia_estudios_contables_ar_v1:routing_v1:2',
  'ia_estudios_contables_ar_v1',
  'routing_v1',
  2,
  4,
  'Re: Consulta sobre un proceso del estudio',
  '{{greeting}}

Retomo el mensaje con un ejemplo concreto.

En el prototipo de balance asistido, el flujo toma las fuentes acordadas, propone relaciones y deja separadas las excepciones para revisión. Cada sugerencia conserva referencia al dato original.

Primero evaluamos un único proceso y recién después definimos si tiene sentido hacer un piloto.

Si hoy algo parecido les consume tiempo, puedo mostrarte la demo privada.

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
  'ia_estudios_contables_ar_v1:routing_v1:3',
  'ia_estudios_contables_ar_v1',
  'routing_v1',
  3,
  7,
  'Re: Consulta sobre un proceso del estudio',
  '{{greeting}}

Cierro por acá para no insistir.

Si más adelante quieren revisar un proceso repetitivo del estudio, dejé una evaluación breve en:
https://alanlperez.com/evaluar-proceso

No pide documentación ni archivos; solo el contexto operativo para preparar una conversación útil.

Gracias,
Alan',
  NULL,
  1
);
