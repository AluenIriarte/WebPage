# Contact Type Strategy

## Objetivo

Usar `contact_type` como palanca de orquestación comercial, no solo como metadata. Cada tipo de email cumple una función distinta en el funnel:

- `nominal_public`: tiro directo a persona plausible dueña del problema.
- `role_based_commercial`: tiro directo al área.
- `generic_routing`: abrir puerta y conseguir derivación.
- `admin_ops`: rescate operativo cuando no hay mejor contacto.

La estrategia correcta no es mandar el mismo email a todos, sino cambiar:

- objetivo primario del envío;
- tono;
- CTA;
- criterio de éxito;
- orden de uso por cuenta.

## Mix actual

- `generic_routing`: 707
- `role_based_commercial`: 328
- `nominal_public`: 133
- `admin_ops`: 24

## Regla madre

No correr múltiples contactos de la misma cuenta en paralelo salvo excepción manual.

Orden recomendado por cuenta:

1. `nominal_public`
2. `role_based_commercial`
3. `generic_routing`
4. `admin_ops`

La prioridad cambia solo cuando no existe el tipo mejor rankeado o cuando el contacto previo:

- rebotó;
- pidió redirección;
- derivó explícitamente a otra persona/área;
- quedó sin respuesta después de cerrar su mini-secuencia.

## Lane por tipo

### 1. `nominal_public`

#### Qué es

Casilla nominal pública con evidencia razonable de rol relevante o seniority plausible.

#### Objetivo

Conseguir respuesta directa de negocio:

- interés;
- llamada;
- derivación interna precisa.

#### Cuándo usarlo

- Primero en cuentas Tier A/B.
- Primero también en Tier C si el rol parece claramente comercial, dirección o gerencia.

#### Enfoque de mensaje

No usar un email de routing.

Acá conviene un enfoque directo y corto:

- mencionar por qué la empresa entró al radar;
- conectar el problema con operación comercial visible;
- asumir que podría ser la persona correcta, sin sobreactuar;
- dejar una salida elegante para derivar si no lo ve esa persona.

#### Tono

- directo;
- profesional;
- específico;
- con personalización ligera por cuenta.

#### CTA recomendado

CTA primario:

- `¿Tiene sentido verlo con vos?`
- `¿Hoy esto lo ves vos o alguien de comercial/reporting?`

CTA secundario:

- `Si lo ve otra persona, ¿me indicás con quién conviene hablar?`

#### Secuencia sugerida

- Step 1: directo, con hipótesis de dolor comercial.
- Step 2: follow-up a 3 días hábiles con caso de uso más concreto.
- Step 3 opcional: cierre corto con salida simple.

#### Qué no hacer

- no abrir con `no sé si esta es la casilla indicada`;
- no sonar como casilla genérica;
- no meter adjunto en primer contacto.

#### Métrica de éxito correcta

No medir solo open/reply.

Medir:

- `positive_reply`
- `interested`
- `meeting`
- `wrong_person` con derivación útil

#### Subject patterns sugeridos

- `Consulta por seguimiento comercial`
- `{{company_name}} y visibilidad comercial`
- `Consulta breve sobre reporting comercial`

#### Apertura sugerida

`Los contacté porque vi una operación comercial con varias líneas/categorías y probablemente tengan seguimiento repartido entre ventas, planillas y sistemas.`

### 2. `role_based_commercial`

#### Qué es

Casillas tipo:

- `ventas@`
- `comercial@`
- `pedidos@`
- `distribuidores@`
- `atencionalcliente@` si claramente toca canal comercial

#### Objetivo

Llegar al área correcta con un mensaje que ya sea comercialmente relevante, no solo pedir routing.

#### Cuándo usarlo

- Primero si no hay `nominal_public`.
- Segundo después de un nominal sin respuesta.
- Primero en cuentas con estructura comercial visible pero sin persona identificada.

#### Enfoque de mensaje

No tratarla como casilla puramente administrativa.

La lógica es:

- asumir que cae en un inbox de equipo;
- hablarle al área, no a una persona;
- bajar un dolor comercial propio del área;
- pedir confirmación o derivación dentro del equipo.

#### Tono

- más funcional que el nominal;
- menos “personal”;
- más orientado a operación del área.

#### CTA recomendado

- `¿Esto lo ve alguien de comercial/gerencia comercial dentro del equipo?`
- `Si corresponde a otra persona del área, ¿me ayudan a derivarlo?`

#### Secuencia sugerida

- Step 1: problema concreto de visibilidad comercial.
- Step 2: mismo hilo, con ejemplo de desvíos, cartera, margen o seguimiento por vendedor.
- Step 3 opcional: cierre pidiendo solo la derivación.

#### Qué no hacer

- no usar un texto demasiado genérico tipo recepción;
- no pedir reunión de entrada como única salida;
- no mandar attachments en frío.

#### Métrica de éxito correcta

- reply útil del área;
- derivación interna;
- interés;
- reunión.

#### Subject patterns sugeridos

- `Consulta por visibilidad comercial`
- `Consulta para el área comercial`
- `Seguimiento comercial y reporting`

#### Apertura sugerida

`Les escribo porque trabajo con empresas donde comercial necesita ver con más claridad desvíos vs objetivo, cartera por vendedor, márgenes y alertas sin depender de reportes dispersos.`

### 3. `generic_routing`

#### Qué es

Casillas tipo:

- `info@`
- `contacto@`
- `hola@`
- formularios generales;
- casillas genéricas útiles de entrada.

#### Objetivo

No vender directo.

El objetivo principal es routing:

- identificar área;
- conseguir casilla/persona correcta;
- lograr forward interno.

#### Cuándo usarlo

- solo si no hay mejor contacto;
- o como fallback después de no obtener respuesta en `nominal_public`/`role_based_commercial`;
- o para penetrar cuentas muy fuertes sin ningún otro email útil.

