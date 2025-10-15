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