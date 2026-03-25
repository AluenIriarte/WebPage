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
        await handleQuoteRequest(payload, env, ctx);
        return json({ ok: true, message: "Solicitud enviada correctamente." });
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

async function postQuoteBackupToSheet(env, payload) {
  if (!env.QUOTE_SHEET_WEBHOOK_URL) {
    return false;
  }

  const webhookUrl = new URL(env.QUOTE_SHEET_WEBHOOK_URL);
  if (env.QUOTE_SHEET_WEBHOOK_TOKEN) {
    webhookUrl.searchParams.set("token", env.QUOTE_SHEET_WEBHOOK_TOKEN);
  }

  const response = await fetch(webhookUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sheets webhook devolvio ${response.status}: ${errorText}`);
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
              Pedido desde alanlperez.com · recurso id: ${escapeHtml(recursoId)}
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `Hola ${nombre}, aca tenes tu recurso: ${recursoUrl}`,
  });

  await sendEmail(env, {
    to: [{ email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME }],
    subject: `Nuevo lead magnet solicitado: ${recurso}`,
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
  const objetivo = normalize(payload?.objetivo);
  const fuentes = normalize(payload?.fuentes);
  const destinatarios = normalize(payload?.destinatarios);
  const plazo = normalize(payload?.plazo);
  const desafio = normalize(payload?.desafio);
  const submittedAt = new Date().toISOString();
  const backupPayload = {
    kind: "quote_request",
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
    email,
    empresa,
    producto,
  });

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
            <p style="margin: 0; font-size: 14px; color: #98a2b3;">
              Empresa: ${escapeHtml(empresa)}
            </p>
          </div>
        </body>
      </html>
    `,
    textContent: `Gracias, ${nombre}. Recibimos tu solicitud para ${producto} y respondemos en las proximas 24 horas.`,
  });

  const backupTask = async () => {
    if (env.QUOTE_SHEET_WEBHOOK_URL) {
      await postQuoteBackupToSheet(env, backupPayload);
      logInfo("quote_request_backed_up_to_sheet", {
        email,
        empresa,
        producto,
      });
      return;
    }

    await sendEmail(env, {
      to: [{ email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME }],
      subject: `Nueva solicitud de cotizacion: ${producto}`,
      textContent: [
        "Nueva solicitud desde la web",
        "",
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Empresa: ${empresa}`,
        `Producto o servicio: ${producto}`,
        `Rol: ${rol || "-"}`,
        `Objetivo: ${objetivo || "-"}`,
        `Fuentes o herramientas: ${fuentes || "-"}`,
        `Quienes lo usan: ${destinatarios || "-"}`,
        `Plazo: ${plazo || "-"}`,
        `Desafio principal: ${desafio || "-"}`,
        `Fecha: ${submittedAt}`,
      ].join("\n"),
    });
    logInfo("quote_request_internal_email_sent", {
      email,
      empresa,
      producto,
    });
  };

  if (ctx?.waitUntil) {
    ctx.waitUntil(
      backupTask().catch((error) => {
        logError("quote_request_backup_failed", {
          email,
          empresa,
          producto,
          message: error instanceof Error ? error.message : "unknown_error",
        });
      }),
    );
  } else {
    try {
      await backupTask();
    } catch (error) {
      logError("quote_request_backup_failed", {
        email,
        empresa,
        producto,
        message: error instanceof Error ? error.message : "unknown_error",
      });
    }
  }

  logInfo("quote_request_processed", {
    email,
    empresa,
    producto,
  });
}
