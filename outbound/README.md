# Outbound Ops

Este subproyecto documenta y opera el flujo outbound de prospectos.

## Principio

D1 es la fuente de verdad. Brevo es el canal de envio y reporting.

## Migracion a IA contable

La nueva campana es `ia_estudios_contables_ar_v1`.

- ICP: `outbound/docs/icp-estudios-contables-argentina.md`
- Secuencia: `outbound/email-sequence-ia-contable.md`
- Seed: `outbound/sql/003-ia-contable-campaign-seed.sql`

El seed pausa la campana de dashboards y retiene sus envios pendientes. La campana nueva queda en `draft`; no se activa ni se carga con contactos automaticamente.

```powershell
npm run outbound:seed:ia-contable
```

## Flujo

1. La base cruda se limpia localmente con `scripts/process-prospects.ps1`.
2. La tabla final se exporta a `outbound/data/prospects/prospects_final.csv`.
3. El lote inicial queda en `outbound/data/prospects/prospects_initial_150.csv`.
4. D1 guarda prospectos, campanas, pasos, cola de envio y eventos.
5. El Worker ejecuta la cola por cron o endpoint admin.
6. Brevo envia cada email y devuelve el `messageId`.
7. El Worker actualiza `send_queue` y `outbound_prospects`.

## Estructura local

- `outbound/data/raw`: bases crudas.
- `outbound/data/prospects`: bases limpias y rampas.
- `outbound/data/validation`: validaciones externas y preflight.
- `outbound/assets/email`: templates y one-pagers.
- `outbound/sql/generated`: SQLs generados/aplicados para D1.
- `workers/d1-outbound.sql`: schema base de D1.

Para desplegar el Worker, usar `npm run worker:deploy` o `wrangler deploy --keep-vars`; esto evita perder variables configuradas en Cloudflare.

## Prospecting y cuentas

El prospecting real entra por cuentas ICP:

1. `outbound_cohorts`: separa bases, por ejemplo `test_juli` e `icp_cosmetica_2026_04`.
2. `outbound_accounts`: empresa objetivo.
3. `outbound_crawl_jobs`: trazabilidad de discovery publico por cuenta.
4. `outbound_raw_email_hits`: emails publicos encontrados con fuente.
5. `outbound_emails_normalized`: email limpio, clasificado y score preliminar.
6. `outbound_email_verifications`: verificacion tecnica externa.
7. `outbound_prospect_contacts`: contacto listo para validacion o descarte.
8. `outbound_prospects`: contacto publicado a una campana concreta.

Documentacion: `outbound/docs/prospecting-to-outreach.md`.

Playbooks de replies: `outbound/docs/reply-playbooks.md`.

Stage 1, sourcing y scoring de cuentas:

```powershell
npm run outbound:build-account-candidates -- --cohort icp_cosmetica_expansion_2026_04
```

Fuente publica amplia para stock:

```powershell
npm run outbound:source-laguiademayoristas -- --cohort icp_cosmetica_stock_500_2026_04 --maxDetails 600
```

Entrada esperada:

```txt
outbound/data/account-sourcing/<cohort>/account_candidates.tsv
```

Salidas:

- `outbound/data/accounts/<cohort>.tsv`: cuentas ICP listas para discovery.
- `outbound/data/account-sourcing/<cohort>/account_candidates_scored.csv`: auditoria del scoring.
- `outbound/data/account-sourcing/<cohort>/d1-upsert-accounts.sql`: upsert de cuentas a D1.

Discovery publico controlado:

```powershell
npm run outbound:discover-public-emails -- --maxPages 12 --rebuild
```

Exportar contactos pre-validacion:

```powershell
npm run outbound:ready-validation -- -CohortId icp_cosmetica_2026_04
```

Exportar stock amplio pre-validacion:

```powershell
npm run outbound:contact-stock -- -CohortId icp_cosmetica_2026_04
```

`ready-validation` es la lista conservadora para validar primero. `contact-stock` incluye tambien `review_pre_validation` para acumular volumen, pero no debe enviarse sin validacion/API y revision de descartes.

Lectura operativa recomendada:

- `ready-validation`: contactos pendientes de verificacion tecnica con `pipeline_status` listo para validar.
- `ready-publish`: contactos ya `valid_send` pero todavia no publicados a campana.
- `scheduled-today`: rows ya programadas en `outbound_send_queue` para una fecha.
- `sendable-today`: subset de `scheduled-today` con `status in ('held', 'pending')`.
- `followups-next-week`: candidatos de Step 2 cuya fecha due cae la semana siguiente.

Convencion operativa:

- `pipeline_status` define la etapa pre-publicacion.
- `verification_status` define la validacion tecnica.
- `second_filter_*` define la resolucion automatica de borderline (`accept_all_review`, `risky_review`).
- `final_status` queda como campo legacy y no debe ser la lectura principal para stock nuevo.

Reporte consolidado:

```powershell
npm run outbound:ops-funnel
```

Ese reporte exporta CSVs y un JSON consolidado a `outbound/reports` para evitar mezclar capas.

Endpoints internos de lectura:

