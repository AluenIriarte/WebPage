# Brevo Worker

Este worker resuelve tres endpoints públicos de captación:

- `POST /lead-magnet`
- `POST /quote-request`
- `POST /process-evaluation`

## Estado actual

- Worker publico: `https://divine-bread-7e7e.alanlperez1996.workers.dev`
- Config de Wrangler: `workers/wrangler.toml`
- Script principal: `workers/brevo-worker.js`
- Tabla D1: `workers/d1-quote-requests.sql`
- Tabla D1 de evaluaciones: `workers/d1-process-evaluations.sql`

## Flujo de evaluación de procesos

1. El usuario completa el formulario en `/evaluar-proceso`.
2. El frontend envía el contexto operativo a `/process-evaluation`, sin archivos.
3. El Worker guarda la evaluación en `process_evaluations`.
4. Sincroniza el contacto a la lista `IA Contable - Evaluaciones` en Brevo.
5. Envía confirmación al lead y una notificación interna.
6. El lead agenda la demo privada desde `/gracias/evaluacion`.

## Flujo de cotizacion

1. El usuario completa el brief en `src/app/pages/PresupuestoDashboard.tsx`
2. El frontend envia el payload a `/quote-request`
3. El worker crea `requestId`
4. Guarda la cotizacion en D1 con estado `received`
5. Sincroniza o crea el contacto en Brevo
6. Envia un email de confirmacion al lead
7. Envia un email interno al destinatario configurado en `BREVO_NOTIFICATION_EMAIL` o usa `BREVO_SENDER_EMAIL` como fallback
8. Si hay `INTERNAL_NOTIFY_WEBHOOK_URL`, dispara una notificacion interna en segundo plano
9. Si todo sale bien, la cotizacion queda con estado `finalized`

## Secrets y bindings

Obligatorios:

- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- binding D1 `QUOTE_REQUESTS_DB`

Opcionales:

- `BREVO_NOTIFICATION_EMAIL`
- `BREVO_NOTIFICATION_NAME`
- `INTERNAL_NOTIFY_WEBHOOK_URL`
- `OUTBOUND_SUMMARIES_ON_HOLD`: default `true`; mientras este activo, el worker no envia los resumenes outbound diarios ni semanales.

## Comandos

Migrar tabla D1 remota:

```bash
npm run worker:d1:migrate
```

Migrar la tabla de evaluaciones:

```bash
npm run worker:d1:migrate:evaluations
```

Desplegar el worker preservando vars existentes en Cloudflare:

```bash
npm run worker:deploy
```

Ver logs:

```bash
npm run worker:tail
```

## Notas operativas

- `worker:deploy` usa `--keep-vars` para no borrar variables creadas desde el dashboard.
- El frontend puede sobreescribir la URL del worker con `VITE_FORMS_WORKER_BASE`.
- La respuesta de `/quote-request` ahora devuelve `requestId` para trazabilidad.
- `OUTBOUND_SUMMARIES_ON_HOLD=true` deja en pausa los mails automaticos de resumen outbound sin afectar los envios de la cola.
