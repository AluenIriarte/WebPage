const SHEET_ID = "12QJzfBFkhz49JEBReAyrclt5rnBFvyRhNecUNk8MRAI";
const SHEET_NAME = "Sheet1";
const WEBHOOK_TOKEN = "REEMPLAZAR_POR_UN_TOKEN_LARGO";

function doPost(e) {
  try {
    const token = e?.parameter?.token || "";
    if (token !== WEBHOOK_TOKEN) {
      return json({ ok: false, message: "Unauthorized" }, 401);
    }

    const payload = JSON.parse(e.postData.contents || "{}");
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),
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

    return json({ ok: true });
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