```txt
GET /outbound/cohorts
GET /outbound/accounts?cohortId=icp_cosmetica_2026_04
GET /outbound/raw-hits?cohortId=icp_cosmetica_2026_04
GET /outbound/prospect-contacts?cohortId=icp_cosmetica_2026_04
GET /outbound/ready-validation?cohortId=icp_cosmetica_2026_04
GET /outbound/contact-stock?cohortId=icp_cosmetica_2026_04
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

## Follow-ups

Para revisar contactos con primer contacto enviado y sin respuesta:

```powershell
npm run outbound:followups
```

Eso exporta candidatos desde `outbound_next_followup_candidates` a `outbound/reports`.

Para performance agregada por cuenta/rubro/segmento:

```powershell
npm run outbound:monthly
```

## Ritmo inicial

Para la rampa inicial:

- Lunes a viernes.
- Zona horaria: `America/Buenos_Aires`.
- Dia 1, 2026-04-21: 50 emails en 2 bloques.
- Dia 2, 2026-04-22: 75 emails retenidos hasta validar metricas.
- Dia 3, 2026-04-23: 100 emails retenidos hasta validar metricas.
- Dia 4, 2026-04-24: 75 emails retenidos hasta validar metricas.
- Dia 5, 2026-04-27: 22 emails retenidos hasta validar metricas.

La base aprobada unica disponible para esta rampa tiene 322 contactos. Si las metricas acompanan, el quinto dia puede ampliarse revisando mas contactos.

## Estados de prospecto

- `approved`: listo para entrar en cola.
- `scheduled`: tiene envio pendiente.
- `sent_step_1`: primer email enviado.
- `sent_step_2`: follow-up 1 enviado.
- `sent_step_3`: follow-up 2 enviado.
- `replied`: respondio, pausar secuencia.
- `bounced`: rebote, no enviar mas.
- `unsubscribed`: baja solicitada.
- `do_not_contact`: exclusion manual o legal.
- `paused`: requiere revision.
- `failed`: error tecnico reiterado.

## Verificacion diaria

El resumen operativo se consulta en:

```txt
GET /outbound/status?campaignId=dashboard_comercial_test_v1
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

El envio manual de lo vencido se dispara con:

```txt
POST /outbound/run
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

Previsualizar destinatarios y texto:

```txt
GET /outbound/preview?campaignId=dashboard_comercial_test_v1&status=pending&limit=50
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

Ver metricas por segmento:

```txt
GET /outbound/metrics?campaignId=dashboard_comercial_test_v1
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

Marcar una respuesta manual:

```txt
POST /outbound/mark-response
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>

{
  "email": "persona@empresa.com",
  "outcome": "positive_reply",
  "note": "Pidio mas informacion"
}
```

Outcomes validos:

- `positive_reply`
- `interested`
- `meeting`
- `wrong_person`
- `not_interested`
- `replied`
- `bounced`
- `unsubscribed`
- `do_not_contact`
- `paused`

Liberar el siguiente dia si las metricas estan sanas:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/release-outbound-day.ps1 -LocalDate 2026-04-22 -ValidationPolicy valid-only
```

Politicas de validacion:

- `valid-only`: libera solo contactos con `verification_status = valid_send`.
- `valid-and-review`: legado; no deberia usarse en el flujo nuevo.
- `any`: libera sin filtro de validacion; usar solo para pruebas controladas.

Validadores tecnicos disponibles:

- `npm run outbound:validate-emailable -- --input <csv> --target prospect_contacts`
- `npm run outbound:validate-quickemail -- --input <csv> --target prospect_contacts --limit 100`
- `npm run outbound:export-borderline`
- `npm run outbound:filter-borderline -- --input outbound/reports/borderline-candidates-2026-04-24.csv --tag 2026-04-24`

Para QuickEmailVerification:

- usar `QUICKEMAILVERIFICATION_API_KEY` en entorno local;
- tomar `safe_to_send` como criterio primario de `valid_send`;
- limitar a `100` verificaciones por dia en el flujo free.

Segundo filtro automatico pre-envio:

- `accept_all_review` y `risky_review` no quedan para revision manual humana.
- se exportan desde D1 remoto con `npm run outbound:export-borderline`.
- se resuelven con `npm run outbound:filter-borderline`.
- `borderline_promoted` pasa operativamente a `verification_status = valid_send`.
- `borderline_discarded` pasa operativamente a `verification_status = invalid_discard`.
- la auditoria queda en `second_filter_original_status`, `second_filter_status`, `second_filter_score`, `second_filter_reason` y `second_filter_at`.

El cron ejecuta automaticamente la misma logica cada 15 minutos dentro de la ventana configurada.

Resumenes automaticos:

- resumen diario: se envia en `summary_time`, solo si hubo envios efectivos en el dia;
- resumen semanal: se envia una vez por semana, el viernes, dentro de la misma ventana de `summary_time`, solo si hubo envios efectivos en la semana;
- el semanal incluye envios de la semana, eventos/respuestas, segmentos, contact types y cuentas abiertas en `outbound_account_followups`;
- si `OUTBOUND_SUMMARIES_ON_HOLD=true`, ambos mails quedan en pausa sin afectar la cola outbound.

Replies de acuse / derivacion interna:

- salen del circuito de follow-up automatico;
- se guardan como `replied`;
- entran a un segundo proceso por cuenta para conseguir mejor contacto o pedir derivacion unos dias despues.
