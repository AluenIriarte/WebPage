# Brevo Worker

Este Worker resuelve dos endpoints:

- `POST /lead-magnet`
- `POST /quote-request`

## Secrets necesarios en Cloudflare

- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `QUOTE_SHEET_WEBHOOK_URL` (opcional)
- `QUOTE_SHEET_WEBHOOK_TOKEN` (recomendado si usas Google Sheets)

## Archivo para pegar en Cloudflare

Usar el contenido de:

- [brevo-worker.js](C:/Users/Alan/Desktop/trabajo/webpage/WebPage/workers/brevo-worker.js)

## Estado operativo actual

- Frontend: `src/app/lib/forms-api.ts`
- Worker publico esperado: `https://divine-bread-7e7e.alanlperez1996.workers.dev`
- Pagina de cotizacion: `src/app/pages/PresupuestoDashboard.tsx`
- Thank-you page de cotizacion: `src/app/pages/GraciasPresupuestoDashboard.tsx`

## Flujo recomendado

### Cotizacion

1. El usuario completa el brief
2. Si el submit sale bien, se muestra un aviso corto y redirige a `/gracias/presupuesto-dashboard`
3. El worker:
   - crea o actualiza el contacto en Brevo
   - lo agrega a la lista `Quote Requests`
   - envia confirmacion al lead
   - envia notificacion interna
4. Si el submit falla, el usuario se queda en la pagina y ve el error

## Limites a tener presentes

### Brevo Free

- 300 emails por dia
- 100.000 contactos

Como hoy una cotizacion envia 2 emails en Brevo:

- 1 al lead
- 1 interno

El cuello real de Brevo Free es aproximadamente 150 envios de formulario por dia si no se usa ese cupo para otra cosa.

### Cloudflare Workers Free

- 100.000 requests por dia
- 50 subrequests por invocacion
- 128 MB de memoria

Para este caso, el limite practico no es Cloudflare sino Brevo.

## Deliverability

- No usar `gmail.com` como sender transaccional
- Usar un sender del dominio propio, por ejemplo `contacto@alanlperez.com`
- Mantener DKIM activo
- Agregar DMARC en el dominio
- Revisar inbox y spam en las pruebas reales

## Backup de datos

Todavia no hay backup externo aparte de Brevo.

Opciones recomendadas:

1. Cloudflare D1
2. Google Sheets via Apps Script Web App
3. Slack webhook solo como notificacion, no como base primaria

Importante:

- Un link editor de Google Sheets no alcanza para escribir desde el worker
- Hace falta un webhook de Apps Script o credenciales de Google Sheets API
- Hay un ejemplo listo en `workers/google-sheets-webhook.gs`
- Si `QUOTE_SHEET_WEBHOOK_URL` esta configurado, la cotizacion se guarda en la Sheet y deja de usar el segundo email interno de Brevo
- Si no esta configurado, el worker mantiene el email interno como fallback

## Flujo actual

### Lead magnet

1. Crea o actualiza el contacto en Brevo
2. Lo agrega a la lista `Lead Magnet Requests`
3. Envía el recurso por email
4. Envía notificación interna

### Cotización

1. Crea o actualiza el contacto en Brevo
2. Lo agrega a la lista `Quote Requests`
3. Envía confirmación al lead
4. Envía notificación interna

## Endpoint público esperado

El frontend está apuntando a:

- `https://divine-bread-7e7e.alanlperez1996.workers.dev`

Si el Worker termina con otro nombre o URL, hay que actualizar:

- [forms-api.ts](C:/Users/Alan/Desktop/trabajo/webpage/WebPage/src/app/lib/forms-api.ts)
