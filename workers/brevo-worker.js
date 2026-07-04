const SITE_URL = "https://alanlperez.com";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
};

const ATTRIBUTE_DEFINITIONS = [
  { name: "COMPANY_NAME", type: "text" },
  { name: "LAST_RESOURCE", type: "text" },
  { name: "LAST_RESOURCE_URL", type: "text" },
  { name: "LAST_SOURCE", type: "text" },
  { name: "LAST_SERVICE", type: "text" },
  { name: "LAST_INTENT", type: "text" },
  { name: "ROLE_TITLE", type: "text" },
  { name: "LAST_OBJECTIVE", type: "text" },
  { name: "CURRENT_TOOLS", type: "text" },
  { name: "END_USERS", type: "text" },
  { name: "ESTIMATED_TIMELINE", type: "text" },
  { name: "MAIN_CHALLENGE", type: "text" },
  { name: "LAST_SUBMITTED_AT", type: "text" },
  { name: "PROCESS_INTEREST", type: "text" },
  { name: "MONTHLY_VOLUME", type: "text" },
];

const OUTBOUND_CAMPAIGN_ID = "ia_estudios_contables_ar_v1";
const OUTBOUND_DEFAULT_TIMEZONE = "America/Buenos_Aires";
const OUTBOUND_DEFAULT_BATCH_LIMIT = 50;
const OUTBOUND_SUMMARIES_ON_HOLD_DEFAULT = true;

let attributesEnsured = false;
const folderCache = new Map();
const listCache = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL || !env.BREVO_SENDER_NAME) {
      return json(
        {
          ok: false,
          message: "Faltan variables del worker para conectar Brevo.",
        },
        500,
      );
    }

    try {
      logInfo("request_received", {
        method: request.method,
        path: url.pathname,
      });

      if (request.method === "POST" && url.pathname === "/lead-magnet") {
        const payload = await request.json();
        await handleLeadMagnet(payload, env);
        return json({ ok: true, message: "Recurso enviado correctamente." });
      }

      if (request.method === "POST" && url.pathname === "/quote-request") {
        const payload = await request.json();
        const result = await handleQuoteRequest(payload, env, ctx);
        return json({
          ok: true,
          message: "Solicitud enviada correctamente.",
          requestId: result.requestId,
        });
      }

      if (request.method === "POST" && url.pathname === "/process-evaluation") {
        const payload = await request.json();
        const result = await handleProcessEvaluation(payload, env, ctx);
        return json({
          ok: true,
          message: "Evaluación enviada correctamente.",
          requestId: result.requestId,
        });
      }

      if (request.method === "GET" && url.pathname === "/unsubscribe") {
        const result = await handleUnsubscribe(url, env);
        return new Response(result.message, {
          status: result.status,
          headers: {
            "Content-Type": result.contentType || "text/plain; charset=utf-8",
          },
        });
      }

      if (url.pathname === "/outbound/status" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundStatus(env, url));
      }

      if (url.pathname === "/outbound/run" && request.method === "POST") {
        requireOutboundAdmin(request, env);
        const payload = await safeReadJson(request);
        const now = new Date();
        const brevoSync = await safeSyncBrevoOutboundEvents(env, {
          campaignId: payload?.campaignId || OUTBOUND_CAMPAIGN_ID,
          days: Number(payload?.brevoDays) || 7,
          limit: Number(payload?.brevoLimit) || 1000,
        });
        const result = await processOutboundQueue(env, {
          now,
          force: payload?.force === true,
          limit: Number(payload?.limit) || OUTBOUND_DEFAULT_BATCH_LIMIT,
        });
        const summariesOnHold = areOutboundSummariesOnHold(env);
        const summaryIds = summariesOnHold ? [] : await maybeSendDailySummary(env, now);
        const weeklySummaryIds = summariesOnHold ? [] : await maybeSendWeeklySummary(env, now);
        return json({
          ok: true,
          brevoSync,
          ...result,
          summariesOnHold,
          summaryIds,
          weeklySummaryIds,
        });
      }

      if (url.pathname === "/outbound/preview" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await previewOutboundQueue(env, url));
      }

      if (url.pathname === "/outbound/metrics" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundMetrics(env, url));
      }

      if (url.pathname === "/outbound/cohorts" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundCohorts(env, url));
      }

      if (url.pathname === "/outbound/accounts" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundAccounts(env, url));
      }

      if (url.pathname === "/outbound/raw-hits" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundRawHits(env, url));
      }

      if (url.pathname === "/outbound/prospect-contacts" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundProspectContacts(env, url));
      }

      if (url.pathname === "/outbound/ready-validation" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundReadyValidation(env, url));
      }

      if (url.pathname === "/outbound/contact-stock" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundContactStock(env, url));
      }

      if (url.pathname === "/outbound/followups" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getOutboundFollowups(env, url));
      }

      if (url.pathname === "/outbound/schedule-followups" && request.method === "POST") {
        requireOutboundAdmin(request, env);
        const payload = await safeReadJson(request);
        return json(await scheduleOutboundFollowups(env, payload));
      }

      if (url.pathname === "/outbound/brevo-stats" && request.method === "GET") {
        requireOutboundAdmin(request, env);
        return json(await getBrevoOutboundStats(env, url));
      }

      if (url.pathname === "/outbound/sync-brevo-events" && request.method === "POST") {
        requireOutboundAdmin(request, env);
        const payload = await safeReadJson(request);
        return json(
          await syncBrevoOutboundEvents(env, {
            campaignId: payload?.campaignId || OUTBOUND_CAMPAIGN_ID,
            days: Number(payload?.days) || 7,
            limit: Number(payload?.limit) || 1000,
          }),
        );
      }

      if (url.pathname === "/outbound/mark-response" && request.method === "POST") {
        requireOutboundAdmin(request, env);
        const payload = await safeReadJson(request);
        return json(await markOutboundResponse(env, payload));
      }

      return json({ ok: false, message: "Ruta no encontrada." }, 404);
    } catch (error) {
      const status = Number(error?.status) || 400;
      logError("request_failed", {
        method: request.method,
        path: url.pathname,
        message: error instanceof Error ? error.message : "unknown_error",
      });

      return json(
        {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : "No se pudo procesar la solicitud.",
        },
        status,
      );
    }
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(handleOutboundScheduled(env, controller));
  },
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: CORS_HEADERS,
  });
}

function httpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function safeReadJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function logInfo(event, payload = {}) {
  console.log(JSON.stringify({ level: "info", event, ...payload }));
}

function logError(event, payload = {}) {
  console.error(JSON.stringify({ level: "error", event, ...payload }));
}

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function requireEmail(email) {
  const normalized = normalize(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalized)) {
    throw new Error("Necesitamos un email valido para continuar.");
  }

  return normalized;
}

function requireValue(value, message) {
  const normalized = normalize(value);
  if (!normalized) {
    throw new Error(message);
  }
  return normalized;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function optionalValue(value) {
  return normalize(value) || "-";
}

function requiresSources(producto) {
  return normalize(producto).toLowerCase().includes("dashboard");
}

function getInternalRecipient(env) {
  return {
    email: env.BREVO_NOTIFICATION_EMAIL || env.BREVO_SENDER_EMAIL,
    name: env.BREVO_NOTIFICATION_NAME || env.BREVO_SENDER_NAME,
  };
}

function parseEnvBoolean(value, fallback = false) {
  const normalized = normalize(value);
  if (!normalized) {
    return fallback;
  }

  switch (normalized.toLowerCase()) {
    case "1":
    case "true":
    case "yes":
    case "on":
      return true;
    case "0":
    case "false":
    case "no":
    case "off":
      return false;
    default:
      return fallback;
  }
}

function areOutboundSummariesOnHold(env) {
  return parseEnvBoolean(env.OUTBOUND_SUMMARIES_ON_HOLD, OUTBOUND_SUMMARIES_ON_HOLD_DEFAULT);
}

function createRequestId() {
  return crypto.randomUUID();
}

async function brevoFetch(env, path, init = {}) {
  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.BREVO_API_KEY,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo devolvio ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function ensureContactAttribute(env, attributeName, type = "text") {
  try {
    await brevoFetch(env, `/contacts/attributes/normal/${attributeName}`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("400")) {
      throw error;
    }
  }
}

async function ensureAttributes(env) {
  if (attributesEnsured) {
    return;
  }

  await Promise.all(
    ATTRIBUTE_DEFINITIONS.map((attribute) =>
      ensureContactAttribute(env, attribute.name, attribute.type),
    ),
  );

  attributesEnsured = true;
}

async function ensureFolder(env, folderName) {
  if (folderCache.has(folderName)) {
    return folderCache.get(folderName);
  }

  const existing = await brevoFetch(env, "/contacts/folders?limit=50");
  const folder = existing?.folders?.find((item) => item.name === folderName);
  if (folder) {
    folderCache.set(folderName, folder.id);
    return folder.id;
  }

  const created = await brevoFetch(env, "/contacts/folders", {
    method: "POST",
    body: JSON.stringify({ name: folderName }),
  });
  folderCache.set(folderName, created.id);
  return created.id;
}

async function ensureList(env, listName, folderId) {
  const cacheKey = `${folderId}:${listName}`;
  if (listCache.has(cacheKey)) {
    return listCache.get(cacheKey);
  }

  const existing = await brevoFetch(env, "/contacts/lists?limit=50");
  const list = existing?.lists?.find((item) => item.name === listName);
  if (list) {
    listCache.set(cacheKey, list.id);
    return list.id;
  }

  const created = await brevoFetch(env, "/contacts/lists", {
    method: "POST",
    body: JSON.stringify({ name: listName, folderId }),
  });
  listCache.set(cacheKey, created.id);
  return created.id;
}

async function upsertContact(env, { email, firstName, listName, attributes }) {
  await ensureAttributes(env);
  const folderId = await ensureFolder(env, "Website");
  const listId = await ensureList(env, listName, folderId);

  await brevoFetch(env, "/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      updateEnabled: true,
      listIds: [listId],
      attributes: {
        FIRSTNAME: firstName,
        ...attributes,
      },
    }),
  });
}

async function sendEmail(env, payload) {
  return brevoFetch(env, "/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      sender: {
        email: env.BREVO_SENDER_EMAIL,
        name: env.BREVO_SENDER_NAME,
      },
      ...payload,
    }),
  });
}

