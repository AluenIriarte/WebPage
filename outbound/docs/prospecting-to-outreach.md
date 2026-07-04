# Prospecting To Outreach

## Principio

El flujo arranca por cuentas ICP, no por emails. Los emails son evidencia asociada a una empresa objetivo.

## Pipeline

1. `outbound_cohorts`: separa bases y origenes, por ejemplo `test_juli` e `icp_cosmetica_2026_04`.
2. `outbound_accounts`: una fila por empresa objetivo.
3. `outbound_crawl_jobs`: trazabilidad de discovery publico por cuenta.
4. `outbound_raw_email_hits`: hallazgos crudos con URL/fuente/contexto.
5. `outbound_emails_normalized`: dedupe, sintaxis, tipo de casilla y score barato.
6. `outbound_email_verifications`: resultado tecnico de Emailable/Bouncer/BounceBan.
7. `outbound_prospect_contacts`: contacto operable final pre-publicacion.
8. `outbound_prospects`: contactos publicados a una campana concreta.
9. `outbound_send_queue`: emails concretos a enviar por step.

## Stage 1: Sourcing De Cuentas

El sourcing de cuentas arma el universo ICP antes de buscar emails. No se debe arrancar por casillas sueltas.

Entrada local:

```txt
outbound/data/account-sourcing/<cohort>/account_candidates.tsv
```

Columnas recomendadas:

- `company_name`
- `domain`
- `website`
- `vertical`
- `geo`
- `size_hint`
- `source_url`
- `source_type`
- `evidence`
- `notes`

Comando:

```powershell
npm run outbound:build-account-candidates -- --cohort icp_cosmetica_expansion_2026_04
```

El script calcula:

- `icp_fit_score`: fit comercial de 0 a 100.
- `priority_tier`: A/B/C/D.
- `status`: `candidate` si supera el minimo, `review` si falta evidencia.
- `source_confidence`: calidad de la evidencia usada para aceptar la cuenta.

Criterio operativo:

- Tier A/B: entra primero a discovery de emails.
- Tier C: sirve para volumen si la base valida bien.
- Tier D/review: no se usa para envio hasta revisar.

Para llegar a 100 emails/dia no conviene bajar el filtro. Conviene ampliar cuentas ICP: con el rendimiento actual de discovery publico, hacen falta aprox. 150-200 cuentas investigadas por dia para tener volumen validable con margen.

Para construir stock de 500 contactos, se permite guardar mas candidatos que los que se enviarian:

- `candidate_validation`: validar primero.
- `routing_only_pre_validation`: validar segundo; util para `ventas@`, `contacto@`, `info@`.
- `review_pre_validation`: stock amplio; no enviar sin validacion y revision.
- `discard_pre_validation`: fuera del stock.

Regla de volumen:

- Objetivo minimo: 500 contactos en stock pre-validacion.
- Objetivo sano: 500 contactos luego de remover descartes obvios, antes de API.
- Objetivo envio: solo los que la API marque `valid` o aceptables bajo politica.

Export stock:

```powershell
npm run outbound:contact-stock -- -CohortId icp_cosmetica_2026_04
```

## Estados Finales De Contacto

- `send_now`: cuenta ICP buena, email relevante, fuente clara, validacion sana.
- `review`: hay valor, pero alguna duda: accept-all, fuente media, inferido.
- `routing_only`: info/contacto/ventas. Usar para derivacion, no como mejor tiro.
- `discard`: invalid, disposable, toxic, non-target o casilla irrelevante.
- `do_not_contact`: exclusion manual o legal.

Estados provisorios antes de validar:

- `candidate_validation`: contacto publico relevante para validar tecnicamente.
- `routing_only_pre_validation`: casilla de derivacion util, pero no el mejor tiro.
- `discard_pre_validation`: visible pero no usable para outreach.

## Validacion

Ruta recomendada para arrancar:

- Primary: Emailable o Bouncer.
- Secondary: BounceBan solo para catch-all/accept-all valiosos.

