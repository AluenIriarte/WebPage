# D1 Outbound Schema

Tablas:

- `outbound_cohorts`: separa bases/origenes para comparar performance sin mezclar datos.
- `outbound_accounts`: empresas ICP objetivo.
- `outbound_raw_email_hits`: emails publicos encontrados con evidencia.
- `outbound_emails_normalized`: emails deduplicados, clasificados y scoreados.
- `outbound_email_verifications`: resultados tecnicos de verificadores externos.
- `outbound_prospect_contacts`: contactos operables finales antes de publicar a campana.
- `outbound_crawl_jobs`: trazabilidad de discovery publico por cuenta.
- `outbound_prospects`: base maestra de contactos.
- `outbound_campaigns`: configuracion de campanas.
- `outbound_campaign_steps`: asuntos y cuerpos de secuencia.
- `outbound_send_queue`: cola tecnica de envios.
- `outbound_email_events`: eventos de Brevo y eventos internos.
- `outbound_daily_summaries`: resumenes diarios generados.

Vistas:

- `outbound_next_followup_candidates`: contactos sin respuesta listos para evaluar siguiente step.
- `outbound_account_performance`: performance agregada por cuenta, vertical, tier y segmento.
- `outbound_contact_type_performance`: performance agregada por lane/contact_type, tier y pais.

Separacion importante:

- `outbound_prospects.status` describe el estado comercial del contacto.
- `outbound_send_queue.status` describe el estado tecnico de un email concreto.

Esta separacion evita perder control cuando un contacto tiene varios pasos de secuencia.

Relaciones:

- `outbound_cohorts.cohort_id` separa `test_juli`, `icp_cosmetica_2026_04` y futuras bases.
- `outbound_accounts.account_id` se relaciona con `outbound_prospects.account_id`.
- `outbound_raw_email_hits.account_id` y `outbound_crawl_jobs.account_id` trazan cada hallazgo a la cuenta.
- `outbound_prospect_contacts.account_id` representa contactos pre-validacion por empresa.
- `outbound_prospect_contacts.contact_id` se relaciona con `outbound_prospects.source_contact_id`.
- `outbound_send_queue.prospect_id` apunta al contacto publicado en campana.

Campos de lane relevantes:

- `outbound_prospect_contacts.contact_type`: clasificacion normalizada del inbox (`nominal_public`, `role_based_commercial`, `generic_routing`, `admin_ops`).
- `outbound_prospect_contacts.pipeline_status`: etapa comercial pre-publicacion (`candidate_validation`, `routing_only_pre_validation`, `review_pre_validation`, `discard_pre_validation`).
- `outbound_prospect_contacts.message_variant`: variante de copy que debe usar ese contacto.
- `outbound_prospect_contacts.primary_goal`: objetivo principal del lane (`direct_interest`, `referral`, `area_confirmation`).
- `outbound_prospect_contacts.lane_priority`: prioridad relativa dentro de la cuenta.
- `outbound_prospect_contacts.account_contact_rank`: mejor contacto disponible por cuenta, rankeado de 1 en adelante.
- `outbound_prospect_contacts.verification_status`: verificacion tecnica de entregabilidad (`valid_send`, `risky_review`, `accept_all_review`, `invalid_discard`, `unknown_review`).
- `outbound_prospect_contacts.second_filter_original_status`: estado tecnico original antes del segundo filtro.
- `outbound_prospect_contacts.second_filter_status`: decision binaria del segundo filtro (`borderline_promoted`, `borderline_discarded`).
- `outbound_prospect_contacts.second_filter_score`: score deterministico usado para resolver borderline.
- `outbound_prospect_contacts.second_filter_reason`: razon corta y trazable de la decision.
- `outbound_prospect_contacts.second_filter_at`: timestamp UTC de la resolucion.
- `outbound_prospects.*`: replica lanes/copy una vez que el contacto se publica a campana.
- `outbound_prospect_contacts.final_status`: campo legacy; no debe usarse como definicion operativa primaria.
