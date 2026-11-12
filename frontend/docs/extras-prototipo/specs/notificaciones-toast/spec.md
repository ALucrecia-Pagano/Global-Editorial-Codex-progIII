## Purpose

Muestra avisos breves de confirmación (toasts) en una zona fija de la pantalla, anunciados por lectores de pantalla sin mover el foco, como complemento —nunca reemplazo— de los mensajes en línea de los formularios.

## ADDED Requirements

### Requirement: Zona de avisos anunciada
La página SHALL tener una única zona de avisos con `role="status"` y `aria-live="polite"`, presente en el HTML desde la carga, donde aparecen los toasts. Mostrar un toast NO SHALL mover el foco.

#### Scenario: Anuncio sin mover el foco
- **WHEN** se muestra un toast mientras el foco está en el botón "Ingresar"
- **THEN** el lector de pantalla lee el texto del toast y el foco sigue en el botón

### Requirement: Toast temporal y descartable
Cada toast SHALL comunicar su resultado con texto (un título como "Listo" o "Error" más el mensaje, no solo color), desaparecer solo después de unos segundos y poder cerrarse antes con un botón "Cerrar aviso". Los toasts NO SHALL tapar controles de forma permanente a 320 px.

#### Scenario: Desaparición automática
- **WHEN** aparece un toast y no se hace nada
- **THEN** desaparece solo pasados unos segundos

#### Scenario: Cerrar con teclado
- **WHEN** el operador llega con Tab al botón "Cerrar aviso" y presiona Enter
- **THEN** el toast desaparece

### Requirement: Usos del toast en la Etapa 1
En la Etapa 1 los toasts SHALL usarse solo para confirmar un envío válido de Ingresar o Registro y para confirmar el guardado de una puntuación. Los formularios de Libros, Clientes y Ventas NO SHALL mostrar toasts; siguen usando sus mensajes en línea.

#### Scenario: Formulario de C-01
- **WHEN** el operador envía el formulario de Clientes
- **THEN** no aparece ningún toast
