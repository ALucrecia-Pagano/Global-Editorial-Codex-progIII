#!/usr/bin/env python3
"""Carga datos de demostración del catálogo de Editorial Codex a través de la API.

Qué hace
- Crea (si no existen) editoriales, géneros, autores y libros usando SOLO la API
  HTTP: POST /editoriales/, POST /generos/, POST /autores/ y POST /libros/.
- Es idempotente: antes de crear consulta los listados (limit=100) y reutiliza
  los ids existentes por nombre exacto (o por ISBN, en el caso de los libros).
  Correrlo dos veces no duplica ningún dato.
- Todos los datos son ficticios con fines de demostración.

Cómo se usa
- Local (con el frontend/Nginx y la API levantados):
    python herramientas/cargar_catalogo.py --base http://127.0.0.1:8080/api
- VPS (Easypanel, URL pública del frontend):
    python herramientas/cargar_catalogo.py --base https://<dominio>/api
- Si se omite --base, usa http://127.0.0.1:8080/api

Solo requiere la biblioteca estándar de Python 3 (urllib.request, json, argparse).
"""

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

BASE_POR_DEFECTO = "http://127.0.0.1:8080/api"
TIMEOUT_SEGUNDOS = 15

EDITORIALES = [
    {"nombre": "Ediciones del Faro", "pais": "Argentina"},
    {"nombre": "Prisma Editorial", "pais": "Argentina"},
]

GENEROS = [
    "Novela",
    "Ciencia ficción",
    "Fantasía",
    "Terror",
    "Romance",
]

AUTORES = [
    {"nombre": "Lucía Ferreyra", "nacionalidad": "Argentina"},
    {"nombre": "Tomás Aguirre", "nacionalidad": "Argentina"},
    {"nombre": "Inés Montoya", "nacionalidad": "Argentina"},
    {"nombre": "Valeria Quiroga", "nacionalidad": "Argentina"},
    {"nombre": "Martín Ledesma", "nacionalidad": "Argentina"},
    {"nombre": "Joaquín Ferrán", "nacionalidad": "Argentina"},
    {"nombre": "Florencia Ibarra", "nacionalidad": "Argentina"},
]

LIBROS = [
    {
        "titulo": "La casa del faro",
        "isbn": "978-987-0001-01-1",
        "precio": "18500.00",
        "stock": 12,
        "editorial": "Ediciones del Faro",
        "genero": "Novela",
        "autores": [("Lucía Ferreyra", "autor", 1)],
    },
    {
        "titulo": "Estrellas de papel",
        "isbn": "978-987-0001-02-8",
        "precio": "21000.00",
        "stock": 8,
        "editorial": "Prisma Editorial",
        "genero": "Ciencia ficción",
        "autores": [("Tomás Aguirre", "autor", 1)],
    },
    {
        "titulo": "Cartas desde el sur",
        "isbn": "978-987-0001-03-5",
        "precio": "19800.00",
        "stock": 6,
        "editorial": "Ediciones del Faro",
        "genero": "Novela",
        "autores": [("Inés Montoya", "autor", 1)],
    },
    {
        "titulo": "Órbita lenta",
        "isbn": "978-987-0001-04-2",
        "precio": "24500.00",
        "stock": 5,
        "editorial": "Prisma Editorial",
        "genero": "Ciencia ficción",
        "autores": [("Lucía Ferreyra", "autor", 1), ("Tomás Aguirre", "coautor", 2)],
    },
    {
        "titulo": "Manual de jardinería urbana",
        "isbn": "978-987-0001-05-9",
        "precio": "16900.00",
        "stock": 9,
        "editorial": "Ediciones del Faro",
        "genero": None,
        "autores": [("Inés Montoya", "autor", 1)],
    },
    {
        "titulo": "El mapa invisible",
        "isbn": "978-987-0001-06-6",
        "precio": "22300.00",
        "stock": 7,
        "editorial": "Prisma Editorial",
        "genero": "Novela",
        "autores": [("Tomás Aguirre", "autor", 1)],
    },
    {
        "titulo": "Tinta que respira",
        "isbn": "978-987-0001-07-3",
        "precio": "27500.00",
        "stock": 10,
        "editorial": "Ediciones del Faro",
        "genero": "Fantasía",
        "autores": [("Valeria Quiroga", "autor", 1), ("Martín Ledesma", "ilustrador", 2)],
    },
    {
        "titulo": "Lo que susurra el pozo",
        "isbn": "978-987-0001-08-0",
        "precio": "24900.00",
        "stock": 6,
        "editorial": "Prisma Editorial",
        "genero": "Terror",
        "autores": [("Joaquín Ferrán", "autor", 1), ("Inés Montoya", "traductor", 2)],
    },
    {
        "titulo": "La llave de los mil inviernos",
        "isbn": "978-987-0001-09-7",
        "precio": "23400.00",
        "stock": 8,
        "editorial": "Ediciones del Faro",
        "genero": "Romance",
        "autores": [("Florencia Ibarra", "autor", 1)],
    },
    {
        "titulo": "El relojero de las horas perdidas",
        "isbn": "978-987-0001-10-3",
        "precio": "26800.00",
        "stock": 5,
        "editorial": "Prisma Editorial",
        "genero": "Fantasía",
        "autores": [("Martín Ledesma", "autor", 1), ("Florencia Ibarra", "coautor", 2)],
    },
]