#### Enfoque de mensaje

Acá sí aplica el template actual que ya tienen:

- corto;
- bajo-fricción;
- explícito en que puede no ser la casilla correcta;
- orientado a derivación.

#### Tono

- liviano;
- respetuoso;
- nada agresivo;
- cero attachments.

#### CTA recomendado

- `¿Me podrían señalar qué persona o área convendría verlo?`

#### Secuencia sugerida

- Step 1 actual.
- Step 2 actual a 3 días hábiles.
- no ir mucho más allá salvo cuenta muy prioritaria.

#### Métrica de éxito correcta

No medirlo como conversión directa.

Medir:

- `% de replies con derivación`
- `% de forwards`
- `% de identificación de área`
- `% de cuentas destrabadas`

#### Outcome esperado en D1

- `wrong_person` si derivan a alguien;
- `interested` solo si responde el área correcta;
- `paused` si piden volver más adelante;
- `do_not_contact` si rechazan explícitamente.

### 4. `admin_ops`

#### Qué es

Casillas de administración / operaciones que no son comerciales puras, pero pueden funcionar como puente:

- `administracion@`
- `facturacion@`
- `cobranzas@`
- `sucursal@`
- `operaciones@`

#### Objetivo

Rescate de cuenta.

No buscar venta directa, sino:

- identificar quién centraliza el seguimiento comercial;
- conseguir forwarding interno;
- confirmar si existe gerencia/área comercial.

#### Cuándo usarlo

- solo en Tier A/B;
- solo si no hay `nominal_public`, `role_based_commercial` ni `generic_routing` útil;
- o si `generic_routing` no respondió y la cuenta vale la pena.

#### Enfoque de mensaje

Posicionarlo como tema de coordinación comercial/operativa, no como pitch directo.

#### Tono

- muy respetuoso;
- práctico;
- cero presión.

#### CTA recomendado

- `¿Me podrían indicar quién centraliza este tema dentro de comercial o dirección?`
- `Si no corresponde a administración, ¿me ayudan a derivarlo internamente?`

#### Secuencia sugerida

- un Step 1 corto;
- un único follow-up;
- después cortar.

#### Qué no hacer

- no empujar reunión;
- no asumir que administración es dueña del problema;
- no convertir esta lane en envío masivo.

#### Métrica de éxito correcta

- derivación útil;
- confirmación de área;
- casilla correcta descubierta.

## Estrategia operativa por cuenta

### Escenario A

Cuenta con `nominal_public` y `role_based_commercial`

- arrancar por `nominal_public`;
- si no responde tras 2 pasos, esperar 4-5 días hábiles y pasar a `role_based_commercial`;
- no mandar `generic_routing` al mismo tiempo.

### Escenario B

Cuenta con `role_based_commercial` y `generic_routing`

- arrancar por `role_based_commercial`;
- si no responde tras 2 pasos, usar `generic_routing` con el template actual;
- medir si el routing destraba una derivación.

### Escenario C

Cuenta solo con `generic_routing`

- usar secuencia actual;
- éxito = derivación, no venta;
- si responde con persona/área, crear o actualizar contacto y pasar a lane directo.

### Escenario D

Cuenta solo con `admin_ops`

- usar solo si la cuenta es fuerte;
- objetivo explícito: derivación interna;
- secuencia máxima de 2 toques.

## Recomendación de prioridad de envío

Si hubiera que distribuir esfuerzo comercial:

1. `nominal_public` en Tier A/B
2. `role_based_commercial` en Tier A/B
3. `generic_routing` en Tier A
4. `nominal_public` en Tier C
5. `role_based_commercial` en Tier C
6. `admin_ops` solo como rescue

## Recomendación para D1

No hace falta rehacer el schema para empezar. Con lo que ya existe alcanza si se derivan estos campos:

- `contact_type`
- `message_variant`
- `primary_goal`
- `account_contact_rank`
- `lane_priority`

### Derivados sugeridos

#### `message_variant`

- `routing_v1`
- `role_commercial_v1`
- `nominal_direct_v1`
- `admin_rescue_v1`

#### `primary_goal`

- `referral`
- `direct_interest`
- `meeting`
- `area_confirmation`

#### `account_contact_rank`

- 1 para el mejor contacto de la cuenta;
- 2 para fallback;
- 3 para rescue.

#### `lane_priority`

- `nominal_public = 100`
- `role_based_commercial = 80`
- `generic_routing = 55`
- `admin_ops = 35`

## Outcomes recomendados por lane

### `nominal_public`

- `interested`
- `meeting`
- `wrong_person`
- `not_interested`

### `role_based_commercial`

- `interested`
- `wrong_person`
- `replied`
- `not_interested`

### `generic_routing`

- `wrong_person`
- `replied`
- `paused`
- `do_not_contact`

### `admin_ops`

- `wrong_person`
- `replied`
- `paused`
- `do_not_contact`

## KPI correcto por tipo

### `nominal_public`

- positive reply rate
- meeting rate
- referral útil rate

### `role_based_commercial`

- area reply rate
- referral útil rate
- meeting rate

### `generic_routing`

- referral rate
- forward/internal handoff rate
- account unlock rate

### `admin_ops`

- internal redirect rate
- account unlock rate

## Recomendación final

La base no debe tratar `generic_routing` como el default universal.

Conviene operar cuatro lanes:

- `routing`: para abrir puerta;
- `direct_area`: para llegar a comercial;
- `direct_person`: para generar conversación;
- `rescue_ops`: para destrabar cuentas buenas sin mejor entrada.

El mayor cambio de performance no va a venir de escribir un email “más lindo”, sino de alinear cada contacto con el objetivo correcto de ese inbox.
