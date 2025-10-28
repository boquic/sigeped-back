# SIGEPED Backend

Backend para SIGEPED: sistema de gestión de pedidos, autenticación y administración de usuarios.

## Tecnologías principales

- Node.js (Express)
- PostgreSQL (Prisma ORM)
- Autenticación JWT (access/refresh tokens)
- Rate limiting, roles y permisos
- Swagger/OpenAPI (docs en `/docs`)

## Estructura del proyecto

- `/src`: Código fuente principal
  - `app.js`: Configuración de la app Express
  - `config/`: Configuración de entorno, logger, swagger
  - `controllers/`: Lógica de endpoints
  - `db/`: Cliente Prisma
  - `middlewares/`: Middlewares de autenticación, errores, rate limit, roles
  - `models/`: Modelo `Pedido` (Mongoose). Nota: conexión a MongoDB no está habilitada por defecto.
  - `routes/`: Definición de rutas
  - `schemas/`: Validaciones Zod
  - `seed/`: Script de seed inicial
  - `services/`: Lógica de negocio (auth, user, token, email)
- `/prisma`: Esquema y migraciones de base de datos PostgreSQL
- `/docs`: Documentación OpenAPI (Swagger)
- `/tests/e2e`: Pruebas end-to-end (Jest + Supertest)

## Requerimientos

- Node.js 22.16.0
- PostgreSQL 16 (o via Docker)

## Configuración

1. Copia `.env.example` a `.env` y ajusta los valores:

```sh
cp .env.example .env
```

- `PORT`: Puerto del API (por defecto `4000`).
- `DATABASE_URL`: URL de PostgreSQL.
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.
- `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`.
- `CORS_ORIGINS`, `FRONTEND_BASE_URL`.
- SMTP opcional para recuperación de contraseña: `SMTP_*`.
- Seed opcional: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_USERNAME`.

## Instalación

```sh
npm install
npm run prisma:generate
npm run prisma:migrate
```

## Ejecución

- Desarrollo:

```sh
npm run dev
```

- Producción:

```sh
npm start
```

El servidor expone:

- `GET /` salud básico
- `GET /docs` Swagger UI (carga `docs/openapi.yaml`)
- Rutas: `/auth`, `/users`, `/admin`

Puerto por defecto: `http://localhost:4000` (configurable con `PORT`).

## Seed de datos (opcional)

Con variables `SEED_*` configuradas en `.env`, puedes ejecutar:

```sh
node -e "require('./src/seed').seed().then(()=>console.log('seed ok')).catch((e)=>{console.error(e);process.exit(1);})"
```

## Docker

Levanta PostgreSQL + API:

```sh
docker compose up -d --build
```

- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432` (usuario `postgres`, password `postgres`, DB `appdb`)

## Prisma Studio

Levantar Prisma Studio en localhost

```sh
npx prisma studio
```

## Scripts útiles

- `npm run prisma:migrate`: Ejecuta migraciones Prisma
- `npm run prisma:generate`: Genera el cliente Prisma
- `npm run test`: Pruebas unitarias
- `npm run test:e2e`: Pruebas E2E
- `npm run lint`: Linting del código
- `npm run format`: Formatea el código (Prettier)

## Licencia

ISC

Para dudas o mejoras, abre un issue o PR.