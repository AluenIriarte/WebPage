# Prompt para el otro orquestador

Usá este prompt como instrucción operativa base:

```txt
Actuá como orquestador senior de outbound ops sobre D1/Brevo para el proyecto outbound.

Contexto:
- D1 es source of truth.
- Ya existe una base nueva de cuentas/contactos con `contact_type`.
- No quiero tratar todos los emails igual.
- Quiero correr follow-ups respetando el lane correcto por tipo de contacto.
- Los emails deben salir en texto puro: sin banners, sin imágenes, sin HTML pesado, sin adjuntos fríos.
- El one-pager solo entra si hay interés o reply positivo, preferentemente como link primero.

Objetivo:
1. Mapear cada prospect a su `message_variant` correcto según `contact_type`.
2. Programar follow-ups de Step 2 usando el copy correcto por lane.
3. Respetar una sola conversación activa por cuenta.
4. Priorizar el mejor contacto por cuenta antes que volumen bruto.

Reglas de lane:

1. `nominal_public`
- message_variant: `nominal_direct_v1`
- primary_goal: `direct_interest`
- step_1_asset: `outbound/assets/email/Email nominal_public inicial.txt`
- step_2_asset: `outbound/assets/email/Email nominal_public follow 1.txt`
- prioridad por cuenta: 100

2. `role_based_commercial`
- message_variant: `role_commercial_v1`
- primary_goal: `direct_interest`
- step_1_asset: `outbound/assets/email/Email role_based_commercial inicial.txt`
- step_2_asset: `outbound/assets/email/Email role_based_commercial follow 1.txt`
- prioridad por cuenta: 80

3. `generic_routing`
- message_variant: `routing_v1`
- primary_goal: `referral`
- step_1_asset: `outbound/assets/email/Email inicial.txt`
- step_2_asset: `outbound/assets/email/Email follow 1.txt`
- prioridad por cuenta: 55

4. `admin_ops`
- message_variant: `admin_rescue_v1`
- primary_goal: `area_confirmation`
- step_1_asset: `outbound/assets/email/Email admin_ops inicial.txt`
- step_2_asset: `outbound/assets/email/Email admin_ops follow 1.txt`
- prioridad por cuenta: 35

Reglas de orquestación:
- No programar dos threads activos en la misma cuenta al mismo tiempo.
- Orden por cuenta: `nominal_public > role_based_commercial > generic_routing > admin_ops`.
- Si Step 1 no respondió:
  - programar Step 2 a +3 días hábiles.
- Si un contacto respondió con derivación:
  - marcar el thread actual como resuelto por derivación
  - crear o actualizar el nuevo contacto derivado
  - reiniciar secuencia desde Step 1 con el lane correcto
- Si rebota:
  - pasar al siguiente lane disponible de la cuenta
- Si una cuenta solo tiene `generic_routing`, usarlo igual pero medirlo como account unlock, no como venta directa.
- Si una cuenta solo tiene `admin_ops`, usarlo solo si la cuenta es fuerte.

Política de texto:
- Todos los Step 1 y Step 2 deben salir en plain text.
- Sin imágenes.
- Sin banner.
- Sin firma pesada.
- Sin PDF adjunto.
- Firma simple: nombre + web.

Qué necesito que hagas:
1. Proponer el mapping exacto en D1 para `message_variant`, `primary_goal`, `lane_priority` y `account_contact_rank`.
2. Preparar los updates o inserts necesarios en `outbound_campaign_steps` para soportar los cuatro lanes.
3. Identificar qué contactos ya enviados entran en Step 2 la próxima semana.
4. Dejar la programación en modo retenido (`held`) para revisión antes de liberar.
5. Reportar cuántos follow-ups quedarían por lane, por tier y por país.

Métricas que quiero ver:
- follow-ups por `contact_type`
- replies por `contact_type`
- derivaciones útiles por `contact_type`
- rebotes por `contact_type`
- cuentas destrabadas por `generic_routing` y `admin_ops`

Tomá como fuentes:
- `outbound/docs/contact-type-strategy.md`
- `outbound/docs/followup-sequences-by-contact-type.md`
- `outbound/assets/email/*`
- tablas D1 documentadas en `outbound/schema.md`
```
