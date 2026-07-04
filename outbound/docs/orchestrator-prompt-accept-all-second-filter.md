Actua como orquestador senior de outbound ops sobre este repo y toma esta politica como decision operativa oficial para pre-envio.

Objetivo:
- eliminar la revision manual humana de contactos borderline
- reemplazarla por un segundo filtro automatico, decidido por flujo IA + reglas del proyecto
- no sumar riesgo innecesario al pool enviable
- no perder casillas buenas solo porque el proveedor devolvio `accept_all_review` o `risky_review`

Repo:
- `C:\Users\Alan\Desktop\trabajo\webpage\WebPage`

Contexto:
- El proveedor tecnico primario puede ser `Emailable` o `QuickEmailVerification`
- Si el proveedor devuelve `accept_all_review` o `risky_review`, NO quiero dejar eso en una bandeja gris para mirar despues
- Quiero una segunda decision automatica:
  - si el email y la cuenta valen la pena => entra
  - si no valen la pena => descartado
- Resultado deseado: limpiar esa etapa del proceso y dejar un pool mas firme para publicacion/envio

Normalizacion tecnica base:
- `valid_send` => entra
- `invalid_discard` => descartado
- `unknown_review` => descartado
- `accept_all_review` => pasa por segundo filtro automatico
- `risky_review` => pasa por segundo filtro automatico, pero con criterio mas estricto que `accept_all_review`

Politica nueva obligatoria:
1. SOLO los contactos con `verification_status in ('accept_all_review', 'risky_review')` pasan al segundo filtro
2. El segundo filtro debe tomar decision binaria:
   - `borderline_promoted`
   - `borderline_discarded`
3. No dejar `accept_all_review` ni `risky_review` como estado operativo final pendiente
4. No quiero sumar esos contactos automaticamente al pool enviable si el fit es flojo
5. Si el fit es bueno, se promueven y entran

Criterio del segundo filtro:

Hard reject automatico:
- email en dominio free (`gmail`, `hotmail`, `outlook`, `yahoo`) salvo excepcion muy justificada
- inbox no target tipo `privacy@`, `abuse@`, `noreply@`, `no-reply@`, `webmaster@`, `soporte@`, `support@`
- `source_confidence < 60`
- cuenta `priority_tier = 'C'` salvo caso excepcional con evidencia fuerte
- cuenta con ICP debil o rubro fuera del fit
- ya existe otro contacto `valid_send` mejor en la misma cuenta

Hard approve automatico:
- cuenta `priority_tier = 'A'`
- `contact_type` en `nominal_public` o `role_based_commercial`
- `source_confidence >= 75`
- dominio corporativo alineado con la cuenta
- no existe otro `valid_send` mejor en la misma cuenta

Scoring recomendado para el segundo filtro:
- base = `0`
- `+5` extra si `verification_status_original = 'accept_all_review'`
- `-10` si `verification_status_original = 'risky_review'`
- `+35` si `priority_tier = 'A'`
- `+20` si `priority_tier = 'B'`
- `+20` si `contact_type = 'nominal_public'`
- `+18` si `contact_type = 'role_based_commercial'`
- `+10` si `contact_type = 'generic_routing'`
- `+5` si `contact_type = 'admin_ops'`
- `+15` si `source_confidence >= 80`
- `+10` si `account_contact_rank = 1`
- `+10` si no existe otro `valid_send` en la misma cuenta
- `-25` si dominio free
- `-20` si inbox no-target o administrativo irrelevante
- `-20` si `source_confidence < 60`
- `-15` si `priority_tier = 'C'`
- `-15` si ya existe otro `valid_send` mejor en la cuenta

Regla de decision:
- si `verification_status_original = 'accept_all_review'`:
  - score `>= 70` => `borderline_promoted`
  - score `< 70` => `borderline_discarded`
- si `verification_status_original = 'risky_review'`:
  - score `>= 80` => `borderline_promoted`
  - score `< 80` => `borderline_discarded`

