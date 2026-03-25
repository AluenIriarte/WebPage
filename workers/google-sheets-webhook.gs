const SHEET_ID = "12QJzfBFkhz49JEBReAyrclt5rnBFvyRhNecUNk8MRAI";
const SHEET_NAME = "Sheet1";
const WEBHOOK_TOKEN = "REEMPLAZAR_POR_UN_TOKEN_LARGO";
const NOTIFY_EMAIL = "contacto@alanlperez.com";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
const HEADERS = [
  "received_at",
  "kind",
  "nombre",
  "email",
  "empresa",
  "producto",
  "rol",
  "objetivo",
  "fuentes",
  "destinatarios",
  "plazo",
  "desafio",
  "submitted_at",
];

function doPost(e) {
  try {
    const token = e?.parameter?.token || "";
    if (token !== WEBHOOK_TOKEN) {
      return json({ ok: false, message: "Unauthorized" }, 401);
    }

    const payload = JSON.parse(e.postData.contents || "{}");
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    ensureHeaders(sheet);
    const receivedAt = new Date();

    sheet.appendRow([
      receivedAt,
      payload.kind || "",
      payload.nombre || "",
      payload.email || "",
      payload.empresa || "",
      payload.producto || "",
      payload.rol || "",
      payload.objetivo || "",
      payload.fuentes || "",
      payload.destinatarios || "",
      payload.plazo || "",
      payload.desafio || "",
      payload.submittedAt || "",
    ]);
    const rowNumber = sheet.getLastRow();
    const notification = notifyCrmUpdate(payload, rowNumber, receivedAt);

    return json({ ok: true, notified: notification.ok, notificationError: notification.error });
  } catch (error) {
    return json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}

function json(payload, status) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const normalized = firstRow.map((cell) => String(cell || "").trim());
  const hasHeaders = HEADERS.every((header, index) => normalized[index] === header);

  if (hasHeaders) {
    return;
  }

  const hasDataInFirstRow = normalized.some(Boolean);
  if (hasDataInFirstRow) {
    sheet.insertRows(1, 1);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function notifyCrmUpdate(payload, rowNumber, receivedAt) {
  try {
    const subject = `CRM actualizado: ${payload.empresa || payload.nombre || "Nueva cotizacion"}`;
    const body = [
      "Se registro una nueva cotizacion en el CRM.",
      "",
      `Fila: ${rowNumber}`,
      `Recibido: ${formatTimestamp(receivedAt)}`,
      `Nombre: ${payload.nombre || "-"}`,
      `Email: ${payload.email || "-"}`,
      `Empresa: ${payload.empresa || "-"}`,
      `Producto o servicio: ${payload.producto || "-"}`,
      `Rol: ${payload.rol || "-"}`,
      `Objetivo: ${payload.objetivo || "-"}`,
      `Fuentes: ${payload.fuentes || "-"}`,
      `Destinatarios: ${payload.destinatarios || "-"}`,
      `Plazo: ${payload.plazo || "-"}`,
      `Desafio: ${payload.desafio || "-"}`,
      "",
      `Abrir CRM: ${SHEET_URL}`,
    ].join("\n");

    const options = {
      name: "CRM alanlperez.com",
      replyTo: payload.email || undefined,
    };

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body, options);
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "notification_failed",
    };
  }
}

function formatTimestamp(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}
