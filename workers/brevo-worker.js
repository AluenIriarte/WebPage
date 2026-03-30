const SITE_URL = "https://alanlperez.com";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
];

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

      return json({ ok: false, message: "Ruta no encontrada." }, 404);
    } catch (error) {
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
        400,
      );
    }
  },
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: CORS_HEADERS,
  });
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
  await brevoFetch(env, "/smtp/email", {
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