Importante:
- `role=true` del proveedor NO debe ser castigo automatico por si solo
- la decision final debe apoyarse mas en:
  - calidad de la cuenta
  - tipo de contacto
  - calidad de la fuente
  - si hay o no mejor contacto ya validado
- `risky_review` no debe promocionarse con `generic_routing` salvo cuenta Tier A muy clara y sin mejor alternativa

Lo que necesito que implementes:

1. Detectar contactos objetivo
- trabajar sobre `outbound_prospect_contacts`
- filtrar `verification_status in ('accept_all_review', 'risky_review')`
- limitar inicialmente a cohorts de cosmetica:
  - `icp_cosmetica_2026_04`
  - `icp_cosmetica_stock_500_2026_04`
  - `icp_cosmetica_expansion_2026_04`

2. Crear segundo filtro automatico
- puede ser script nuevo
- puede ser SQL + script
- puede usar IA para razonamiento final, pero la salida debe ser deterministica y trazable
- ideal: `outbound/scripts/filter-accept-all-second-pass.mjs` o equivalente

3. Guardar trazabilidad
- necesito conservar:
  - score del segundo filtro
  - razon corta
  - decision final
  - timestamp
  - provider original

Si queres hacerlo con cambios chicos:
- agregar campos como:
  - `second_filter_status`
  - `second_filter_score`
  - `second_filter_reason`
  - `second_filter_at`

Si preferis no tocar schema demasiado:
- usar `notes` y/o `validation_flags`
- pero la decision final debe quedar consultable sin ambiguedad

4. Integracion con el flujo actual
- si el contacto queda `borderline_promoted`, debe entrar al pool enviable
- si queda `borderline_discarded`, debe salir del pool enviable

Implementacion recomendada para no romper el flujo actual:
- promoted:
  - mantener traza del origen `accept_all_review` o `risky_review`
  - pero dejarlo operativo como enviable para los scripts actuales
- discarded:
  - dejarlo fuera del pool enviable

Si hace falta compatibilidad rapida con scripts existentes:
- promoted => tratarlo operativamente como `valid_send`, con nota de auditoria `promoted_from_borderline`
- discarded => tratarlo operativamente como `invalid_discard`, con nota de auditoria `discarded_from_borderline`

5. No tocar los otros estados
- `valid_send` sigue entrando directo
- `invalid_discard` sigue descartado
- `unknown_review` sigue fuera

6. Reporte requerido
- cuantos contactos borderline habia al inicio
- split inicial por:
  - `accept_all_review`
  - `risky_review`
- cuantos fueron promovidos
- cuantos fueron descartados
- breakdown por:
  - cohort
  - `priority_tier`
  - `contact_type`
  - vertical
  - country

7. Output operativo
- generar CSV o JSON final con:
  - `contact_id`
  - `account_id`
  - `company_name`
  - `email`
  - `contact_type`
  - `priority_tier`
  - `source_confidence`
  - `verification_status_original`
  - `second_filter_score`
  - `second_filter_decision`
  - `second_filter_reason`
  - `final_send_eligibility`

8. Criterio de exito
- reducir al minimo el riesgo de meter borderline flojos al pool
- rescatar solo los `accept_all_review` y `risky_review` que realmente valgan
- dejar la etapa limpia: no quiero una cola abierta de estados borderline sin resolver

Archivos relevantes:
- `outbound/scripts/validate-emailable-batch.mjs`
- `outbound/scripts/validate-quickemail-batch.mjs`
- `outbound/scripts/export-operational-funnel.ps1`
- `outbound/docs/prospecting-to-outreach.md`
- `outbound/schema.md`

Entregable esperado:
- implementacion concreta del segundo filtro
- cambios de schema si hacen falta
- SQL o script aplicable a D1 remoto
- reporte con conteos antes/despues
- confirmacion de cuantos contactos pasaron de `accept_all_review` a pool enviable

Importante:
- no dejar esto como propuesta teorica
- implementarlo o dejar el SQL/script listo para ejecutar
- priorizar compatibilidad con el flujo actual y trazabilidad completa
