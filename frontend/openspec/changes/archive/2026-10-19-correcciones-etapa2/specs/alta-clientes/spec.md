# Spec Delta

## Purpose

Permite registrar clientes nuevos desde la vista Clientes con validación de las reglas RN-CL, mensajes en texto y actualización inmediata del listado y del selector de clientes de Ventas.

## ADDED Requirements

### Requirement: Validación del cliente
Un cliente SHALL aceptarse solo si el nombre completo y el email no están vacíos, el email tiene formato válido (expresión `^[^\s@]+@[^\s@]+\.[^\s@]+$`) y no existe otro cliente con el mismo email comparado sin espacios exteriores y sin distinguir mayúsculas.

#### Scenario: Email inválido
- **WHEN** se intenta registrar un cliente con email `abc` o `a@b`
- **THEN** el cliente no se agrega y se muestra un error en texto sobre el formato del email

#### Scenario: Email existente en mayúsculas
- **WHEN** se intenta registrar un cliente con email `  CARLA.BENITEZ@EXAMPLE.COM ` y ya existe `carla.benitez@example.com`
- **THEN** el cliente no se agrega y se muestra un error en texto que indica que el email ya está registrado

#### Scenario: Cliente válido
- **WHEN** se registra un cliente con nombre y un email nuevo con formato válido
- **THEN** el cliente se agrega con el email sin espacios y en minúsculas, se guarda y se muestra un mensaje de éxito en `#cliente-mensaje`

### Requirement: Envío controlado y mensajes en texto
El envío de `#form-cliente` SHALL controlarse sin recargar la página. Los errores SHALL mostrarse como texto en `#cliente-errores` (prefijo "Error:"), insertados como texto; cada campo con error SHALL marcarse con `aria-invalid="true"` y el foco SHALL ir al primer campo con error. Un nuevo envío SHALL reemplazar los mensajes anteriores.

#### Scenario: Error de email
- **WHEN** se envía el formulario con email `abc`
- **THEN** la página no se recarga, `#cliente-errores` muestra el error en texto, el campo email queda con `aria-invalid="true"` y recibe el foco

### Requirement: Refresco tras un alta de cliente
Tras un alta correcta, sin recargar la página, SHALL actualizarse la tabla de Clientes y el selector de clientes de Ventas, y el formulario SHALL quedar limpio, sin errores en consola. Si en Ventas ya había un cliente elegido, SHALL seguir elegido.

#### Scenario: Cliente nuevo visible
- **WHEN** se registra un cliente válido
- **THEN** aparece en la tabla de Clientes y en el selector de clientes de Ventas sin recargar, y la consola no muestra errores

#### Scenario: Nombre con HTML
- **WHEN** se registra un cliente con nombre `<b>Ana</b>`
- **THEN** el nombre se ve como texto literal en la tabla, en el selector de Ventas y en el historial

### Requirement: Fallo al guardar un cliente
Si el cliente no se puede guardar en el navegador, la aplicación SHALL avisarlo con un mensaje de texto y seguir funcionando sin errores en consola.

#### Scenario: Almacenamiento no disponible
- **WHEN** se registra un cliente válido y la escritura en `localStorage` falla
- **THEN** se muestra un mensaje de texto que indica que no se pudo guardar en el navegador y la página no se rompe
