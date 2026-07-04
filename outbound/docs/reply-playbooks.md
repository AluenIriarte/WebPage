# Reply Playbooks

## Ack Interno / Canal Incorrecto

Usar este playbook cuando la respuesta:

- confirma recepcion;
- dice que lo derivan internamente;
- aclara que la casilla no es el canal ideal;
- no expresa interes directo ni rechazo.

Ejemplo tipico:

- "Lo notificamos al sector correspondiente."
- "Esta casilla es solo de venta online."
- "Si hay interes, se pondran en contacto."

### Objetivo

- sacar esa casilla de follow-ups automaticos;
- no contestar por reflejo y generar ruido;
- abrir un segundo proceso de reroute por cuenta;
- intentar conseguir un contacto mejor antes de volver a tocar el thread.

### Accion inmediata

1. Marcar el prospecto como `replied`.
2. Cancelar cualquier `pending` o `held` futuro de esa casilla.
3. Guardar nota estructurada:
   - `reply_playbook=ack_internal_forward_wrong_channel`
   - `reply_now=no`
   - `next_action=source_better_contact`
   - `fallback_action=request_referral_after_3_5_business_days`
   - `review_after=<fecha>`
4. Guardar la cuenta en una cola de reroute / seguimiento.

Tabla recomendada:

- `outbound_account_followups`
- `followup_kind = ack_internal_forward_wrong_channel`
- `status = open`
- `review_after = +3 a +5 dias habiles`

### No responder ahora

Por defecto, no responder ese mismo thread en el momento.

La respuesta ya dijo:

- "recibido";
- "lo vemos internamente";
- "esta no es la casilla ideal".

Responder enseguida suele empujar una casilla que ya senalo que no es el lugar correcto.

### Segundo proceso por cuenta

Orden recomendado:

1. Buscar otro contacto mejor en la misma cuenta.
2. Priorizar:
   - `nominal_public`
   - `role_based_commercial`
   - despues `generic_routing`
   - `admin_ops` solo como rescate
3. Si aparece un contacto mejor, abrir thread nuevo con ese contacto.
4. Si no aparece nada mejor al `review_after`, volver al thread original con un mensaje breve:
   - agradecer;
   - pedir derivacion concreta;
   - no reexplicar toda la propuesta.

### Template de fallback

```txt
Hola, gracias por la respuesta.

Queria consultar si me podrian indicar con que persona o area conviene hablar por este tema.

Con ese dato me alcanza y no insisto por esta casilla.

Gracias,
Alan
```

### Lectura operativa

- cuenta como `reply`;
- no cuenta como `positive_reply`;
- no cuenta como `wrong_person` salvo que derive a una persona concreta;
- sale de follow-up automatico;
- entra a cola de reroute / source-better-contact.
- aparece en el resumen semanal si sigue abierta en `outbound_account_followups`.
