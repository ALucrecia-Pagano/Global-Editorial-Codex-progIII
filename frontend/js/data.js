// Editorial Codex - datos locales del dominio (C-04).
// Script clásico (se carga con defer). Antes de js/app.js.
// Los precios son number (se formatean solo al mostrar).
// generoId: string o null (null = «Sin clasificar»).

// --- Editoriales ---
const editoriales = [
  { id: 'ed-1', nombre: 'Ediciones del Faro' },
  { id: 'ed-2', nombre: 'Prisma Editorial' }
];

// --- Géneros ---
const generos = [
  { id: 'ge-1', nombre: 'Novela' },
  { id: 'ge-2', nombre: 'Ciencia ficción' }
];

// --- Autores ---
const autores = [
  { id: 'au-1', nombre: 'Lucía Ferreyra' },
  { id: 'au-2', nombre: 'Tomás Aguirre' },
  { id: 'au-3', nombre: 'Inés Montoya' }
];

// --- Clientes ---
let clientes = [
  { id: 'cl-1', nombreCompleto: 'Carla Benítez', email: 'carla.benitez@example.com' },
  { id: 'cl-2', nombreCompleto: 'Martín Sosa', email: 'martin.sosa@example.com' },
  { id: 'cl-3', nombreCompleto: 'Julieta Rinaldi', email: 'julieta.rinaldi@example.com' }
];

// --- Ventas (inicia vacío; se llena al confirmar ventas en C-06 a C-09) ---
let ventas = [];

// --- Libros (al menos 6; uno sin género; precios 1500 y 2000 para el caso manual de venta) ---
let libros = [
  {
    id: 'li-1',
    titulo: 'La casa del faro',
    isbn: '978-987-0001-01-1',
    precio: 1500,
    editorialId: 'ed-1',
    generoId: 'ge-1',
    autorIds: ['au-1'],
    portada: 'assets/img/portadas/li-1.webp'
  },
  {
    id: 'li-2',
    titulo: 'Estrellas de papel',
    isbn: '978-987-0001-02-8',
    precio: 2000,
    editorialId: 'ed-2',
    generoId: 'ge-2',
    autorIds: ['au-2'],
    portada: 'assets/img/portadas/li-2.webp'
  },
  {
    id: 'li-3',
    titulo: 'Cartas desde el sur',
    isbn: '978-987-0001-03-5',
    precio: 1800,
    editorialId: 'ed-1',
    generoId: 'ge-1',
    autorIds: ['au-3'],
    portada: 'assets/img/portadas/li-3.webp'
  },
  {
    id: 'li-4',
    titulo: 'Órbita lenta',
    isbn: '978-987-0001-04-2',
    precio: 2500,
    editorialId: 'ed-2',
    generoId: 'ge-2',
    autorIds: ['au-1', 'au-2'],
    portada: 'assets/img/portadas/li-4.webp'
  },
  {
    id: 'li-5',
    titulo: 'Manual de jardinería urbana',
    isbn: '978-987-0001-05-9',
    precio: 2750,
    editorialId: 'ed-1',
    generoId: null,
    autorIds: ['au-3'],
    portada: 'assets/img/portadas/li-5.webp'
  },
  {
    id: 'li-6',
    titulo: 'El mapa invisible',
    isbn: '978-987-0001-06-6',
    precio: 1200,
    editorialId: 'ed-2',
    generoId: 'ge-1',
    autorIds: ['au-2'],
    portada: 'assets/img/portadas/li-6.webp'
  }
];

// Funciones de formato únicas (C-04).
function formatearImporteARS(valor) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);
}

function formatearFecha(iso) {
  const fecha = new Date(iso);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos;
}