FALLOS = 0


class ApiNoDisponible(Exception):
    """La API no respondió (red, DNS, conexión rechazada o timeout)."""


class ApiError(Exception):
    """La API respondió con un código HTTP de error."""

    def __init__(self, codigo: int, detail: Any) -> None:
        super().__init__(str(detail))
        self.codigo = codigo
        self.detail = detail


def _detalle_legible(detail: Any) -> str:
    if isinstance(detail, str):
        return detail
    if isinstance(detail, list):
        partes = []
        for item in detail:
            if isinstance(item, dict):
                msg = item.get("msg", "")
                ubic = ".".join(str(p) for p in item.get("loc", []) if p != "body")
                partes.append(f"{ubic}: {msg}" if ubic else msg)
            else:
                partes.append(str(item))
        return " | ".join(p for p in partes if p)
    return json.dumps(detail, ensure_ascii=False)


def _peticion(metodo: str, url: str, cuerpo: Any = None) -> Any:
    datos = None
    cabeceras = {"Accept": "application/json"}
    if cuerpo is not None:
        datos = json.dumps(cuerpo).encode("utf-8")
        cabeceras["Content-Type"] = "application/json"

    solicitud = urllib.request.Request(url, data=datos, headers=cabeceras, method=metodo)
    try:
        with urllib.request.urlopen(solicitud, timeout=TIMEOUT_SEGUNDOS) as respuesta:
            texto = respuesta.read().decode("utf-8")
            return json.loads(texto) if texto else None
    except urllib.error.HTTPError as error:
        texto = error.read().decode("utf-8", errors="replace")
        try:
            detail = json.loads(texto).get("detail", texto)
        except (ValueError, AttributeError):
            detail = texto
        raise ApiError(error.code, detail) from None
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as error:
        motivo = getattr(error, "reason", error)
        raise ApiNoDisponible(str(motivo)) from None


def _listar(base: str, ruta: str) -> list[dict]:
    url = f"{base}{ruta}?{urllib.parse.urlencode({'limit': 100})}"
    respuesta = _peticion("GET", url)
    return respuesta if isinstance(respuesta, list) else []


def _crear(base: str, ruta: str, cuerpo: dict) -> dict:
    return _peticion("POST", f"{base}{ruta}", cuerpo)


def _fallo(etiqueta: str, error: Exception) -> None:
    global FALLOS
    FALLOS += 1
    if isinstance(error, ApiError):
        print(f"[{etiqueta}] ERROR HTTP {error.codigo}: {_detalle_legible(error.detail)}")
    else:
        print(f"[{etiqueta}] ERROR: {error}")


def cargar_editoriales(base: str) -> dict[str, int]:
    print("== Editoriales ==")
    existentes = {item["nombre"]: item["id"] for item in _listar(base, "/editoriales/")}
    ids: dict[str, int] = {}
    for editorial in EDITORIALES:
        nombre = editorial["nombre"]
        if nombre in existentes:
            ids[nombre] = existentes[nombre]
            print(f"[editorial] {nombre}: ya existía (id={existentes[nombre]})")
            continue
        try:
            creada = _crear(base, "/editoriales/", editorial)
            ids[nombre] = creada["id"]
            print(f"[editorial] {nombre}: creado (id={creada['id']})")
        except (ApiError, ApiNoDisponible) as error:
            _fallo(f"editorial {nombre}", error)
            if isinstance(error, ApiNoDisponible):
                raise
    return ids


