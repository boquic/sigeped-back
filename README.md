# SIGEPED Backend

Backend para SIGEPED: sistema de gestión de pedidos, autenticación y administración de usuarios.

## Tecnologías principales

- Node.js (Express)
- PostgreSQL (Prisma ORM)
- MongoDB (Mongoose, solo para pedidos)
- Autenticación JWT (access/refresh tokens)
- Rate limiting, roles y permisos
- Swagger/OpenAPI docs

## Estructura del proyecto

- `/src`: Código fuente principal
  - `app.js`: Configuración de la app Express
  - `config/`: Configuración de entorno, logger, swagger
  - `controllers/`: Lógica de endpoints
  - `db/`: Cliente Prisma
  - `middlewares/`: Middlewares de autenticación, errores, rate limit, roles
  - `models/`: Modelos de datos (Mongoose para pedidos)
  - `routes/`: Definición de rutas
  - `schemas/`: Validaciones Zod
  - `seed/`: Script de seed inicial
  - `services/`: Lógica de negocio (auth, user, token, email)
- `/prisma`: Esquema y migraciones de base de datos PostgreSQL
- `/docs`: Documentación OpenAPI (Swagger)
- `/tests/e2e`: Pruebas end-to-end (Jest + Supertest)

## Configuración

Copia `.env.example` a `.env` y completa los valores necesarios:

```sh
cp [.env.example](http://_vscodecontentref_/0) .env

Variables importantes:

DATABASE_URL: URL de conexión a PostgreSQL
JWT<vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'>_ACCESS</vscode_annotation>_SECRET, JWT_REFRESH_SECRET: Secretos para JWT
MONGODB_URI: URL de conexión a MongoDB (para pedidos)
Opcional: SMTP para recuperación de contraseña
Instalación
Migraciones y generación de Prisma
Ejecución en desarrollo
Ejecución en producción
Pruebas
Documentación API
Disponible en http://localhost:4000/docs (Swagger UI).

Docker
Puedes levantar el stack completo (API + PostgreSQL) con:

Scripts útiles
npm run prisma:migrate: Ejecuta migraciones de Prisma
npm run prisma:generate: Genera el cliente Prisma
npm run lint: Linting del código
npm run format: Formatea el código con Prettier
Licencia
MIT

Para dudas o mejoras, abre un issue o PR.