async function insertQuoteRequest(env, payload) {
  if (!env.QUOTE_REQUESTS_DB || typeof env.QUOTE_REQUESTS_DB.prepare !== "function") {
    logInfo("quote_request_d1_not_configured", {
      email: payload.email,
      empresa: payload.empresa,
      producto: payload.producto,
    });
    return null;
  }

  await env.QUOTE_REQUESTS_DB.prepare(
    `
      INSERT INTO quote_requests (
        request_id,
        submitted_at,
        source,
        intent,
        nombre,
        email,
        empresa,
        producto,
        rol,
        objetivo,
        fuentes,
        destinatarios,
        plazo,
        desafio,
        status,
        brevo_contact_synced_at,
        lead_email_sent_at,
        internal_notified_at,
        error_message,
        raw_payload
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  )
    .bind(
      payload.requestId,
      payload.submittedAt,
      payload.source || "website",
      payload.intent || "quote_request",
      payload.nombre,
      payload.email,
      payload.empresa,
      payload.producto,
      payload.rol,
      payload.objetivo,
      payload.fuentes,
      payload.destinatarios,
      payload.plazo,
      payload.desafio,
      "received",
      null,
      null,
      null,
      null,
      JSON.stringify(payload),
    )
    .run();

  logInfo("quote_request_saved_to_d1", {
    email: payload.email,
    empresa: payload.empresa,
    producto: payload.producto,
  });

  return payload.requestId;
}

async function updateQuoteRequest(env, requestId, updates) {
  if (!requestId || !env.QUOTE_REQUESTS_DB || typeof env.QUOTE_REQUESTS_DB.prepare !== "function") {
    return false;
  }

  const entries = Object.entries(updates).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return true;
  }

  const assignments = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => value);

  await env.QUOTE_REQUESTS_DB.prepare(
    `UPDATE quote_requests SET ${assignments}, updated_at = ? WHERE request_id = ?`,
  )
    .bind(...values, new Date().toISOString(), requestId)
    .run();

  return true;
}

async function insertProcessEvaluation(env, payload) {
  if (!env.QUOTE_REQUESTS_DB || typeof env.QUOTE_REQUESTS_DB.prepare !== "function") {
    throw httpError("D1 no está configurado para recibir evaluaciones.", 500);
  }

  await env.QUOTE_REQUESTS_DB.prepare(
    `
      INSERT INTO process_evaluations (
        request_id,
        submitted_at,
        source,
        landing_path,
        utm_source,
        utm_medium,
        utm_campaign,
        nombre,
        email,
        estudio,
        rol,
        proceso,
        volumen,
        sistemas_formatos,
        cuello_botella,
        status,
        brevo_contact_synced_at,
        lead_email_sent_at,
        internal_notified_at,
        error_message,
        raw_payload
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  )
    .bind(
      payload.requestId,
      payload.submittedAt,
      payload.source,
      payload.landingPath,
      payload.utmSource,
      payload.utmMedium,
      payload.utmCampaign,
      payload.nombre,
      payload.email,
      payload.estudio,
      payload.rol,
      payload.proceso,
      payload.volumen,
      payload.sistemasFormatos,
      payload.cuelloBotella,
      "received",
      null,
      null,
      null,
      null,
      JSON.stringify(payload),
    )
    .run();

  logInfo("process_evaluation_saved_to_d1", {
    requestId: payload.requestId,
    email: payload.email,
    estudio: payload.estudio,
    proceso: payload.proceso,
  });
}

async function updateProcessEvaluation(env, requestId, updates) {
  if (!requestId || !env.QUOTE_REQUESTS_DB || typeof env.QUOTE_REQUESTS_DB.prepare !== "function") {
    return false;
  }

  const entries = Object.entries(updates).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return true;
  }

  const assignments = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => value);

  await env.QUOTE_REQUESTS_DB.prepare(
    `UPDATE process_evaluations SET ${assignments}, updated_at = ? WHERE request_id = ?`,
  )
    .bind(...values, new Date().toISOString(), requestId)
    .run();

  return true;
}

function buildInternalNotificationText(payload) {
  return [
    "Nueva solicitud de cotizacion",
    "",
    `ID: ${payload.requestId}`,
    `Nombre: ${payload.nombre}`,
    `Email: ${payload.email}`,
    `Empresa: ${payload.empresa}`,
    `Producto o servicio: ${payload.producto}`,
    `Rol: ${optionalValue(payload.rol)}`,
    `Objetivo: ${optionalValue(payload.objetivo)}`,
    `Fuentes o herramientas: ${optionalValue(payload.fuentes)}`,
    `Quienes lo usan: ${optionalValue(payload.destinatarios)}`,
    `Plazo: ${optionalValue(payload.plazo)}`,
    `Desafio principal: ${optionalValue(payload.desafio)}`,
    `Fecha: ${payload.submittedAt}`,
  ].join("\n");
}

function buildInternalNotificationPayload(webhookUrl, payload) {
  const text = buildInternalNotificationText(payload);
  const host = webhookUrl.hostname;

  if (host.includes("discord.com") || host.includes("discordapp.com")) {
    return { content: text };
  }

  if (host.includes("slack.com") || host.includes("chat.googleapis.com")) {
    return { text };
  }

  return {
    text,
    kind: payload.intent || "quote_request",
    requestId: payload.requestId,
    payload,
  };
}