def cargar_generos(base: str) -> dict[str, int]:
    print("== Géneros ==")
    existentes = {item["nombre"]: item["id"] for item in _listar(base, "/generos/")}
    ids: dict[str, int] = {}
    for nombre in GENEROS:
        if nombre in existentes:
            ids[nombre] = existentes[nombre]
            print(f"[género] {nombre}: ya existía (id={existentes[nombre]})")
            continue
        try:
            creado = _crear(base, "/generos/", {"nombre": nombre})
            ids[nombre] = creado["id"]
            print(f"[género] {nombre}: creado (id={creado['id']})")
        except (ApiError, ApiNoDisponible) as error:
            _fallo(f"género {nombre}", error)
            if isinstance(error, ApiNoDisponible):
                raise
    return ids


def cargar_autores(base: str) -> dict[str, int]:
    print("== Autores ==")
    existentes = {item["nombre"]: item["id"] for item in _listar(base, "/autores/")}
    ids: dict[str, int] = {}
    for autor in AUTORES:
        nombre = autor["nombre"]
        if nombre in existentes:
            ids[nombre] = existentes[nombre]
            print(f"[autor] {nombre}: ya existía (id={existentes[nombre]})")
            continue
        try:
            creado = _crear(base, "/autores/", autor)
            ids[nombre] = creado["id"]
            print(f"[autor] {nombre}: creado (id={creado['id']})")
        except (ApiError, ApiNoDisponible) as error:
            _fallo(f"autor {nombre}", error)
            if isinstance(error, ApiNoDisponible):
                raise
    return ids


def cargar_libros(
    base: str,
    ids_editoriales: dict[str, int],
    ids_generos: dict[str, int],
    ids_autores: dict[str, int],
) -> None:
    print("== Libros ==")
    existentes = {item["isbn"]: item["id"] for item in _listar(base, "/libros/")}
    for libro in LIBROS:
        isbn = libro["isbn"]
        etiqueta = f"libro {libro['titulo']} ({isbn})"
        if isbn in existentes:
            print(f"[libro] {libro['titulo']} ({isbn}): ya existía (id={existentes[isbn]})")
            continue

        editorial_id = ids_editoriales.get(libro["editorial"])
        if editorial_id is None:
            _fallo(etiqueta, RuntimeError(f"no se resolvió la editorial '{libro['editorial']}'"))
            continue

        genero_id = None
        if libro["genero"] is not None:
            genero_id = ids_generos.get(libro["genero"])
            if genero_id is None:
                _fallo(etiqueta, RuntimeError(f"no se resolvió el género '{libro['genero']}'"))
                continue

        autorias = []
        faltante = None
        for nombre_autor, rol, orden in libro["autores"]:
            autor_id = ids_autores.get(nombre_autor)
            if autor_id is None:
                faltante = nombre_autor
                break
            autorias.append({"autor_id": autor_id, "rol": rol, "orden": orden})
        if faltante is not None:
            _fallo(etiqueta, RuntimeError(f"no se resolvió el autor '{faltante}'"))
            continue

        cuerpo = {
            "isbn": isbn,
            "titulo": libro["titulo"],
            "precio": libro["precio"],
            "stock": libro["stock"],
            "editorial_id": editorial_id,
            "genero_id": genero_id,
            "autores": autorias,
        }
        try:
            creado = _crear(base, "/libros/", cuerpo)
            print(f"[libro] {libro['titulo']} ({isbn}): creado (id={creado['id']})")
        except (ApiError, ApiNoDisponible) as error:
            _fallo(etiqueta, error)
            if isinstance(error, ApiNoDisponible):
                raise


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Carga datos de demostración del catálogo a través de la API (idempotente)."
    )
    parser.add_argument(
        "--base",
        default=BASE_POR_DEFECTO,
        help=f"URL base de la API (por defecto: {BASE_POR_DEFECTO})",
    )
    args = parser.parse_args()
    base = args.base.rstrip("/")

    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    print(f"API: {base}")
    try:
        ids_editoriales = cargar_editoriales(base)
        ids_generos = cargar_generos(base)
        ids_autores = cargar_autores(base)
        cargar_libros(base, ids_editoriales, ids_generos, ids_autores)
    except ApiNoDisponible as error:
        print(
            f"No se pudo conectar con la API en {base}: {error}. "
            "Verificá que el backend esté levantado y que la URL base sea correcta.",
            file=sys.stderr,
        )
        return 2
    except ApiError as error:
        print(
            f"La API respondió HTTP {error.codigo}: {_detalle_legible(error.detail)}",
            file=sys.stderr,
        )
        return 1

    if FALLOS:
        print(f"Terminó con {FALLOS} error(es).", file=sys.stderr)
        return 1
    print("Listo: catálogo cargado sin errores.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
