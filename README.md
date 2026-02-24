# Mini Task Manager

Mini projet fullstack TypeScript en monorepo:
- Backend: Node.js + Express + Prisma + SQLite
- Frontend: React + Vite + TanStack Query
- Qualite: ESLint + Prettier
- Tests: Vitest + Supertest (backend)

## Arborescence

```text
reactnodejs/
├── client/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── vite-env.d.ts
│   │   ├── api/tasks.api.ts
│   │   ├── components/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskFilters.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── Toast.tsx
│   │   ├── hooks/
│   │   │   ├── useTasks.ts
│   │   │   └── useToast.ts
│   │   ├── types/task.types.ts
│   │   ├── utils/formatters.ts
│   │   └── index.css
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── controllers/tasks.controller.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   ├── health.ts
│   │   │   └── tasks.ts
│   │   ├── services/tasks.service.ts
│   │   ├── types/task.types.ts
│   │   └── validators/task.validator.ts
│   ├── tests/
│   │   ├── health.test.ts
│   │   └── tasks.test.ts
│   ├── tsconfig.json
│   └── vitest.config.ts
├── docker-compose.yml
├── package.json
├── tsconfig.base.json
├── .eslintrc.cjs
├── .prettierrc
└── .gitignore
```

## Fonctionnalites

- CRUD des taches
- Champs: `title`, `description`, `status`, `priority`, `dueDate`, `createdAt`, `updatedAt`
- Filtres et tri: `status`, `priority`, `dueDate`, `createdAt`, `title`
- Recherche texte: `title` / `description`
- Notifications succes/erreur (toasts)
- Etats loading et empty state

## API Endpoints

Base URL backend: `http://localhost:3001`

- `GET /api/health`
- `GET /api/tasks?status=&priority=&search=&sortBy=&sortOrder=`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Exemple payload create/update:

```json
{
  "title": "Prepare demo",
  "description": "Slides + quick runbook",
  "status": "doing",
  "priority": "high",
  "dueDate": "2026-03-01T10:00:00.000Z"
}
```

## Variables d environnement

### server/.env

Copier `server/.env.example` vers `server/.env`.

Variables principales:
- `PORT=3001`
- `NODE_ENV=development`
- `DATABASE_URL="file:./dev.db"`
- `CORS_ORIGIN=http://localhost:5173`

### client/.env.local

Copier `client/.env.example` vers `client/.env.local`.

Variable principale:
- `VITE_API_URL=http://localhost:3001`

## Lancement local

Pre-requis:
- Node.js >= 18
- npm >= 9

1. Installer les dependances:

```bash
npm install
```

2. Initialiser la DB:

```bash
npm run db:push
npm run db:seed
```

3. Lancer en dev (hot reload server + client):

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Scripts utiles

Racine:

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run format
npm run db:push
npm run db:migrate
npm run db:seed
```

Server:

```bash
npm run dev --workspace=server
npm run test --workspace=server
```

Client:

```bash
npm run dev --workspace=client
npm run build --workspace=client
```

## Docker

Lancer server + client:

```bash
docker compose up --build
```

- API: `http://localhost:3001`
- UI: `http://localhost:5173`

Note: la base Docker (`prod.db`) est vide au premier demarrage.
Pour injecter les taches de demo:

```bash
docker-compose exec server npm run db:seed
```

## Architecture rapide

- `server/src/routes`: definition REST
- `server/src/controllers`: couche HTTP
- `server/src/services`: logique metier + Prisma
- `server/src/middleware`: validation + gestion centralisee des erreurs
- `client/src/api`: client HTTP
- `client/src/hooks`: hooks React Query
- `client/src/components`: UI

## Tests

Tests backend disponibles:
- health check
- creation task
- listing/filter/search
- erreurs de validation
- update/delete

Frontend: pas de test configure pour le moment (choix volontaire mini-projet).

## Ameliorations possibles

- Authentification (JWT / session)
- Pagination cote backend + frontend
- Roles et permissions
- Soft delete et audit log
- CI (lint/test/build) GitHub Actions
- Partage d un package de types commun (`packages/shared`)
