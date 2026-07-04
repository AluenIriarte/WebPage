Actua como orquestador senior de outbound ops sobre este proyecto y trata D1 remoto como fuente de verdad operativa.

Contexto:
- Repo: `C:\Users\Alan\Desktop\trabajo\webpage\WebPage`
- Fecha de referencia: viernes 24 de abril de 2026
- Campana activa: `dashboard_comercial_test_v1`
- El usuario estaba mezclando capas del pipeline y habia confusion con numeros de `held`, `valid_send`, follow-ups y stock para validar.
- Ya se agrego un reporte consolidado nuevo: `npm run outbound:ops-funnel`
- Ese reporte responde cuatro preguntas canonicas:
  1. `ready_validation`
  2. `ready_publish`
  3. `sendable_today`
  4. `followups_next_week`

Hallazgos confirmados:
1. La arquitectura conceptual del proyecto esta bien:
   - `outbound_accounts` = empresa objetivo
   - `outbound_prospect_contacts` = contacto pre-publicacion
   - `outbound_prospects` = contacto publicado a campana
   - `outbound_send_queue` = email tecnico concreto

2. Hay un desfase real entre el repo y D1 remoto:
   - el repo ya asume columnas lane-aware en `outbound_prospect_contacts` y `outbound_prospects`
   - el repo ya asume una vista `outbound_next_followup_candidates` mas rica
   - pero D1 remoto todavia no tiene todas esas columnas ni esa version completa de la vista

3. `final_status` hoy esta sobrecargado:
   - en pre-validacion se usa para estados de pipeline tipo `candidate_validation`, `routing_only_pre_validation`, `review_pre_validation`
   - durante validacion tecnica Emailable se pisa con estados tipo `valid_send`, `risky_review`, `accept_all_review`, `invalid_discard`
   - esto vuelve ambigua la lectura operativa

4. El follow-up hoy NO esta configurado como `+7 dias`:
   - `outbound_campaign_steps.step_number = 2` tiene `delay_days = 3`
   - si el negocio quiere follow-up a +7 dias, eso hoy no esta alineado

Corte real confirmado hoy:
- `35` ready_validation
- `0` ready_publish
- `83` scheduled_today
- `67` sendable_today
- `33` sendable_today_valid_send
- `16` cancelled_today
- `0` sent_today
- `71` followups_next_week bajo la configuracion actual

Breakdown de `33 valid_send` hoy en cola:
- `16` de `test_juli`
- `12` de `icp_cosmetica_2026_04`
- `5` de `icp_cosmetica_stock_500_2026_04`

Si se mira solo cosmética nueva:
- `17 valid_send` reales hoy (`12 + 5`)
- ya estan absorbidos por la campana

Archivos relevantes:
- `outbound/scripts/export-operational-funnel.ps1`
- `outbound/README.md`
- `outbound/schema.md`
- `outbound/docs/prospecting-to-outreach.md`
- `workers/d1-outbound.sql`
- `outbound/sql/generated/d1-outbound-contact-lanes-2026-04-23.sql`
- `outbound/scripts/validate-emailable-batch.mjs`
- `outbound/reports/ops-funnel-2026-04-24.json`

Lo que necesito que hagas:

1. Verificar schema remoto vs schema esperado
- correr `PRAGMA table_info(outbound_prospect_contacts)`
- correr `PRAGMA table_info(outbound_prospects)`
- inspeccionar `sqlite_master` para la vista `outbound_next_followup_candidates`
- comparar contra:
  - `workers/d1-outbound.sql`
  - `outbound/sql/generated/d1-outbound-contact-lanes-2026-04-23.sql`

2. Resolver el desfase de D1 remoto
- definir si corresponde aplicar en remoto la migracion lane-aware completa
- si falta:
  - agregar columnas nuevas en `outbound_prospect_contacts`
  - agregar columnas nuevas en `outbound_prospects`
  - recrear `outbound_next_followup_candidates`
  - validar que no rompa datos existentes ni jobs ya en cola

3. Separar estado de etapa vs estado de validacion
- proponer e idealmente implementar una separacion clara entre:
  - estado del pipeline comercial/pre-publicacion
  - estado de validacion tecnica
- objetivo:
  - no seguir usando `final_status` para dos cosas distintas
- si no queres cambiar demasiado schema:
  - al menos dejar una estrategia transicional y documentada

4. Alinear la logica de follow-up con el criterio del negocio
- verificar si Step 2 debe ser `+7 dias` o mantener `+3`
- si el criterio correcto es `+7`, actualizar `outbound_campaign_steps.delay_days`
- despues recalcular `followups_next_week`

5. Dejar una lectura operativa simple y canonica
- asegurar que el equipo pueda responder sin ambiguedad:
  - cuantos tengo listos para validar
  - cuantos tengo validados y todavia no publicados
  - cuantos tengo listos para enviar hoy
  - cuantos entran a follow-up la semana proxima
- si hace falta:
  - crear views auxiliares
  - mejorar endpoints
  - o dejar reportes oficiales

6. No romper analytics
- preservar la capacidad de medir:
  - empresas contactadas
  - vertical
  - country
  - contact_type
  - replies
  - bounces
  - wrong_person
  - unlocked accounts
- si se aplica la migracion lane-aware, confirmar que:
  - `outbound_account_performance`
  - `outbound_contact_type_performance`
  siguen dando datos consistentes

7. Validacion de la base grande
- revisar el cohort `icp_cosmetica_stock_500_2026_04`
- confirmar que lo pendiente ahi sigue siendo validacion tecnica/manual
- no moverlo a envio masivo sin pasar por validacion

Entregable esperado:
- diagnostico claro: que estaba bien, que estaba mezclado, que estaba desfasado
- cambios concretos aplicados o SQL listo para aplicar
- estado final del schema remoto
- confirmacion de la politica de follow-up (`3` o `7` dias)
- nuevo corte operativo despues de alinear todo
- lista corta de comandos/reportes oficiales que el usuario deberia usar de ahora en adelante

Comando nuevo ya disponible:
- `npm run outbound:ops-funnel`

Interpretacion oficial deseada:
- `ready_validation` = pre-validacion pendiente
- `ready_publish` = `valid_send` no publicado
- `sendable_today` = `held/pending` de hoy
- `followups_next_week` = candidatos reales a Step 2 segun la configuracion vigente

Importante:
- no responder solo con teoria
- revisar repo y D1 remoto
- si detectas que el desfase repo/remoto es el problema principal, priorizar esa alineacion primero
