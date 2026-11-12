## Purpose

Ofrece los formularios maquetados Ingresar y Registro con validación simulada en el navegador, errores expresados con texto y confirmación por aviso, sin login real ni persistencia de credenciales (el sistema no tiene usuarios).

## ADDED Requirements

### Requirement: Formulario Ingresar
La vista Ingresar SHALL incluir un formulario con los campos Correo electrónico (`type="email"`) y Contraseña (`type="password"`), cada uno con `label` asociado, un botón de envío "Ingresar", un enlace a la vista Registro y un aviso visible de que es una maqueta que no guarda ni envía datos.

#### Scenario: Ir a Registro
- **WHEN** el operador activa el enlace "Creá tu cuenta" del formulario Ingresar
- **THEN** se muestra la vista Registro

### Requirement: Formulario Registro
La vista Registro SHALL incluir un formulario con Nombre completo, Correo electrónico, Contraseña y Repetir contraseña, cada uno con `label` asociado, un botón "Crear cuenta", un enlace de vuelta a Ingresar y el mismo aviso de maqueta.

#### Scenario: Volver a Ingresar
- **WHEN** el operador activa el enlace "Ingresá" del formulario Registro
- **THEN** se muestra la vista Ingresar

### Requirement: Validación simulada con errores en texto
Al enviar, el formulario NO SHALL recargar la página y SHALL validar: campos obligatorios no vacíos (tras `trim`), correo con formato válido según la validación nativa del navegador para `type="email"`, contraseña de al menos 8 caracteres y, en Registro, que ambas contraseñas coincidan. Cada error SHALL mostrarse como texto junto a su campo, asociado con `aria-describedby`, marcando el campo con `aria-invalid="true"`, y el foco SHALL ir al primer campo con error.

#### Scenario: Envío vacío
- **WHEN** el operador envía Ingresar sin completar nada
- **THEN** la página no se recarga, cada campo muestra su error en texto y el foco queda en Correo electrónico

#### Scenario: Contraseñas distintas
- **WHEN** en Registro las dos contraseñas no coinciden
- **THEN** Repetir contraseña muestra "Las contraseñas deben coincidir." y el formulario no se da por válido

#### Scenario: Corregir un campo
- **WHEN** el operador escribe en un campo marcado con error
- **THEN** desaparece el error de ese campo y su `aria-invalid`

### Requirement: Envío válido sin sesión ni persistencia
Con datos válidos, el formulario SHALL mostrar un aviso de éxito que deja claro que es una demostración, SHALL vaciar los campos de contraseña y NO SHALL crear una sesión, cambiar la navegación ni guardar ningún dato ingresado.

#### Scenario: Ingreso válido
- **WHEN** el operador envía Ingresar con `ana@example.com` y una contraseña de 8 caracteres
- **THEN** aparece el aviso de éxito, la navegación queda igual y el almacenamiento del sitio no contiene esos datos
