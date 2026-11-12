# Spec Delta: frontend-proxy

## Purpose

Empaqueta la aplicación web del frontend en una imagen Docker con Nginx para servir archivos estáticos y reenviar peticiones `/api/` al backend upstream.

## ADDED Requirements

### Requirement: Servidor Nginx como reverse proxy y hosting estático
El servidor Nginx MUST servir los archivos estáticos desde `/usr/share/nginx/html` en la ruta `/` y reenviar las peticiones que comiencen con `/api/` hacia `http://${API_UPSTREAM}/`.

#### Scenario: Petición a la raíz del frontend
- **WHEN** el cliente solicita `GET /` o cualquier archivo estático existente
- **THEN** Nginx sirve el archivo correspondiente o index.html con código HTTP 200

#### Scenario: Reenvío de peticiones a /api/
- **WHEN** el cliente realiza una petición a `GET /api/health/ready`
- **THEN** Nginx reenvía la petición al backend upstream configurado como `http://${API_UPSTREAM}/health/ready` preservando la barra final y devolviendo la respuesta del backend

### Requirement: Configuración dinámica de upstream mediante variables de entorno
La imagen Docker MUST utilizar `NGINX_ENVSUBST_FILTER=^API_UPSTREAM$` para sustituir únicamente la variable `API_UPSTREAM` en `default.conf.template` al iniciar el contenedor.

#### Scenario: Inicio de contenedor con upstream válido
- **WHEN** el contenedor se inicia pasando `-e API_UPSTREAM=host.docker.internal:8000`
- **THEN** Nginx genera la configuración activa en `/etc/nginx/conf.d/default.conf` apuntando a `proxy_pass http://host.docker.internal:8000/;`
