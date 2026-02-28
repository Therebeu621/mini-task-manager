# Mini Task Manager

[![CI](https://github.com/Therebeu621/mini-task-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/Therebeu621/mini-task-manager/actions/workflows/ci.yml)

Application fullstack de gestion de tâches, orientée produit, construite en monorepo TypeScript.

## Stack

- **Frontend**: React + Vite + TanStack Query
- **Backend**: Node.js + Express + Prisma + SQLite
- **Qualité**: ESLint + Prettier + Vitest/Supertest
- **DevOps**: Docker + docker-compose + GitHub Actions

## Fonctionnalités

- CRUD complet des tâches
- Recherche + filtres (`status`, `priority`)
- Tri (`title`, `dueDate`, `createdAt`, `priority`, `status`)
- Pagination backend et frontend (`page`, `limit`)
- UI responsive:
  - desktop: sidebar filtres + liste
  - mobile: drawer filtres
- Pagination UI avancée:
  - First / Prev / Next / Last
  - numéros + ellipses
  - taille de page (10 / 20 / 50)
  - affichage “Showing X-Y of Z”
- Toasts + états loading / empty / erreur

## Lancer le projet (recommandé)

### Option 1: Docker (recommandé pour démo portfolio)

```bash
docker-compose up --build
```

- UI: `http://localhost:5173`
- API: `http://localhost:3001`

Optionnel (données de démo):

```bash
docker-compose exec server npm run db:seed
```

### Option 2: Local dev (recommandé pour coder)

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## API

Base URL: `http://localhost:3001`

### Endpoints

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Query params de `GET /api/tasks`

- `status`: `todo|doing|done`
- `priority`: `low|medium|high`
- `search`: texte libre
- `sortBy`: `title|dueDate|createdAt|priority|status`
- `sortOrder`: `asc|desc`
- `page`: entier `>= 1` (défaut: `1`)
- `limit`: entier `1..100` (défaut: `10`)

Exemple:

```bash
curl "http://localhost:3001/api/tasks?page=2&limit=20&status=doing&sortBy=createdAt&sortOrder=desc"
```

## Commandes utiles

```bash
npm run lint
npm run test
npm run build
npm run format
```

## CI

Workflow: `.github/workflows/ci.yml`

Déclenchement:
- `push` sur `main`
- `pull_request` vers `main`

Étapes:
1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

## Structure rapide

```text
client/
  src/components/ui
  src/features/tasks
server/
  src/routes
  src/services
  prisma/
```

## Améliorations possibles

- Authentification (JWT/session)
- Gestion des rôles
- Optimistic updates côté frontend
- Soft delete + audit trail
