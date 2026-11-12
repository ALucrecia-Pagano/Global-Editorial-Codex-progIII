## Purpose

Guarda en el navegador las preferencias de presentación de la Etapa 1 (tema y estado de la sidebar) con claves propias que no chocan con los datos de la Etapa 2, sin guardar datos personales y sin romper la página si el almacenamiento falla.

## ADDED Requirements

### Requirement: Claves con prefijo propio
Las preferencias de la Etapa 1 SHALL guardarse en `localStorage` únicamente bajo las claves `libreria.preferencias.tema` (`"claro"` u `"oscuro"`) y `libreria.preferencias.sidebar` (`"colapsada"` o `"expandida"`). NO SHALL escribirse ninguna otra clave.

#### Scenario: Claves tras usar las preferencias
- **WHEN** el operador cambia el tema y colapsa la sidebar, y luego abre Application → Local Storage en DevTools
- **THEN** solo aparecen esas dos claves con el prefijo `libreria.preferencias.` y los valores descriptos

### Requirement: Tolerancia a fallos del almacenamiento
Toda lectura y escritura de `localStorage` SHALL estar protegida de modo que, si el almacenamiento no está disponible, lanza un error o contiene un valor inválido (por ejemplo texto que no corresponde a un valor permitido), la página siga funcionando con los valores por defecto y sin errores sin capturar en la consola.

#### Scenario: Valor inválido
- **WHEN** se escribe a mano `libreria.preferencias.sidebar` = `{no es un valor` y se recarga
- **THEN** la página carga sin errores en la consola y la sidebar aparece expandida

#### Scenario: Valor desconocido
- **WHEN** se escribe a mano `libreria.preferencias.tema` = `"violeta"` y se recarga
- **THEN** se aplica el tema según `prefers-color-scheme`

### Requirement: Sin datos personales
NO SHALL guardarse en `localStorage`, `sessionStorage` ni cookies ningún dato ingresado en los formularios de la maqueta (nombres, emails, ISBN, cantidades u otros).

#### Scenario: Envío de un formulario de maqueta
- **WHEN** el operador completa y envía el formulario de Clientes y revisa el almacenamiento del sitio en DevTools
- **THEN** no aparece ninguno de los datos ingresados