async function sendInternalNotification(env, payload) {
  if (!env.INTERNAL_NOTIFY_WEBHOOK_URL) {
    logInfo("quote_request_notification_not_configured", {
      requestId: payload.requestId,
      email: payload.email,
      empresa: payload.empresa,
      producto: payload.producto,
    });
    return false;
  }

  const webhookUrl = new URL(env.INTERNAL_NOTIFY_WEBHOOK_URL);
  const response = await fetch(webhookUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildInternalNotificationPayload(webhookUrl, payload)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Internal webhook devolvio ${response.status}: ${errorText}`);
  }

  return true;
}

function requireOutboundDb(env) {
  if (!env.QUOTE_REQUESTS_DB || typeof env.QUOTE_REQUESTS_DB.prepare !== "function") {
    throw httpError("D1 no esta configurado para outbound.", 500);
  }

  return env.QUOTE_REQUESTS_DB;
}

function requireOutboundAdmin(request, env) {
  if (!env.OUTBOUND_ADMIN_TOKEN) {
    throw httpError("Falta configurar OUTBOUND_ADMIN_TOKEN.", 503);
  }

  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (token !== env.OUTBOUND_ADMIN_TOKEN) {
    throw httpError("No autorizado.", 401);
  }
}

function getOutboundPublicBaseUrl(env) {
  return (env.OUTBOUND_PUBLIC_BASE_URL || "https://divine-bread-7e7e.alanlperez1996.workers.dev").replace(
    /\/$/,
    "",
  );
}

function toIso(value = new Date()) {
  return value.toISOString();
}

function getLocalParts(date, timezone = OUTBOUND_DEFAULT_TIMEZONE) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);

  return {
    year,
    month,
    day,
    hour,
    minute,
    second: Number(parts.second),
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
    minutes: hour * 60 + minute,
  };
}

function parseTimeToMinutes(value) {
  const [hour, minute] = String(value || "00:00")
    .split(":")
    .map((part) => Number(part));
  return hour * 60 + minute;
}

function isWithinSendWindow(campaign, now) {
  const timezone = campaign.timezone || OUTBOUND_DEFAULT_TIMEZONE;
  const local = getLocalParts(now, timezone);
  const allowedDays = String(campaign.send_days || "1,2,3,4,5")
    .split(",")
    .map((day) => Number(day.trim()));
  const start = parseTimeToMinutes(campaign.send_window_start || "09:30");
  const end = parseTimeToMinutes(campaign.send_window_end || "17:30");

  return allowedDays.includes(local.weekday) && local.minutes >= start && local.minutes <= end;
}

function shouldSendSummary(campaign, now) {
  const local = getLocalParts(now, campaign.timezone || OUTBOUND_DEFAULT_TIMEZONE);
  const summaryAt = parseTimeToMinutes(campaign.summary_time || "18:15");
  return local.minutes >= summaryAt && local.minutes < summaryAt + 30;
}

function shouldSendWeeklySummary(campaign, now) {
  const local = getLocalParts(now, campaign.timezone || OUTBOUND_DEFAULT_TIMEZONE);
  return local.weekday === 5 && shouldSendSummary(campaign, now);
}

function getBuenosAiresDayBoundsUtc(localDate) {
  const [year, month, day] = localDate.split("-").map((part) => Number(part));
  const start = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day + 1, 3, 0, 0));
  return { start: start.toISOString(), end: end.toISOString() };
}

function getBuenosAiresWeekBoundsUtc(localDate) {
  const [year, month, day] = localDate.split("-").map((part) => Number(part));
  const localDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const weekday = localDay.getUTCDay();
  const diffToMonday = weekday === 0 ? 6 : weekday - 1;

  const weekStartLocal = new Date(localDay);
  weekStartLocal.setUTCDate(weekStartLocal.getUTCDate() - diffToMonday);

  const weekEndLocal = new Date(weekStartLocal);
  weekEndLocal.setUTCDate(weekEndLocal.getUTCDate() + 6);

  const start = new Date(
    Date.UTC(
      weekStartLocal.getUTCFullYear(),
      weekStartLocal.getUTCMonth(),
      weekStartLocal.getUTCDate(),
      3,
      0,
      0,
    ),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    weekStartDate: weekStartLocal.toISOString().slice(0, 10),
    weekEndDate: weekEndLocal.toISOString().slice(0, 10),
  };
}

function localBuenosAiresToUtcIso(localDate, localTime) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(localDate || ""))) {
    throw httpError("localDate debe tener formato yyyy-mm-dd.", 400);
  }
  if (!/^\d{2}:\d{2}$/.test(String(localTime || ""))) {
    throw httpError("Los horarios deben tener formato HH:mm.", 400);
  }

  const [year, month, day] = localDate.split("-").map((part) => Number(part));
  const [hour, minute] = localTime.split(":").map((part) => Number(part));
  if (hour > 23 || minute > 59) {
    throw httpError("Horario invalido.", 400);
  }

  return new Date(Date.UTC(year, month - 1, day, hour + 3, minute, 0)).toISOString();
}

function textToHtml(text) {
  return String(text)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function buildUnsubscribeUrl(env, prospectId) {
  return `${getOutboundPublicBaseUrl(env)}/unsubscribe?pid=${encodeURIComponent(prospectId)}`;
}

function appendOutboundFooter(text, env, prospectId) {
  return [
    text.trim(),
    "",
    "--",
    `Si preferis que no vuelva a escribirte, avisame y no te escribo mas: ${buildUnsubscribeUrl(env, prospectId)}`,
  ].join("\n");
}

function buildOutboundHtmlContent(text, env, prospectId) {
  const unsubscribeUrl = buildUnsubscribeUrl(env, prospectId);
  const bodyHtml = textToHtml(text.trim());

  return [
    bodyHtml,
    `<p style="margin-top: 20px; font-size: 12px; line-height: 1.4; color: #777;">--<br />Si preferis que no vuelva a escribirte, <a href="${escapeHtml(unsubscribeUrl)}" style="color: inherit; text-decoration: underline;">avisame y no te escribo mas</a>.</p>`,
  ].join("");
}

function buildOutboundGreeting(prospect) {
  const contactName = normalize(prospect.contact_name);
  if (!contactName) {
    return "Hola, buen dia.";
  }

  const firstName = contactName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)[0];
  return firstName ? `Hola ${firstName}, buen dia.` : "Hola, buen dia.";
}

function buildOutboundFirstName(prospect) {
  const greeting = buildOutboundGreeting(prospect);
  const match = greeting.match(/^Hola\s+([^,]+),/i);
  return match?.[1] || "";
}

function personalizeOutboundContent(content, prospect) {
  return String(content || "")
    .replaceAll("{{greeting}}", buildOutboundGreeting(prospect))
    .replaceAll("{{first_name}}", buildOutboundFirstName(prospect))
    .replaceAll("{{company_name}}", prospect.company_name || "")
    .replaceAll("{{contact_name}}", prospect.contact_name || "")
    .replaceAll("{{industry}}", prospect.industry || "")
    .replaceAll("Hola ,", "Hola,");
}

async function getOutboundStatus(env, url) {
  const db = requireOutboundDb(env);
  const campaignId = url.searchParams.get("campaignId") || OUTBOUND_CAMPAIGN_ID;
  const [prospects, queue, nextPending, campaign] = await Promise.all([
    db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM outbound_prospects
         WHERE sequence_id = ?
         GROUP BY status
         ORDER BY count DESC`,
      )
      .bind(campaignId)
      .all(),
    db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM outbound_send_queue
         WHERE campaign_id = ?
         GROUP BY status
         ORDER BY count DESC`,
      )
      .bind(campaignId)
      .all(),
    db
      .prepare(
        `SELECT scheduled_at, COUNT(*) AS count
         FROM outbound_send_queue
         WHERE campaign_id = ? AND status = 'pending'
         GROUP BY scheduled_at
         ORDER BY scheduled_at ASC
         LIMIT 12`,
      )
      .bind(campaignId)
      .all(),
    db.prepare(`SELECT * FROM outbound_campaigns WHERE id = ?`).bind(campaignId).first(),
  ]);

  return {
    ok: true,
    campaignId,
    campaign,
    prospects: prospects.results || [],
    queue: queue.results || [],
    nextPending: nextPending.results || [],
  };
}

function boundedLimit(url, defaultValue = 100, maxValue = 1000) {
  return Math.max(1, Math.min(Number(url.searchParams.get("limit")) || defaultValue, maxValue));
}

function boundedOffset(url) {
  return Math.max(0, Number(url.searchParams.get("offset")) || 0);
}

function pushEqualsFilter(filters, values, column, value) {
  const normalized = normalize(value);
  if (!normalized) {
    return;
  }

  filters.push(`${column} = ?`);
  values.push(normalized);
}

async function getOutboundCohorts(env, url) {
  const db = requireOutboundDb(env);
  const limit = boundedLimit(url, 100, 500);
  const offset = boundedOffset(url);
  const result = await db
    .prepare(
      `SELECT
         c.cohort_id,
         c.name,
         c.description,
         c.source,
         c.status,
         COUNT(DISTINCT a.account_id) AS accounts,
         COUNT(DISTINCT pc.contact_id) AS prospect_contacts,
         COUNT(DISTINCT p.id) AS published_prospects,
         c.created_at,
         c.updated_at
       FROM outbound_cohorts c
       LEFT JOIN outbound_accounts a ON a.cohort_id = c.cohort_id
       LEFT JOIN outbound_prospect_contacts pc ON pc.cohort_id = c.cohort_id
       LEFT JOIN outbound_prospects p ON p.cohort_id = c.cohort_id
       GROUP BY c.cohort_id, c.name, c.description, c.source, c.status, c.created_at, c.updated_at
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(limit, offset)
    .all();

  return {
    ok: true,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function getOutboundAccounts(env, url) {
  const db = requireOutboundDb(env);
  const limit = boundedLimit(url, 100, 1000);
  const offset = boundedOffset(url);
  const filters = [];
  const values = [];
  const pendingOnly = url.searchParams.get("pendingDiscovery") === "1";

  pushEqualsFilter(filters, values, "cohort_id", url.searchParams.get("cohortId"));
  pushEqualsFilter(filters, values, "status", url.searchParams.get("status"));
  pushEqualsFilter(filters, values, "priority_tier", url.searchParams.get("tier"));

  if (pendingOnly) {
    filters.push(
      `domain IS NOT NULL
       AND TRIM(domain) != ''
       AND status IN ('candidate', 'approved', 'active')
       AND (
         last_public_discovery_at IS NULL
         OR datetime(last_public_discovery_at) < datetime('now', '-14 days')
       )`,
    );
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await db
    .prepare(
      `SELECT *
       FROM outbound_accounts
       ${where}
       ORDER BY icp_fit_score DESC, priority_tier ASC, company_name ASC
       LIMIT ? OFFSET ?`,
    )
    .bind(...values, limit, offset)
    .all();

  return {
    ok: true,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function getOutboundRawHits(env, url) {
  const db = requireOutboundDb(env);
  const limit = boundedLimit(url, 200, 1000);
  const offset = boundedOffset(url);
  const filters = [];
  const values = [];

  pushEqualsFilter(filters, values, "h.cohort_id", url.searchParams.get("cohortId"));
  pushEqualsFilter(filters, values, "h.account_id", url.searchParams.get("accountId"));
  pushEqualsFilter(filters, values, "h.email", url.searchParams.get("email"));
  pushEqualsFilter(filters, values, "h.status", url.searchParams.get("status"));

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await db
    .prepare(
      `SELECT
         h.*,
         a.company_name,
         a.domain,
         a.priority_tier
       FROM outbound_raw_email_hits h
       LEFT JOIN outbound_accounts a ON a.account_id = h.account_id
       ${where}
       ORDER BY h.discovered_at DESC, h.account_id ASC
       LIMIT ? OFFSET ?`,
    )
    .bind(...values, limit, offset)
    .all();

  return {
    ok: true,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function getOutboundProspectContacts(env, url) {
  const db = requireOutboundDb(env);
  const limit = boundedLimit(url, 200, 1000);
  const offset = boundedOffset(url);
  const filters = [];
  const values = [];

  pushEqualsFilter(filters, values, "pc.cohort_id", url.searchParams.get("cohortId"));
  pushEqualsFilter(filters, values, "pc.account_id", url.searchParams.get("accountId"));
  pushEqualsFilter(filters, values, "pc.final_status", url.searchParams.get("status"));
  pushEqualsFilter(filters, values, "pc.contact_type", url.searchParams.get("contactType"));

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await db
    .prepare(
      `SELECT
         pc.*,
         a.company_name,
         a.domain,
         a.vertical,
         a.geo,
         a.priority_tier,
         a.icp_fit_score
       FROM outbound_prospect_contacts pc
       LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
       ${where}
       ORDER BY pc.prospecting_score DESC, pc.source_confidence DESC, pc.email ASC
       LIMIT ? OFFSET ?`,
    )
    .bind(...values, limit, offset)
    .all();

  return {
    ok: true,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function getOutboundReadyValidation(env, url) {
  const db = requireOutboundDb(env);
  const limit = boundedLimit(url, 200, 1000);
  const offset = boundedOffset(url);
  const filters = [
    "pc.final_status IN ('candidate_validation', 'routing_only_pre_validation')",
    "(pc.verification_status IS NULL OR pc.verification_status = '' OR pc.verification_status = 'pending')",
  ];
  const values = [];

  pushEqualsFilter(filters, values, "pc.cohort_id", url.searchParams.get("cohortId"));
  pushEqualsFilter(filters, values, "pc.account_id", url.searchParams.get("accountId"));

  const result = await db
    .prepare(
      `SELECT
         pc.*,
         a.company_name,
         a.domain,
         a.vertical,
         a.geo,
         a.priority_tier,
         a.icp_fit_score
       FROM outbound_prospect_contacts pc
       LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
       WHERE ${filters.join(" AND ")}
       ORDER BY pc.final_status ASC, pc.prospecting_score DESC, pc.source_confidence DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...values, limit, offset)
    .all();

  return {
    ok: true,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function getOutboundContactStock(env, url) {
  const db = requireOutboundDb(env);
  const limit = boundedLimit(url, 500, 2000);
  const offset = boundedOffset(url);
  const filters = [
    "pc.final_status IN ('candidate_validation', 'routing_only_pre_validation', 'review_pre_validation')",
    "(pc.verification_status IS NULL OR pc.verification_status = '' OR pc.verification_status = 'pending')",
  ];
  const values = [];

  pushEqualsFilter(filters, values, "pc.cohort_id", url.searchParams.get("cohortId"));
  pushEqualsFilter(filters, values, "pc.account_id", url.searchParams.get("accountId"));
  pushEqualsFilter(filters, values, "pc.contact_type", url.searchParams.get("contactType"));

  const result = await db
    .prepare(
      `SELECT
         pc.*,
         a.company_name,
         a.domain,
         a.vertical,
         a.geo,
         a.priority_tier,
         a.icp_fit_score
       FROM outbound_prospect_contacts pc
       LEFT JOIN outbound_accounts a ON a.account_id = pc.account_id
       WHERE ${filters.join(" AND ")}
       ORDER BY
         CASE pc.final_status
           WHEN 'candidate_validation' THEN 0
           WHEN 'routing_only_pre_validation' THEN 1
           WHEN 'review_pre_validation' THEN 2
           ELSE 3
         END,
         pc.prospecting_score DESC,
         pc.source_confidence DESC,
         pc.email ASC
       LIMIT ? OFFSET ?`,
    )
    .bind(...values, limit, offset)
    .all();

  return {
    ok: true,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function previewOutboundQueue(env, url) {
  const db = requireOutboundDb(env);
  const campaignId = url.searchParams.get("campaignId") || OUTBOUND_CAMPAIGN_ID;
  const status = url.searchParams.get("status") || "pending";
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit")) || 50, 200));
  const result = await db
    .prepare(
      `SELECT
        q.id AS queue_id,
        q.status AS queue_status,
        q.scheduled_at,
        q.step_number,
        p.id AS prospect_id,
        p.company_name,
        p.email,
        p.contact_name,
        p.contact_type,
        p.message_variant,
        p.campaign_segment,
        p.industry,
        p.company_type,
        p.icp_score,
        p.priority,
        s.subject,
        s.text_content
       FROM outbound_send_queue q
       JOIN outbound_prospects p ON p.id = q.prospect_id
       JOIN outbound_campaign_steps s
         ON s.campaign_id = q.campaign_id
        AND s.message_variant = COALESCE(p.message_variant, 'routing_v1')
        AND s.step_number = q.step_number
       WHERE q.campaign_id = ? AND q.status = ?
       ORDER BY
         q.scheduled_at ASC,
         COALESCE(p.lane_priority, 0) DESC,
         COALESCE(p.account_contact_rank, 9999) ASC,
         p.icp_score DESC
       LIMIT ?`,
    )
    .bind(campaignId, status, limit)
    .all();

  return {
    ok: true,
    campaignId,
    status,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

async function getOutboundMetrics(env, url) {
  const db = requireOutboundDb(env);
  const campaignId = url.searchParams.get("campaignId") || OUTBOUND_CAMPAIGN_ID;
  const [bySegment, byQueueStatus, byEvent, byContactType, byContactTypeCountryTier] = await Promise.all([
    db
      .prepare(
        `SELECT
          p.campaign_segment,
          COUNT(*) AS prospects,
          SUM(CASE WHEN p.status LIKE 'sent_step_%' THEN 1 ELSE 0 END) AS sent,
          SUM(CASE WHEN p.status = 'replied' THEN 1 ELSE 0 END) AS replied,
          SUM(CASE WHEN p.status = 'bounced' THEN 1 ELSE 0 END) AS bounced,
          SUM(CASE WHEN p.status = 'unsubscribed' THEN 1 ELSE 0 END) AS unsubscribed,
          SUM(CASE WHEN p.status = 'do_not_contact' THEN 1 ELSE 0 END) AS do_not_contact
         FROM outbound_prospects p
         WHERE p.sequence_id = ?
         GROUP BY p.campaign_segment
         ORDER BY prospects DESC`,
      )
      .bind(campaignId)
      .all(),
    db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM outbound_send_queue
         WHERE campaign_id = ?
         GROUP BY status
         ORDER BY count DESC`,
      )
      .bind(campaignId)
      .all(),
    db
      .prepare(
        `SELECT event_type, COUNT(*) AS count
         FROM outbound_email_events
         WHERE campaign_id = ?
         GROUP BY event_type
         ORDER BY count DESC`,
      )
      .bind(campaignId)
      .all(),
    db
      .prepare(
        `SELECT
          COALESCE(p.contact_type, p.email_type, 'unknown') AS contact_type,
          COALESCE(p.message_variant, 'routing_v1') AS message_variant,
          COUNT(DISTINCT CASE
            WHEN q.step_number = 2 AND q.status IN ('pending', 'held', 'processing', 'sent')
            THEN p.id
          END) AS followups,
          COUNT(DISTINCT CASE WHEN p.status = 'replied' THEN p.id END) AS replies,
          COUNT(DISTINCT CASE WHEN e.event_type = 'wrong_person' THEN p.id END) AS useful_referrals,
          COUNT(DISTINCT CASE WHEN p.status = 'bounced' THEN p.id END) AS bounces,
          COUNT(DISTINCT CASE
            WHEN COALESCE(p.message_variant, 'routing_v1') IN ('routing_v1', 'admin_rescue_v1')
             AND e.event_type = 'wrong_person'
            THEN COALESCE(p.account_id, p.domain, p.company_name)
          END) AS unlocked_accounts
         FROM outbound_prospects p
         LEFT JOIN outbound_send_queue q
           ON q.prospect_id = p.id
          AND q.campaign_id = p.sequence_id
         LEFT JOIN outbound_email_events e
           ON e.prospect_id = p.id
          AND e.campaign_id = p.sequence_id
         WHERE p.sequence_id = ?
         GROUP BY COALESCE(p.contact_type, p.email_type, 'unknown'), COALESCE(p.message_variant, 'routing_v1')
         ORDER BY followups DESC, replies DESC`,
      )
      .bind(campaignId)
      .all(),
    db
      .prepare(
        `SELECT
          COALESCE(p.contact_type, p.email_type, 'unknown') AS contact_type,
          COALESCE(p.message_variant, 'routing_v1') AS message_variant,
          COALESCE(a.priority_tier, p.priority, 'unknown') AS priority_tier,
          COALESCE(a.country, p.country, 'unknown') AS country,
          COUNT(DISTINCT CASE
            WHEN q.step_number = 2 AND q.status IN ('pending', 'held', 'processing', 'sent')
            THEN p.id
          END) AS followups
         FROM outbound_prospects p
         LEFT JOIN outbound_accounts a ON a.account_id = p.account_id
         LEFT JOIN outbound_send_queue q
           ON q.prospect_id = p.id
          AND q.campaign_id = p.sequence_id
         WHERE p.sequence_id = ?
         GROUP BY
          COALESCE(p.contact_type, p.email_type, 'unknown'),
          COALESCE(p.message_variant, 'routing_v1'),
          COALESCE(a.priority_tier, p.priority, 'unknown'),
          COALESCE(a.country, p.country, 'unknown')
         HAVING followups > 0
         ORDER BY followups DESC, priority_tier ASC, country ASC`,
      )
      .bind(campaignId)
      .all(),
  ]);

  return {
    ok: true,
    campaignId,
    bySegment: bySegment.results || [],
    byQueueStatus: byQueueStatus.results || [],
    byEvent: byEvent.results || [],
    byContactType: byContactType.results || [],
    byContactTypeCountryTier: byContactTypeCountryTier.results || [],
  };
}

async function getOutboundFollowups(env, url) {
  const db = requireOutboundDb(env);
  const campaignId = url.searchParams.get("campaignId") || OUTBOUND_CAMPAIGN_ID;
  const nextStep = Math.max(2, Math.min(Number(url.searchParams.get("nextStep")) || 2, 3));
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit")) || 200, 500));
  const includeInternal = url.searchParams.get("includeInternal") === "1";

  const result = await db
    .prepare(
      `SELECT *
       FROM outbound_next_followup_candidates
       WHERE campaign_id = ?
         AND next_step_number = ?
         AND (? = 1 OR COALESCE(campaign_segment, '') != 'internal_test')
       ORDER BY
         lane_priority DESC,
         account_contact_rank ASC,
         current_step_sent_at ASC,
         prospecting_score DESC
       LIMIT ?`,
    )
    .bind(campaignId, nextStep, includeInternal ? 1 : 0, limit)
    .all();

  return {
    ok: true,
    campaignId,
    nextStep,
    includeInternal,
    count: result.results?.length || 0,
    items: result.results || [],
  };
}

function parseFollowupTimes(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalize(item)).filter(Boolean);
  }
  const raw = normalize(value);
  if (!raw) {
    return ["09:30"];
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function scheduleOutboundFollowups(env, payload = {}) {
  const db = requireOutboundDb(env);
  const campaignId = normalize(payload.campaignId) || OUTBOUND_CAMPAIGN_ID;
  const nextStep = Math.max(2, Math.min(Number(payload.nextStep) || 2, 3));
  const localDate = normalize(payload.localDate);
  const times = parseFollowupTimes(payload.times || payload.localTimes);
  const blockSize = Math.max(1, Math.min(Number(payload.blockSize) || 25, 50));
  const limit = Math.max(1, Math.min(Number(payload.limit) || times.length * blockSize, 500));
  const queueStatus = payload.status === "pending" ? "pending" : "held";
  const includeInternal = payload.includeInternal === true;

  if (!localDate) {
    throw httpError("Falta localDate para programar follow-ups.", 400);
  }

  const candidates = await db
    .prepare(
      `SELECT *
       FROM outbound_next_followup_candidates
       WHERE campaign_id = ?
         AND next_step_number = ?
         AND (? = 1 OR COALESCE(campaign_segment, '') != 'internal_test')
       ORDER BY
         lane_priority DESC,
         account_contact_rank ASC,
         current_step_sent_at ASC,
         prospecting_score DESC
       LIMIT ?`,
    )
    .bind(campaignId, nextStep, includeInternal ? 1 : 0, limit)
    .all();

  const rows = candidates.results || [];
  if (rows.length === 0) {
    return { ok: true, campaignId, nextStep, scheduled: 0, status: queueStatus, items: [] };
  }

  const statements = [];
  const scheduledItems = [];

  rows.forEach((row, index) => {
    const timeIndex = Math.min(Math.floor(index / blockSize), times.length - 1);
    const localTime = times[timeIndex];
    const scheduledAt = localBuenosAiresToUtcIso(localDate, localTime);
    const queueId = `${campaignId}:${row.prospect_id}:${nextStep}`;

    statements.push(
      db
        .prepare(
          `INSERT OR IGNORE INTO outbound_send_queue (
             id, campaign_id, prospect_id, step_number, scheduled_at, status, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        )
        .bind(queueId, campaignId, row.prospect_id, nextStep, scheduledAt, queueStatus),
      db
        .prepare(
          `UPDATE outbound_prospects
           SET next_send_at = ?,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?
             AND status NOT IN ('replied', 'bounced', 'unsubscribed', 'do_not_contact', 'paused')`,
        )
        .bind(scheduledAt, row.prospect_id),
    );

    scheduledItems.push({
      queueId,
      prospectId: row.prospect_id,
      email: row.email,
      companyName: row.account_name || row.company_name,
      contactType: row.contact_type || row.email_type || "unknown",
      messageVariant: row.message_variant || "routing_v1",
      nextStep,
      scheduledAt,
      localDate,
      localTime,
      status: queueStatus,
    });
  });

  await db.batch(statements);

  return {
    ok: true,
    campaignId,
    nextStep,
    scheduled: scheduledItems.length,
    status: queueStatus,
    includeInternal,
    localDate,
    times,
    blockSize,
    items: scheduledItems,
  };
}

function normalizeMessageId(messageId) {
  return normalize(messageId).replace(/^<|>$/g, "");
}

async function getSentMessageMap(db, campaignId) {
  const result = await db
    .prepare(
      `SELECT
        q.id AS queue_id,
        q.campaign_id,
        q.prospect_id,
        q.brevo_message_id,
        p.email,
        p.company_name,
        p.campaign_segment,
        p.industry,
        p.company_type
       FROM outbound_send_queue q
       JOIN outbound_prospects p ON p.id = q.prospect_id
       WHERE q.campaign_id = ?
         AND q.brevo_message_id IS NOT NULL
         AND q.brevo_message_id != ''`,
    )
    .bind(campaignId)
    .all();

  const map = new Map();
  for (const row of result.results || []) {
    map.set(normalizeMessageId(row.brevo_message_id), row);
  }
  return map;
}

function incrementCounter(target, key, amount = 1) {
  target[key] = (target[key] || 0) + amount;
}

function canonicalBrevoEventName(eventName) {
  const value = normalize(eventName).toLowerCase().replace(/[\s-]+/g, "_");
  const aliases = {
    softbounce: "soft_bounce",
    soft_bounce: "soft_bounce",
    softbounces: "soft_bounce",
    soft_bounces: "soft_bounce",
    hardbounce: "hard_bounce",
    hard_bounce: "hard_bounce",
    hardbounces: "hard_bounce",
    hard_bounces: "hard_bounce",
    bounce: "bounced",
    bounced: "bounced",
    opened: "opened",
    unique_opened: "opened",
    unique_clicked: "clicked",
    clicks: "clicked",
    click: "clicked",
    delivered: "delivered",
    requests: "requested",
    request: "requested",
    complaint: "complaint",
  };

  return aliases[value] || value || "unknown";
}

function brevoOutcomeForEvent(eventName) {
  const normalized = canonicalBrevoEventName(eventName);
  if (["bounced", "hard_bounce", "soft_bounce", "blocked", "invalid"].includes(normalized)) {
    return "bounced";
  }
  if (normalized === "unsubscribed") {
    return "unsubscribed";
  }
  if (["spam", "complaint"].includes(normalized)) {
    return "do_not_contact";
  }
  return "";
}

function buildBrevoEventRecordId(messageId, eventName, eventAt) {
  return `brevo:${normalizeMessageId(messageId)}:${canonicalBrevoEventName(eventName)}:${normalize(eventAt)}`;
}

async function applyBrevoOutcomeToProspect(db, sent, outcome, eventName, eventAt, payloadText) {
  const nextStatus =
    outcome === "do_not_contact"
      ? "do_not_contact"
      : outcome === "unsubscribed"
        ? "unsubscribed"
        : "bounced";
  const bouncedAt = nextStatus === "bounced" ? eventAt : null;
  const unsubscribedAt = nextStatus === "unsubscribed" ? eventAt : null;
  const doNotContactReason = nextStatus === "do_not_contact" ? `brevo_${eventName}` : null;

  await db.batch([
    db
      .prepare(
        `UPDATE outbound_prospects
         SET status = CASE
               WHEN status IN ('replied', 'do_not_contact') THEN status
               ELSE ?
             END,
             bounced_at = COALESCE(?, bounced_at),
             unsubscribed_at = COALESCE(?, unsubscribed_at),
             do_not_contact_reason = COALESCE(?, do_not_contact_reason),
             notes = COALESCE(notes, '') || CASE
               WHEN COALESCE(notes, '') = '' THEN ?
               ELSE ' | ' || ?
             END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(
        nextStatus,
        bouncedAt,
        unsubscribedAt,
        doNotContactReason,
        `brevo_event:${eventName}`,
        `brevo_event:${eventName}`,
        sent.prospect_id,
      ),
    db
      .prepare(
        `UPDATE outbound_send_queue
         SET status = 'cancelled',
             error_message = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE prospect_id = ?
           AND status IN ('pending', 'held')`,
      )
      .bind(`cancelled_after_brevo_${eventName}`, sent.prospect_id),
    db
      .prepare(
        `INSERT OR IGNORE INTO outbound_email_events (
           id, campaign_id, prospect_id, queue_id, email, event_type, event_at, payload
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        `brevo-outcome:${sent.prospect_id}:${eventName}:${eventAt}`,
        sent.campaign_id || OUTBOUND_CAMPAIGN_ID,
        sent.prospect_id,
        sent.queue_id,
        sent.email,
        outcome,
        eventAt,
        payloadText,
      ),
  ]);
}

async function syncBrevoOutboundEvents(env, options = {}) {
  const db = requireOutboundDb(env);
  const campaignId = normalize(options.campaignId) || OUTBOUND_CAMPAIGN_ID;
  const days = Math.max(1, Math.min(Number(options.days) || 7, 90));
  const limit = Math.max(1, Math.min(Number(options.limit) || 1000, 5000));
  const messageMap = await getSentMessageMap(db, campaignId);

  if (messageMap.size === 0) {
    return {
      ok: true,
      campaignId,
      days,
      limit,
      sentMessagesInD1: 0,
      fetchedEvents: 0,
      matchedEvents: 0,
      insertedEvents: 0,
      statusUpdates: 0,
      byEvent: {},
      byOutcome: {},
    };
  }

  const query = new URLSearchParams({
    days: String(days),
    limit: String(limit),
    offset: "0",
    sort: "desc",
  });
  const report = await brevoFetch(env, `/smtp/statistics/events?${query.toString()}`);
  const rawEvents = report?.events || [];
  const byEvent = {};
  const byOutcome = {};
  let matchedEvents = 0;
  let insertedEvents = 0;
  let statusUpdates = 0;

  for (const event of rawEvents) {
    const messageId = normalizeMessageId(event.messageId);
    const sent = messageMap.get(messageId);
    if (!sent) {
      continue;
    }

    matchedEvents += 1;
    const rawEventName = event.event || "unknown";
    const eventName = canonicalBrevoEventName(rawEventName);
    const eventAt = normalize(event.date) || new Date().toISOString();
    const payloadText = JSON.stringify({
      source: "brevo_stats",
      rawEvent: rawEventName,
      reason: event.reason || "",
      date: eventAt,
      link: event.link || event.url || "",
      messageId: event.messageId || "",
    });
    const eventId = buildBrevoEventRecordId(event.messageId || "", rawEventName, eventAt);

    const insertResult = await db
      .prepare(
        `INSERT OR IGNORE INTO outbound_email_events (
           id, campaign_id, prospect_id, queue_id, email, event_type, event_at, payload
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        eventId,
        campaignId,
        sent.prospect_id,
        sent.queue_id,
        sent.email,
        eventName,
        eventAt,
        payloadText,
      )
      .run();

    const inserted = Number(insertResult.meta?.changes || 0) > 0;
    if (!inserted) {
      continue;
    }

    insertedEvents += 1;
    incrementCounter(byEvent, eventName);

    const outcome = brevoOutcomeForEvent(eventName);
    if (outcome) {
      await applyBrevoOutcomeToProspect(db, sent, outcome, eventName, eventAt, payloadText);
      statusUpdates += 1;
      incrementCounter(byOutcome, outcome);
    }
  }

  return {
    ok: true,
    campaignId,
    days,
    limit,
    sentMessagesInD1: messageMap.size,
    fetchedEvents: rawEvents.length,
    matchedEvents,
    insertedEvents,
    statusUpdates,
    byEvent,
    byOutcome,
  };
}

async function safeSyncBrevoOutboundEvents(env, options = {}) {
  try {
    return await syncBrevoOutboundEvents(env, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    logError("brevo_event_sync_failed", {
      campaignId: options.campaignId || OUTBOUND_CAMPAIGN_ID,
      message,
    });
    return { ok: false, message };
  }
}

async function getBrevoOutboundStats(env, url) {
  const db = requireOutboundDb(env);
  const campaignId = url.searchParams.get("campaignId") || OUTBOUND_CAMPAIGN_ID;
  const days = Math.max(1, Math.min(Number(url.searchParams.get("days")) || 1, 90));
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit")) || 1000, 5000));
  const includeRaw = url.searchParams.get("raw") === "1";
  const messageMap = await getSentMessageMap(db, campaignId);

  if (messageMap.size === 0) {
    return {
      ok: true,
      campaignId,
      days,
      sentMessagesInD1: 0,
      matchedEvents: 0,
      byEvent: {},
      bySegment: {},
      events: [],
    };
  }

  const query = new URLSearchParams({
    days: String(days),
    limit: String(limit),
    offset: "0",
    sort: "desc",
  });
  const report = await brevoFetch(env, `/smtp/statistics/events?${query.toString()}`);
  const rawEvents = report?.events || [];
  const matchedEvents = [];
  const byEvent = {};
  const bySegment = {};
  const byEmail = {};

  for (const event of rawEvents) {
    const messageId = normalizeMessageId(event.messageId);
    const sent = messageMap.get(messageId);
    if (!sent) {
      continue;
    }

    const eventName = event.event || "unknown";
    incrementCounter(byEvent, eventName);

    const segment = sent.campaign_segment || "unknown";
    bySegment[segment] ||= {};
    incrementCounter(bySegment[segment], eventName);

    byEmail[sent.email] ||= {
      email: sent.email,
      company_name: sent.company_name,
      campaign_segment: segment,
      events: {},
    };
    incrementCounter(byEmail[sent.email].events, eventName);

    matchedEvents.push({
      date: event.date,
      event: eventName,
      email: sent.email,
      company_name: sent.company_name,
      campaign_segment: segment,
      messageId: event.messageId,
      reason: event.reason || "",
      link: event.link || event.url || "",
    });
  }

  return {
    ok: true,
    campaignId,
    days,
    fetchedEvents: rawEvents.length,
    sentMessagesInD1: messageMap.size,
    matchedEvents: matchedEvents.length,
    byEvent,
    bySegment,
    byEmail: Object.values(byEmail),
    events: includeRaw ? matchedEvents : matchedEvents.slice(0, 50),
    note:
      "Brevo events can lag by a few minutes. Opens depend on tracking/proxy behavior and are weaker than clicks/replies.",
  };
}

async function selectDueQueueItems(db, nowIso, limit) {
  const result = await db
    .prepare(
      `SELECT
        q.id AS queue_id,
        q.campaign_id,
        q.prospect_id,
        q.step_number,
        q.scheduled_at,
        q.attempts,
        p.company_name,
        p.website,
        p.domain,
        p.email,
        p.email_type,
        p.contact_type,
        p.message_variant,
        p.primary_goal,
        p.contact_name,
        p.industry,
        p.status AS prospect_status,
        s.subject,
        s.text_content,
        s.html_content,
        c.timezone,
        c.send_days,
        c.send_window_start,
        c.send_window_end,
        c.status AS campaign_status
       FROM outbound_send_queue q
       JOIN outbound_prospects p ON p.id = q.prospect_id
       JOIN outbound_campaign_steps s
         ON s.campaign_id = q.campaign_id
        AND s.message_variant = COALESCE(p.message_variant, 'routing_v1')
        AND s.step_number = q.step_number
       JOIN outbound_campaigns c ON c.id = q.campaign_id
       WHERE q.status = 'pending'
         AND q.scheduled_at <= ?
         AND s.active = 1
         AND c.status = 'active'
         AND p.status NOT IN ('replied', 'bounced', 'unsubscribed', 'do_not_contact', 'paused')
         AND (q.step_number > 1 OR p.verification_status = 'valid_send')
       ORDER BY q.scheduled_at ASC, p.icp_score DESC
       LIMIT ?`,
    )
    .bind(nowIso, limit)
    .all();

  return result.results || [];
}

async function lockQueueItem(db, queueId, nowIso) {
  const result = await db
    .prepare(
      `UPDATE outbound_send_queue
       SET status = 'processing',
           locked_at = ?,
           attempts = attempts + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND status = 'pending'`,
    )
    .bind(nowIso, queueId)
    .run();

  return Number(result.meta?.changes || 0) > 0;
}

async function markQueueSent(db, item, nowIso, brevoMessageId) {
  const nextStatus = `sent_step_${item.step_number}`;
  await db.batch([
    db
      .prepare(
        `UPDATE outbound_send_queue
         SET status = 'sent',
             sent_at = ?,
             brevo_message_id = ?,
             error_message = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(nowIso, brevoMessageId || "", item.queue_id),
    db
      .prepare(
        `UPDATE outbound_prospects
         SET status = ?,
             sequence_step = ?,
             last_sent_at = ?,
             next_send_at = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(nextStatus, item.step_number, nowIso, item.prospect_id),
    db
      .prepare(
        `INSERT INTO outbound_email_events (
           id, campaign_id, prospect_id, queue_id, email, event_type, event_at, payload
         ) VALUES (?, ?, ?, ?, ?, 'sent', ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        item.campaign_id,
        item.prospect_id,
        item.queue_id,
        item.email,
        nowIso,
        JSON.stringify({ brevoMessageId }),
      ),
  ]);
}

async function markQueueFailed(db, item, nowIso, errorMessage) {
  const finalFailure = Number(item.attempts || 0) + 1 >= 3;
  const queueStatus = finalFailure ? "failed" : "pending";
  const statements = [
    db
      .prepare(
        `UPDATE outbound_send_queue
         SET status = ?,
             failed_at = ?,
             error_message = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(queueStatus, nowIso, errorMessage, item.queue_id),
    db
      .prepare(
        `INSERT INTO outbound_email_events (
           id, campaign_id, prospect_id, queue_id, email, event_type, event_at, payload
         ) VALUES (?, ?, ?, ?, ?, 'failed', ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        item.campaign_id,
        item.prospect_id,
        item.queue_id,
        item.email,
        nowIso,
        JSON.stringify({ errorMessage }),
      ),
  ];

  if (finalFailure) {
    statements.push(
      db
        .prepare(
          `UPDATE outbound_prospects
           SET status = 'failed',
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
        )
        .bind(item.prospect_id),
    );
  }

  await db.batch(statements);
}

function normalizeOutboundOutcome(outcome) {
  const value = normalize(outcome).toLowerCase();
  const allowed = new Set([
    "positive_reply",
    "interested",
    "meeting",
    "wrong_person",
    "not_interested",
    "replied",
    "bounced",
    "unsubscribed",
    "do_not_contact",
    "paused",
  ]);

  if (!allowed.has(value)) {
    throw httpError("Resultado manual no valido.", 400);
  }

  return value;
}

function prospectStatusForOutcome(outcome) {
  if (["positive_reply", "interested", "meeting", "wrong_person", "not_interested", "replied"].includes(outcome)) {
    return "replied";
  }
  if (outcome === "do_not_contact") {
    return "do_not_contact";
  }
  if (outcome === "unsubscribed") {
    return "unsubscribed";
  }
  if (outcome === "bounced") {
    return "bounced";
  }
  if (outcome === "paused") {
    return "paused";
  }
  return "replied";
}

async function markOutboundResponse(env, payload) {
  const db = requireOutboundDb(env);
  const email = normalize(payload?.email).toLowerCase();
  const prospectId = normalize(payload?.prospectId);
  const outcome = normalizeOutboundOutcome(payload?.outcome || "replied");
  const note = normalize(payload?.note);
  const nowIso = new Date().toISOString();

  if (!email && !prospectId) {
    throw httpError("Falta email o prospectId.", 400);
  }

  const prospect = prospectId
    ? await db.prepare(`SELECT * FROM outbound_prospects WHERE id = ?`).bind(prospectId).first()
    : await db.prepare(`SELECT * FROM outbound_prospects WHERE email = ?`).bind(email).first();

  if (!prospect) {
    throw httpError("Prospecto no encontrado.", 404);
  }

  const nextStatus = prospectStatusForOutcome(outcome);
  const updates = {
    replied_at: nextStatus === "replied" ? nowIso : prospect.replied_at,
    bounced_at: nextStatus === "bounced" ? nowIso : prospect.bounced_at,
    unsubscribed_at: nextStatus === "unsubscribed" ? nowIso : prospect.unsubscribed_at,
    do_not_contact_reason:
      nextStatus === "do_not_contact" ? note || outcome : prospect.do_not_contact_reason,
  };

  await db.batch([
    db
      .prepare(
        `UPDATE outbound_prospects
         SET status = ?,
             replied_at = COALESCE(?, replied_at),
             bounced_at = COALESCE(?, bounced_at),
             unsubscribed_at = COALESCE(?, unsubscribed_at),
             do_not_contact_reason = COALESCE(?, do_not_contact_reason),
             notes = CASE
               WHEN ? != '' THEN COALESCE(notes, '') || ' | manual_outcome: ' || ?
               ELSE notes
             END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(
        nextStatus,
        updates.replied_at || null,
        updates.bounced_at || null,
        updates.unsubscribed_at || null,
        updates.do_not_contact_reason || null,
        note,
        `${outcome}${note ? ` - ${note}` : ""}`,
        prospect.id,
      ),
    db
      .prepare(
        `UPDATE outbound_send_queue
         SET status = 'cancelled',
             error_message = 'cancelled_after_manual_outcome',
             updated_at = CURRENT_TIMESTAMP
         WHERE prospect_id = ? AND status IN ('pending', 'held')`,
      )
      .bind(prospect.id),
    db
      .prepare(
        `INSERT INTO outbound_email_events (
           id, campaign_id, prospect_id, email, event_type, event_at, payload
         ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        prospect.sequence_id || OUTBOUND_CAMPAIGN_ID,
        prospect.id,
        prospect.email,
        outcome,
        nowIso,
        JSON.stringify({ source: "manual", note }),
      ),
  ]);

  return {
    ok: true,
    prospectId: prospect.id,
    email: prospect.email,
    outcome,
    status: nextStatus,
  };
}

async function sendOutboundEmail(env, item) {
  const name = item.contact_name || item.company_name || item.email;
  const isAccountingCampaign = item.campaign_id === "ia_estudios_contables_ar_v1";
  const subject = personalizeOutboundContent(item.subject, item);
  const baseText = personalizeOutboundContent(item.text_content, item);
  const textContent = appendOutboundFooter(baseText, env, item.prospect_id);
  const htmlContent = item.html_content
    ? buildOutboundHtmlContent(personalizeOutboundContent(item.html_content, item), env, item.prospect_id)
    : buildOutboundHtmlContent(baseText, env, item.prospect_id);
  const unsubscribeUrl = buildUnsubscribeUrl(env, item.prospect_id);

  await upsertContact(env, {
    email: item.email,
    firstName: name,
    listName: isAccountingCampaign
      ? "Outbound - IA Estudios Contables AR V1"
      : "Outbound - Dashboard Comercial Test V1",
    attributes: {
      COMPANY_NAME: item.company_name || "",
      LAST_SOURCE: "outbound",
      LAST_INTENT: item.campaign_id,
      LAST_SERVICE: isAccountingCampaign ? "IA aplicada a procesos contables" : "Dashboard comercial",
      LAST_SUBMITTED_AT: new Date().toISOString(),
    },
  });

  return sendEmail(env, {
    to: [{ email: item.email, name }],
    subject,
    htmlContent,
    textContent,
    tags: [item.campaign_id, item.campaign_segment || "unknown"],
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "X-Campaign-Id": item.campaign_id,
      "X-Prospect-Id": item.prospect_id,
    },
  });
}

async function processOutboundQueue(env, options = {}) {
  const db = requireOutboundDb(env);
  const now = options.now || new Date();
  const nowIso = toIso(now);
  const limit = Math.max(1, Math.min(Number(options.limit) || OUTBOUND_DEFAULT_BATCH_LIMIT, 50));
  const dueItems = await selectDueQueueItems(db, nowIso, limit);
  const result = {
    checkedAt: nowIso,
    due: dueItems.length,
    sent: 0,
    failed: 0,
    skippedOutsideWindow: 0,
    skippedLocked: 0,
    failures: [],
  };

  for (const item of dueItems) {
    if (!options.force && !isWithinSendWindow(item, now)) {
      result.skippedOutsideWindow += 1;
      continue;
    }

    const locked = await lockQueueItem(db, item.queue_id, nowIso);
    if (!locked) {
      result.skippedLocked += 1;
      continue;
    }

    try {
      const brevoResult = await sendOutboundEmail(env, item);
      await markQueueSent(db, item, nowIso, brevoResult?.messageId || "");
      result.sent += 1;
      logInfo("outbound_email_sent", {
        campaignId: item.campaign_id,
        queueId: item.queue_id,
        prospectId: item.prospect_id,
        email: item.email,
        step: item.step_number,
        brevoMessageId: brevoResult?.messageId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      await markQueueFailed(db, item, nowIso, message);
      result.failed += 1;
      result.failures.push({ queueId: item.queue_id, email: item.email, message });
      logError("outbound_email_failed", {
        campaignId: item.campaign_id,
        queueId: item.queue_id,
        prospectId: item.prospect_id,
        email: item.email,
        message,
      });
    }
  }

  return result;
}

async function handleUnsubscribe(url, env) {
  const db = requireOutboundDb(env);
  const prospectId = normalize(url.searchParams.get("pid"));
  if (!prospectId) {
    return { status: 400, message: "Falta identificar el contacto." };
  }

  const nowIso = new Date().toISOString();
  const prospect = await db
    .prepare(`SELECT id, email, sequence_id FROM outbound_prospects WHERE id = ?`)
    .bind(prospectId)
    .first();

  if (!prospect) {
    return { status: 404, message: "Contacto no encontrado." };
  }

  if (url.searchParams.get("confirm") !== "1") {
    const confirmUrl = new URL(url.toString());
    confirmUrl.searchParams.set("confirm", "1");

    return {
      status: 200,
      contentType: "text/html; charset=utf-8",
      message: [
        "<!doctype html>",
        '<html lang="es">',
        "<head>",
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        "<title>Confirmar baja</title>",
        "</head>",
        '<body style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 560px; margin: 48px auto; padding: 0 20px; color: #1f2933;">',
        "<h1>Confirmar baja</h1>",
        "<p>Si no queres recibir mas mensajes de esta secuencia, confirma la baja.</p>",
        `<p><a href="${escapeHtml(confirmUrl.toString())}" style="display: inline-block; background: #1f2933; color: #fff; padding: 10px 14px; border-radius: 6px; text-decoration: none;">Confirmar baja</a></p>`,
        "</body>",
        "</html>",
      ].join(""),
    };
  }

  await db.batch([
    db
      .prepare(
        `UPDATE outbound_prospects
         SET status = 'unsubscribed',
             unsubscribed_at = ?,
             do_not_contact_reason = 'unsubscribe_link',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(nowIso, prospectId),
    db
      .prepare(
        `UPDATE outbound_send_queue
         SET status = 'cancelled',
             updated_at = CURRENT_TIMESTAMP
         WHERE prospect_id = ? AND status = 'pending'`,
      )
      .bind(prospectId),
    db
      .prepare(
        `INSERT INTO outbound_email_events (
           id, campaign_id, prospect_id, email, event_type, event_at, payload
         ) VALUES (?, ?, ?, ?, 'unsubscribed', ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        prospect.sequence_id || OUTBOUND_CAMPAIGN_ID,
        prospectId,
        prospect.email,
        nowIso,
        JSON.stringify({ source: "unsubscribe_link" }),
      ),
  ]);

  return {
    status: 200,
    message: "Listo. No vamos a enviarte mas mensajes de esta secuencia.",
  };
}

async function getCampaignsForSummary(db) {
  const result = await db
    .prepare(`SELECT * FROM outbound_campaigns WHERE status = 'active'`)
    .all();
  return result.results || [];
}

async function buildDailySummary(db, campaign, now) {
  const local = getLocalParts(now, campaign.timezone || OUTBOUND_DEFAULT_TIMEZONE);
  const bounds = getBuenosAiresDayBoundsUtc(local.date);
  const [queue, prospects, segments, sentToday] = await Promise.all([
    db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM outbound_send_queue
         WHERE campaign_id = ?
           AND scheduled_at >= ?
           AND scheduled_at < ?
         GROUP BY status`,
      )
      .bind(campaign.id, bounds.start, bounds.end)
      .all(),
    db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM outbound_prospects
         WHERE sequence_id = ?
         GROUP BY status`,
      )
      .bind(campaign.id)
      .all(),
    db
      .prepare(
        `SELECT p.campaign_segment AS segment, COUNT(*) AS count
         FROM outbound_send_queue q
         JOIN outbound_prospects p ON p.id = q.prospect_id
         WHERE q.campaign_id = ?
           AND q.scheduled_at >= ?
           AND q.scheduled_at < ?
         GROUP BY p.campaign_segment
         ORDER BY count DESC`,
      )
      .bind(campaign.id, bounds.start, bounds.end)
      .all(),
    db
      .prepare(
        `SELECT COUNT(*) AS count
         FROM outbound_send_queue
         WHERE campaign_id = ?
           AND sent_at >= ?
           AND sent_at < ?`,
      )
      .bind(campaign.id, bounds.start, bounds.end)
      .first(),
  ]);

  return {
    date: local.date,
    campaignId: campaign.id,
    queue: queue.results || [],
    prospects: prospects.results || [],
    segments: segments.results || [],
    sentCount: Number(sentToday?.count || 0),
  };
}

async function buildWeeklySummary(db, campaign, now) {
  const local = getLocalParts(now, campaign.timezone || OUTBOUND_DEFAULT_TIMEZONE);
  const bounds = getBuenosAiresWeekBoundsUtc(local.date);
  const [sentByStep, eventsByType, sentBySegment, sentByContactType, openAccountFollowups] =
    await Promise.all([
      db
        .prepare(
          `SELECT 'sent_step_' || q.step_number AS step_label, COUNT(*) AS count
           FROM outbound_send_queue q
           WHERE q.campaign_id = ?
             AND q.sent_at >= ?
             AND q.sent_at < ?
           GROUP BY q.step_number
           ORDER BY q.step_number`,
        )
        .bind(campaign.id, bounds.start, bounds.end)
        .all(),
      db
        .prepare(
          `SELECT event_type, COUNT(*) AS count
           FROM outbound_email_events
           WHERE campaign_id = ?
             AND event_at >= ?
             AND event_at < ?
           GROUP BY event_type
           ORDER BY count DESC, event_type ASC`,
        )
        .bind(campaign.id, bounds.start, bounds.end)
        .all(),
      db
        .prepare(
          `SELECT COALESCE(p.campaign_segment, 'unknown') AS segment, COUNT(*) AS count
           FROM outbound_send_queue q
           JOIN outbound_prospects p ON p.id = q.prospect_id
           WHERE q.campaign_id = ?
             AND q.sent_at >= ?
             AND q.sent_at < ?
           GROUP BY COALESCE(p.campaign_segment, 'unknown')
           ORDER BY count DESC, segment ASC`,
        )
        .bind(campaign.id, bounds.start, bounds.end)
        .all(),
      db
        .prepare(
          `SELECT COALESCE(p.contact_type, p.email_type, 'unknown') AS contact_type, COUNT(*) AS count
           FROM outbound_send_queue q
           JOIN outbound_prospects p ON p.id = q.prospect_id
           WHERE q.campaign_id = ?
             AND q.sent_at >= ?
             AND q.sent_at < ?
           GROUP BY COALESCE(p.contact_type, p.email_type, 'unknown')
           ORDER BY count DESC, contact_type ASC`,
        )
        .bind(campaign.id, bounds.start, bounds.end)
        .all(),
      db
        .prepare(
          `SELECT
             f.account_id,
             COALESCE(a.company_name, f.account_id) AS company_name,
             f.current_contact_email,
             f.followup_kind,
             f.next_action,
             f.fallback_action,
             f.review_after,
             f.status
           FROM outbound_account_followups f
           LEFT JOIN outbound_accounts a ON a.account_id = f.account_id
           WHERE (f.campaign_id = ? OR f.campaign_id IS NULL)
             AND f.status = 'open'
           ORDER BY COALESCE(f.review_after, '9999-12-31') ASC, company_name ASC
           LIMIT 25`,
        )
        .bind(campaign.id)
        .all(),
    ]);

  return {
    weekStartDate: bounds.weekStartDate,
    weekEndDate: bounds.weekEndDate,
    campaignId: campaign.id,
    sentByStep: sentByStep.results || [],
    eventsByType: eventsByType.results || [],
    sentBySegment: sentBySegment.results || [],
    sentByContactType: sentByContactType.results || [],
    openAccountFollowups: openAccountFollowups.results || [],
  };
}

function formatCountLines(items, labelKey = "status") {
  if (!items.length) {
    return "- sin datos";
  }

  return items.map((item) => `- ${item[labelKey] || "unknown"}: ${item.count}`).join("\n");
}

function formatAccountFollowupLines(items) {
  if (!items.length) {
    return "- sin pendientes";
  }

  return items
    .map(
      (item) =>
        `- ${item.company_name} | ${item.current_contact_email || "sin_email"} | revisar ${item.review_after || "sin_fecha"} | ${item.next_action || "sin_accion"}`,
    )
    .join("\n");
}

function sumCounts(items) {
  return items.reduce((total, item) => total + Number(item?.count || 0), 0);
}

async function maybeSendDailySummary(env, now) {
  const db = requireOutboundDb(env);
  const campaigns = await getCampaignsForSummary(db);
  const sent = [];

  for (const campaign of campaigns) {
    if (!shouldSendSummary(campaign, now)) {
      continue;
    }

    const summary = await buildDailySummary(db, campaign, now);
    const summaryId = `${campaign.id}:${summary.date}`;
    const existing = await db
      .prepare(`SELECT id FROM outbound_daily_summaries WHERE id = ?`)
      .bind(summaryId)
      .first();

    if (existing) {
      continue;
    }

    if (summary.sentCount <= 0) {
      continue;
    }

    const body = [
      `Resumen outbound - ${campaign.name}`,
      `Fecha: ${summary.date}`,
      "",
      "Cola de hoy:",
      formatCountLines(summary.queue),
      "",
      "Prospectos:",
      formatCountLines(summary.prospects),
      "",
      "Segmentos de hoy:",
      formatCountLines(summary.segments, "segment"),
    ].join("\n");

    await db
      .prepare(
        `INSERT INTO outbound_daily_summaries (id, campaign_id, summary_date, payload)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(summaryId, campaign.id, summary.date, JSON.stringify(summary))
      .run();

    await sendEmail(env, {
      to: [getInternalRecipient(env)],
      subject: `Resumen outbound ${summary.date}`,
      textContent: body,
      htmlContent: textToHtml(body),
    });

    await db
      .prepare(
        `UPDATE outbound_daily_summaries
         SET sent_at = ?
         WHERE id = ?`,
      )
      .bind(new Date().toISOString(), summaryId)
      .run();

    sent.push(summaryId);
  }

  return sent;
}

async function maybeSendWeeklySummary(env, now) {
  const db = requireOutboundDb(env);
  const campaigns = await getCampaignsForSummary(db);
  const sent = [];

  for (const campaign of campaigns) {
    if (!shouldSendWeeklySummary(campaign, now)) {
      continue;
    }

    const summary = await buildWeeklySummary(db, campaign, now);
    const summaryId = `${campaign.id}:${summary.weekStartDate}`;
    const existing = await db
      .prepare(`SELECT id FROM outbound_weekly_summaries WHERE id = ?`)
      .bind(summaryId)
      .first();

    if (existing) {
      continue;
    }

    if (sumCounts(summary.sentByStep) <= 0) {
      continue;
    }

    const body = [
      `Resumen semanal outbound - ${campaign.name}`,
      `Semana: ${summary.weekStartDate} a ${summary.weekEndDate}`,
      "",
      "Envios de la semana:",
      formatCountLines(summary.sentByStep, "step_label"),
      "",
      "Eventos / respuestas:",
      formatCountLines(summary.eventsByType),
      "",
      "Segmentos con envios:",
      formatCountLines(summary.sentBySegment, "segment"),
      "",
      "Contact types con envios:",
      formatCountLines(summary.sentByContactType, "contact_type"),
      "",
      "Cuentas a reroute / seguimiento:",
      formatAccountFollowupLines(summary.openAccountFollowups),
    ].join("\n");

    await db
      .prepare(
        `INSERT INTO outbound_weekly_summaries (
           id, campaign_id, week_start_date, week_end_date, payload
         ) VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(
        summaryId,
        campaign.id,
        summary.weekStartDate,
        summary.weekEndDate,
        JSON.stringify(summary),
      )
      .run();

    await sendEmail(env, {
      to: [getInternalRecipient(env)],
      subject: `Resumen semanal outbound ${summary.weekStartDate} - ${summary.weekEndDate}`,
      textContent: body,
      htmlContent: textToHtml(body),
    });

    await db
      .prepare(
        `UPDATE outbound_weekly_summaries
         SET sent_at = ?
         WHERE id = ?`,
      )
      .bind(new Date().toISOString(), summaryId)
      .run();

    sent.push(summaryId);
  }

  return sent;
}

async function handleOutboundScheduled(env, controller) {
  try {
    const now = new Date();
    const brevoSync = await safeSyncBrevoOutboundEvents(env, {
      campaignId: OUTBOUND_CAMPAIGN_ID,
      days: 7,
      limit: 1000,
    });
    const queueResult = await processOutboundQueue(env, {
      now,
      force: false,
      limit: OUTBOUND_DEFAULT_BATCH_LIMIT,
    });
    const summariesOnHold = areOutboundSummariesOnHold(env);
    const summaryIds = summariesOnHold ? [] : await maybeSendDailySummary(env, now);
    const weeklySummaryIds = summariesOnHold ? [] : await maybeSendWeeklySummary(env, now);
    logInfo("outbound_scheduled_completed", {
      scheduledTime: controller?.scheduledTime,
      brevoSync,
      sent: queueResult.sent,
      failed: queueResult.failed,
      summariesOnHold,
      summaryIds,
      weeklySummaryIds,
    });
  } catch (error) {
    logError("outbound_scheduled_failed", {
      message: error instanceof Error ? error.message : "unknown_error",
    });
  }
}

function buildAbsoluteResourceUrl(resourceHref) {
  return new URL(normalize(resourceHref) || "/", SITE_URL).toString();
}

async function handleLeadMagnet(payload, env) {
  const nombre = requireValue(payload?.nombre, "Necesitamos tu nombre.");
  const email = requireEmail(payload?.email);
  const empresa = normalize(payload?.empresa);
  const recursoId = requireValue(payload?.recursoId, "Falta identificar el recurso.");
  const recurso = requireValue(payload?.recurso, "Falta el nombre del recurso.");
  const recursoUrl = buildAbsoluteResourceUrl(payload?.recursoHref);
  const submittedAt = new Date().toISOString();

  logInfo("lead_magnet_received", {
    email,
    recurso,
  });

  await upsertContact(env, {
    email,
    firstName: nombre,
    listName: "Lead Magnet Requests",
    attributes: {
      COMPANY_NAME: empresa,
      LAST_RESOURCE: recurso,
      LAST_RESOURCE_URL: recursoUrl,
      LAST_SOURCE: "website",
      LAST_INTENT: "lead_magnet",
      LAST_SUBMITTED_AT: submittedAt,
    },
  });

  await sendEmail(env, {
    to: [{ email, name: nombre }],
    subject: `Tu recurso: ${recurso}`,
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #101828; line-height: 1.6; background: #f8f8f6; padding: 24px;">
          <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 32px; border: 1px solid #ece8ff;">
            <p style="margin: 0 0 12px; color: #7a5cff; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;">Recurso solicitado</p>
            <h1 style="margin: 0 0 16px; font-size: 32px; line-height: 1.1;">Hola ${escapeHtml(nombre)}, aca tenes tu recurso.</h1>
            <p style="margin: 0 0 18px; font-size: 16px; color: #475467;">
              Te comparto <strong>${escapeHtml(recurso)}</strong>. Lo mejor es revisarlo online y, si queres, descargar despues el PDF desde la misma pagina.
            </p>
            <p style="margin: 0 0 28px;">
              <a href="${escapeHtml(recursoUrl)}" style="display: inline-block; background: #7a5cff; color: #ffffff; text-decoration: none; padding: 14px 22px; border-radius: 999px; font-weight: 600;">
                Abrir recurso
              </a>
            </p>
            <p style="margin: 0 0 12px; font-size: 14px; color: #475467;">
              Si despues queres revisar tu caso con mas contexto, la siguiente salida natural es el diagnostico de 15 minutos.
            </p>
            <p style="margin: 0; font-size: 14px; color: #98a2b3;">
              Pedido desde alanlperez.com - recurso id: ${escapeHtml(recursoId)}
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `Hola ${nombre}, aca tenes tu recurso: ${recursoUrl}`,
  });

  await sendEmail(env, {
    to: [getInternalRecipient(env)],
    subject: `Nuevo lead magnet solicitado: ${recurso}`,
    replyTo: {
      email,
      name: nombre,
    },
    textContent: [
      "Nuevo pedido de recurso desde la web",
      "",
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Empresa: ${empresa || "-"}`,
      `Recurso: ${recurso}`,
      `Link: ${recursoUrl}`,
      `Fecha: ${submittedAt}`,
    ].join("\n"),
  });

  logInfo("lead_magnet_processed", {
    email,
    recurso,
  });
}

async function handleProcessEvaluation(payload, env, ctx) {
  const nombre = requireValue(payload?.nombre, "Necesitamos tu nombre.");
  const email = requireEmail(payload?.email);
  const estudio = requireValue(payload?.estudio, "Necesitamos el nombre del estudio.");
  const rol = requireValue(payload?.rol, "Necesitamos saber cuál es tu rol.");
  const proceso = requireValue(payload?.proceso, "Necesitamos saber qué proceso querés evaluar.");
  const volumen = requireValue(payload?.volumen, "Necesitamos un volumen aproximado.");
  const sistemasFormatos = requireValue(
    payload?.sistemasFormatos,
    "Necesitamos conocer las herramientas o formatos actuales.",
  );
  const cuelloBotella = requireValue(
    payload?.cuelloBotella,
    "Necesitamos una descripción breve del cuello de botella.",
  );
  const submittedAt = new Date().toISOString();
  const requestId = createRequestId();
  const evaluationRecord = {
    requestId,
    submittedAt,
    source: normalize(payload?.source) || "website_process_evaluation",
    landingPath: normalize(payload?.landingPath) || "/evaluar-proceso",
    utmSource: normalize(payload?.utmSource),
    utmMedium: normalize(payload?.utmMedium),
    utmCampaign: normalize(payload?.utmCampaign),
    nombre,
    email,
    estudio,
    rol,
    proceso,
    volumen,
    sistemasFormatos,
    cuelloBotella,
  };
  const summaryLines = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Estudio: ${estudio}`,
    `Rol: ${rol}`,
    `Proceso: ${proceso}`,
    `Volumen: ${volumen}`,
    `Sistemas y formatos: ${sistemasFormatos}`,
    `Cuello de botella: ${cuelloBotella}`,
    `Fuente: ${evaluationRecord.source}`,
    `UTM: ${optionalValue(evaluationRecord.utmSource)} / ${optionalValue(evaluationRecord.utmMedium)} / ${optionalValue(evaluationRecord.utmCampaign)}`,
    `Fecha: ${submittedAt}`,
  ];

  logInfo("process_evaluation_received", {
    requestId,
    email,
    estudio,
    proceso,
  });

  await insertProcessEvaluation(env, evaluationRecord);

  try {
    await upsertContact(env, {
      email,
      firstName: nombre,
      listName: "IA Contable - Evaluaciones",
      attributes: {
        COMPANY_NAME: estudio,
        LAST_SERVICE: "IA aplicada a procesos contables",
        LAST_SOURCE: evaluationRecord.source,
        LAST_INTENT: "process_evaluation",
        ROLE_TITLE: rol,
        CURRENT_TOOLS: sistemasFormatos,
        MAIN_CHALLENGE: cuelloBotella,
        PROCESS_INTEREST: proceso,
        MONTHLY_VOLUME: volumen,
        LAST_SUBMITTED_AT: submittedAt,
      },
    });

    await updateProcessEvaluation(env, requestId, {
      brevo_contact_synced_at: new Date().toISOString(),
      status: "contact_synced",
    });

    await sendEmail(env, {
      to: [{ email, name: nombre }],
      subject: "Recibimos la evaluación de tu proceso contable",
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #0b1220; line-height: 1.6; background: #f7f7f3; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #dde3ea;">
              <p style="margin: 0 0 12px; color: #246bfd; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">Evaluación recibida</p>
              <h1 style="margin: 0 0 16px; font-size: 30px; line-height: 1.12;">Gracias, ${escapeHtml(nombre)}.</h1>
              <p style="margin: 0 0 16px; font-size: 16px; color: #566274;">
                Ya recibimos el contexto sobre <strong>${escapeHtml(proceso)}</strong> en ${escapeHtml(estudio)}.
              </p>
              <p style="margin: 0 0 22px; font-size: 16px; color: #566274;">
                Vamos a revisarlo y responder por este medio. Si el caso encaja, coordinamos una demo privada con datos ficticios y definimos si tiene sentido un piloto.
              </p>
              <div style="padding: 16px; border-radius: 14px; background: #f2f6ff; border: 1px solid #cbd9f5;">
                <p style="margin: 0; font-size: 14px; color: #33445f;">
                  No envíes balances, extractos ni documentación de clientes por email. Las condiciones para trabajar con información real se acuerdan antes de cualquier piloto.
                </p>
              </div>
              <p style="margin: 22px 0 0; font-size: 12px; color: #8a95a5;">Referencia: ${escapeHtml(requestId)}</p>
            </div>
          </body>
        </html>
      `,
      textContent: [
        `Gracias, ${nombre}. Recibimos la evaluación de ${proceso} para ${estudio}.`,
        "",
        "Vamos a revisar el contexto y responder por este medio.",
        "No envíes documentación contable sensible por email.",
        "",
        `Referencia: ${requestId}`,
      ].join("\n"),
    });

    await updateProcessEvaluation(env, requestId, {
      lead_email_sent_at: new Date().toISOString(),
      status: "lead_emailed",
      error_message: null,
    });
  } catch (error) {
    await updateProcessEvaluation(env, requestId, {
      status: "error",
      error_message: error instanceof Error ? error.message : "unknown_error",
    });
    throw error;
  }

  const finalizeEvaluation = async () => {
    const failures = [];

    try {
      await sendEmail(env, {
        to: [getInternalRecipient(env)],
        replyTo: { email, name: nombre },
        subject: `Nueva evaluación IA contable: ${proceso}`,
        textContent: [
          "Nueva evaluación de proceso contable",
          "",
          `Request ID: ${requestId}`,
          ...summaryLines,
        ].join("\n"),
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; color: #0b1220; line-height: 1.6; background: #f7f7f3; padding: 24px;">
              <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #dde3ea;">
                <p style="margin: 0 0 12px; color: #246bfd; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">Nueva evaluación</p>
                <h1 style="margin: 0 0 18px; font-size: 28px;">${escapeHtml(proceso)}</h1>
                <p style="margin: 0; font-size: 14px; color: #566274;">${summaryLines.map((line) => escapeHtml(line)).join("<br />")}</p>
              </div>
            </body>
          </html>
        `,
      });
    } catch (error) {
      failures.push(error instanceof Error ? error.message : "internal_email_failed");
    }

    if (env.INTERNAL_NOTIFY_WEBHOOK_URL) {
      try {
        await sendInternalNotification(env, {
          requestId,
          submittedAt,
          intent: "process_evaluation",
          nombre,
          email,
          empresa: estudio,
          producto: proceso,
          rol,
          objetivo: volumen,
          fuentes: sistemasFormatos,
          destinatarios: "Equipo del estudio contable",
          plazo: "",
          desafio: cuelloBotella,
        });
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "internal_webhook_failed");
      }
    }

    await updateProcessEvaluation(env, requestId, {
      internal_notified_at: failures.length === 0 ? new Date().toISOString() : undefined,
      status: failures.length === 0 ? "finalized" : "lead_emailed",
      error_message: failures.length === 0 ? null : failures.join(" | "),
    });

    if (failures.length > 0) {
      logError("process_evaluation_follow_up_failed", {
        requestId,
        email,
        message: failures.join(" | "),
      });
    }
  };

  if (ctx?.waitUntil) {
    ctx.waitUntil(finalizeEvaluation());
  } else {
    await finalizeEvaluation();
  }

  logInfo("process_evaluation_processed", {
    requestId,
    email,
    estudio,
    proceso,
  });

  return { requestId };
}

async function handleQuoteRequest(payload, env, ctx) {
  const nombre = requireValue(payload?.nombre, "Necesitamos tu nombre.");
  const email = requireEmail(payload?.email);
  const empresa = requireValue(payload?.empresa, "Necesitamos el nombre de tu empresa.");
  const producto = requireValue(payload?.producto, "Necesitamos saber que servicio queres cotizar.");
  const rol = normalize(payload?.rol);
  const objetivo = requireValue(
    payload?.objetivo,
    "Necesitamos entender que necesitas ver para preparar la cotizacion.",
  );
  const fuentes = requiresSources(producto)
    ? requireValue(
        payload?.fuentes,
        "Necesitamos saber que fuentes o herramientas usas hoy.",
      )
    : normalize(payload?.fuentes);
  const destinatarios = normalize(payload?.destinatarios);
  const plazo = normalize(payload?.plazo);
  const desafio = normalize(payload?.desafio);
  const submittedAt = new Date().toISOString();
  const requestId = createRequestId();
  const summaryLines = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Empresa: ${empresa}`,
    `Producto o servicio: ${producto}`,
    `Rol: ${optionalValue(rol)}`,
    `Objetivo: ${optionalValue(objetivo)}`,
    `Fuentes o herramientas: ${optionalValue(fuentes)}`,
    `Quienes lo usan: ${optionalValue(destinatarios)}`,
    `Plazo: ${optionalValue(plazo)}`,
    `Desafio principal: ${optionalValue(desafio)}`,
    `Fecha: ${submittedAt}`,
  ];
  const summaryHtml = [
    `<strong>Empresa:</strong> ${escapeHtml(empresa)}`,
    `<strong>Servicio:</strong> ${escapeHtml(producto)}`,
    `<strong>Rol:</strong> ${escapeHtml(optionalValue(rol))}`,
    `<strong>Objetivo:</strong> ${escapeHtml(optionalValue(objetivo))}`,
    `<strong>Fuentes:</strong> ${escapeHtml(optionalValue(fuentes))}`,
    `<strong>Quienes lo usan:</strong> ${escapeHtml(optionalValue(destinatarios))}`,
    `<strong>Plazo:</strong> ${escapeHtml(optionalValue(plazo))}`,
    `<strong>Desafio:</strong> ${escapeHtml(optionalValue(desafio))}`,
  ].join("<br />");
  const quoteRecord = {
    requestId,
    nombre,
    email,
    empresa,
    producto,
    rol,
    objetivo,
    fuentes,
    destinatarios,
    plazo,
    desafio,
    submittedAt,
  };

  logInfo("quote_request_received", {
    requestId,
    email,
    empresa,
    producto,
  });

  await insertQuoteRequest(env, quoteRecord);
  try {
    await upsertContact(env, {
      email,
      firstName: nombre,
      listName: "Quote Requests",
      attributes: {
        COMPANY_NAME: empresa,
        LAST_SERVICE: producto,
        LAST_SOURCE: "website",
        LAST_INTENT: "quote_request",
        ROLE_TITLE: rol,
        LAST_OBJECTIVE: objetivo,
        CURRENT_TOOLS: fuentes,
        END_USERS: destinatarios,
        ESTIMATED_TIMELINE: plazo,
        MAIN_CHALLENGE: desafio,
        LAST_SUBMITTED_AT: submittedAt,
      },
    });

    await updateQuoteRequest(env, requestId, {
      brevo_contact_synced_at: new Date().toISOString(),
      status: "contact_synced",
    });

    await sendEmail(env, {
      to: [{ email, name: nombre }],
      subject: `Recibimos tu solicitud para ${producto}`,
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #101828; line-height: 1.6; background: #f8f8f6; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 32px; border: 1px solid #ece8ff;">
              <p style="margin: 0 0 12px; color: #7a5cff; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;">Solicitud recibida</p>
              <h1 style="margin: 0 0 16px; font-size: 32px; line-height: 1.1;">Gracias, ${escapeHtml(nombre)}.</h1>
              <p style="margin: 0 0 16px; font-size: 16px; color: #475467;">
                Ya recibimos tu solicitud para <strong>${escapeHtml(producto)}</strong>.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; color: #475467;">
                En las proximas 24 horas revisamos el caso y te respondemos por este medio con una primera lectura.
              </p>
              <div style="margin: 0 0 18px; padding: 16px; border-radius: 14px; background: #f6f4ff; border: 1px solid #ece8ff;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #7a5cff;">
                  Resumen recibido
                </p>
                <p style="margin: 0; font-size: 14px; color: #475467;">
                  ${summaryHtml}
                </p>
              </div>
              <p style="margin: 0; font-size: 14px; color: #98a2b3;">
                Empresa: ${escapeHtml(empresa)}
              </p>
            </div>
          </body>
        </html>
      `,
      textContent: [
        `Gracias, ${nombre}. Recibimos tu solicitud para ${producto} y respondemos en las proximas 24 horas.`,
        "",
        "Resumen recibido:",
        ...summaryLines,
      ].join("\n"),
    });

    await updateQuoteRequest(env, requestId, {
      lead_email_sent_at: new Date().toISOString(),
      status: "lead_emailed",
      error_message: null,
    });
  } catch (error) {
    await updateQuoteRequest(env, requestId, {
      status: "error",
      error_message: error instanceof Error ? error.message : "unknown_error",
    });
    throw error;
  }

  const followUpTasks = [];

  followUpTasks.push(async () => {
    await sendEmail(env, {
      to: [getInternalRecipient(env)],
      replyTo: {
        email,
        name: nombre,
      },
      subject: `Nueva solicitud de cotizacion: ${producto}`,
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #101828; line-height: 1.6; background: #f8f8f6; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 32px; border: 1px solid #ece8ff;">
              <p style="margin: 0 0 12px; color: #7a5cff; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;">Nueva cotizacion</p>
              <h1 style="margin: 0 0 16px; font-size: 32px; line-height: 1.1;">${escapeHtml(producto)}</h1>
              <p style="margin: 0 0 16px; font-size: 16px; color: #475467;">
                Llego una nueva solicitud desde la web. Podes responder directo a <strong>${escapeHtml(nombre)}</strong> en <strong>${escapeHtml(email)}</strong>.
              </p>
              <div style="margin: 0 0 18px; padding: 16px; border-radius: 14px; background: #f6f4ff; border: 1px solid #ece8ff;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #7a5cff;">
                  Resumen recibido
                </p>
                <p style="margin: 0; font-size: 14px; color: #475467;">
                  ${summaryHtml}
                </p>
              </div>
              <p style="margin: 0; font-size: 14px; color: #98a2b3;">
                Request ID: ${escapeHtml(requestId)}
              </p>
            </div>
          </body>
        </html>
      `,
      textContent: [
        `Nueva solicitud de cotizacion: ${producto}`,
        "",
        `Responder a: ${nombre} <${email}>`,
        `Request ID: ${requestId}`,
        "",
        ...summaryLines,
      ].join("\n"),
    });
    await updateQuoteRequest(env, requestId, {
      internal_notified_at: new Date().toISOString(),
    });
    logInfo("quote_request_internal_email_sent", {
      requestId,
      email,
      empresa,
      producto,
      internalEmail: getInternalRecipient(env).email,
    });
  });

  if (env.INTERNAL_NOTIFY_WEBHOOK_URL) {
    followUpTasks.push(async () => {
      await sendInternalNotification(env, quoteRecord);
      await updateQuoteRequest(env, requestId, {
        internal_notified_at: new Date().toISOString(),
      });
      logInfo("quote_request_internal_notification_sent", {
        requestId,
        email,
        empresa,
        producto,
      });
    });
  }

  const finalizeRequest = async () => {
    if (followUpTasks.length === 0) {
      await updateQuoteRequest(env, requestId, {
        status: "finalized",
        error_message: null,
      });
      return;
    }

    const results = await Promise.allSettled(
      followUpTasks.map((task) => task()),
    );
    const failures = results
      .filter((result) => result.status === "rejected")
      .map((result) =>
        result.reason instanceof Error ? result.reason.message : "unknown_error",
      );

    if (failures.length === 0) {
      await updateQuoteRequest(env, requestId, {
        status: "finalized",
        error_message: null,
      });
      return;
    }

    const errorMessage = failures.join(" | ");
    await updateQuoteRequest(env, requestId, {
      status: "lead_emailed",
      error_message: errorMessage,
    });
    logError("quote_request_follow_up_failed", {
      requestId,
      email,
      empresa,
      producto,
      message: errorMessage,
    });
  };

  if (ctx?.waitUntil) {
    ctx.waitUntil(finalizeRequest());
  } else {
    await finalizeRequest();
  }

  logInfo("quote_request_processed", {
    requestId,
    email,
    empresa,
    producto,
  });

  return { requestId };
}