No validar todo. Validar primero:

- nominales publicos;
- role-based comercial;
- genericos utiles en cuentas Tier A;
- inferidos solo con contexto fuerte.

No gastar validacion en `no-reply`, `privacy`, `abuse`, `webmaster`, `soporte` o casillas que no usariamos.

Segundo filtro operativo:

- `valid_send`: entra directo.
- `invalid_discard`: queda fuera.
- `unknown_review`: queda fuera.
- `accept_all_review` y `risky_review`: no quedan para revision humana abierta.
- se resuelven con un segundo filtro deterministico que decide `borderline_promoted` o `borderline_discarded`.
- por compatibilidad operativa:
  - `borderline_promoted` se convierte en `verification_status = valid_send`;
  - `borderline_discarded` se convierte en `verification_status = invalid_discard`.
- la auditoria queda guardada en `second_filter_*`.

## Discovery Publico

El discovery controlado recorre rutas razonables del dominio, guarda `raw_email_hits`, consolida en `outbound_prospect_contacts` y no envia ni valida emails.

```powershell
npm run outbound:discover-public-emails -- --maxPages 12 --rebuild
npm run outbound:ready-validation -- -CohortId icp_cosmetica_2026_04
```

Endpoints internos:

```txt
GET /outbound/cohorts
GET /outbound/accounts?cohortId=icp_cosmetica_2026_04
GET /outbound/raw-hits?cohortId=icp_cosmetica_2026_04
GET /outbound/prospect-contacts?cohortId=icp_cosmetica_2026_04
GET /outbound/ready-validation?cohortId=icp_cosmetica_2026_04
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

## Follow-Ups

Los follow-ups se programan solo para contactos que:

- recibieron el paso anterior;
- no respondieron;
- no rebotaron;
- no se desuscribieron;
- no fueron marcados como `do_not_contact`;
- no tienen ya el siguiente paso en cola.

Playbook especial para replies de acuse / derivacion interna:

- si una casilla responde que lo deriva internamente pero aclara que no es el canal ideal, no entra en follow-up automatico;
- se marca el prospecto como `replied`;
- la cuenta pasa a proceso secundario de `source_better_contact`;
- si no aparece un mejor contacto en `3-5` dias habiles, se usa un reply corto para agradecer y pedir derivacion.

Referencia operativa: `outbound/docs/reply-playbooks.md`.

Vista principal:

```sql
SELECT *
FROM outbound_next_followup_candidates
WHERE campaign_id = 'dashboard_comercial_test_v1'
  AND next_step_number = 2;
```

Endpoint admin:

```txt
GET /outbound/followups?campaignId=dashboard_comercial_test_v1&nextStep=2&limit=200
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>
```

Programar follow-ups en modo retenido:

```json
POST /outbound/schedule-followups
Authorization: Bearer <OUTBOUND_ADMIN_TOKEN>

{
  "campaignId": "dashboard_comercial_test_v1",
  "nextStep": 2,
  "localDate": "2026-04-27",
  "times": ["09:30", "12:00"],
  "blockSize": 25,
  "limit": 50,
  "status": "held"
}
```

Usar `status: "held"` por defecto. Cambiar a `pending` solo cuando se decide liberar.

Planner lane-aware para la semana siguiente:

```powershell
npm run outbound:plan-followups -- -WeekStart 2026-04-27
```

Ese script:

- toma `outbound_next_followup_candidates`;
- respeta `message_variant`, `lane_priority` y `account_contact_rank`;
- deja el Step 2 en SQL `held` para revision;
- exporta detalle y resumen por lane, tier y pais.

## Reporting Mensual

La vista `outbound_account_performance` permite agrupar por cuenta, dominio, vertical, tier y segmento.

Preguntas que tiene que responder:

- Que vertical responde mejor.
- Que tipo de contacto rebota menos.
- Que segmentos generan mas replies positivos.
- Que cuentas quedan para follow-up.
- Que fuentes producen contactos de mejor calidad.
