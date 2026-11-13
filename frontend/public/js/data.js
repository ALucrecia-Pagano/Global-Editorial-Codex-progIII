// Editorial Codex - formato compartido de importes.
// Script clásico (se carga con defer). Antes de js/app.js.
// Los montos confirmados salen de la API; esta función solo los muestra.

function formatearImporteARS(valor) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);
}
