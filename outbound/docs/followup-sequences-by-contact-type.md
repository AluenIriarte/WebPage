# Follow-Up Sequences By Contact Type

## Política general

- Mantener `plain text` en Step 1 y Step 2.
- No usar banners, imágenes inline, HTML pesado ni adjuntos en frío.
- No mandar el one-pager como PDF adjunto en follow-up frío.
- Si aparece interés, recién ahí se puede compartir el one-pager como link o adjunto liviano según contexto.

## Por qué seguir en texto plano

Para este caso conviene seguir con emails en texto puro porque:

- funcionan mejor para `routing` y `forward interno`;
- bajan fricción en inboxes compartidos;
- se perciben más como mensaje humano que como pieza de campaña;
- reducen el riesgo de quedar “promocional” por formato;
- evitan que el CTA compita con banners o assets.

Esto no significa que el texto plano sea una bala mágica de deliverability. Significa que, para este tipo de outreach, alinea mejor con el objetivo del inbox: responder o derivar.

## Delays sugeridos

- Step 2: `3 días hábiles` después del Step 1
- Step 3 opcional:
  - `5-7 días hábiles` después del Step 2
  - solo para `nominal_public` y `role_based_commercial` en cuentas fuertes
- `generic_routing` y `admin_ops`: máximo `2 toques` salvo excepción manual

## Secuencia por lane

### `generic_routing`

- Step 1:
  - archivo actual: `assets/email/Email inicial.txt`
- Step 2:
  - archivo actual: `assets/email/Email follow 1.txt`
- objetivo:
  - derivación
  - confirmación de área
  - destrabar cuenta

### `nominal_public`

- Step 1:
  - `assets/email/Email nominal_public inicial.txt`
- Step 2:
  - `assets/email/Email nominal_public follow 1.txt`
- objetivo:
  - interés directo
  - reunión
  - derivación precisa

### `role_based_commercial`

- Step 1:
  - `assets/email/Email role_based_commercial inicial.txt`
- Step 2:
  - `assets/email/Email role_based_commercial follow 1.txt`
- objetivo:
  - respuesta del área
  - derivación interna
  - interés comercial

### `admin_ops`

- Step 1:
  - `assets/email/Email admin_ops inicial.txt`
- Step 2:
  - `assets/email/Email admin_ops follow 1.txt`
- objetivo:
  - identificar área
  - conseguir forwarding interno
  - rescatar cuenta buena sin otro punto de entrada

## Reglas de orquestación

- No abrir más de un thread activo por cuenta.
- Prioridad por cuenta:
  1. `nominal_public`
  2. `role_based_commercial`
  3. `generic_routing`
  4. `admin_ops`
- Si un contacto responde con derivación:
  - pausar ese thread
  - crear/actualizar el contacto nuevo
  - reiniciar por el lane correcto
- Si un contacto responde `no soy la persona` sin derivación:
  - pasar al siguiente lane de la cuenta
- Si rebota:
  - pasar al siguiente lane disponible

## Criterio de stop

### `nominal_public`

- parar si:
  - responde
  - rebota
  - pide no contacto
  - se completan 2 pasos sin señal y existe otro lane en la cuenta

### `role_based_commercial`

- parar si:
  - responde el área
  - deriva
  - rebota
  - se completan 2 pasos sin señal y existe `generic_routing`

### `generic_routing`

- parar si:
  - deriva
  - responde sin derivar
  - rebota
  - se completan 2 pasos

### `admin_ops`

- parar si:
  - deriva
  - responde
  - rebota
  - se completan 2 pasos

## KPI correcto por lane

- `nominal_public`: reply positivo, reunión, derivación útil
- `role_based_commercial`: reply de área, derivación útil, reunión
- `generic_routing`: referral rate, area confirmation rate
- `admin_ops`: redirect rate, account unlock rate
