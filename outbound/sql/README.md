# Outbound SQL

- `generated/`: SQLs generados para cargas, releases, pruebas internas y updates ya aplicados o listos para aplicar.

El schema base del Worker/D1 queda en `workers/d1-outbound.sql`.

Si aplicas `generated/d1-outbound-contact-lanes-2026-04-23.sql`, los updates viejos que filtran solo por `campaign_id + step_number` dejan de ser seguros para copy porque `outbound_campaign_steps` pasa a tener multiples variantes por step. Desde ese punto, filtra tambien por `message_variant`.
