# [Library Mayhem] API

Backend API for **[Library Mayhem]**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: [Janaisah Dormiendo Amatonding] ([janaisahda-cmd]), BSCS [3-2]
- Group and game concept: [Team 12] [A fast-paced top-down library management game where players return books, 
help students by answering quiz questions, and keep the library under control before time runs out]

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## Week 11 Endpoints

### Question Sets (Module 1)
| Method | URL | Who | Description |
|--------|-----|-----|-------------|
| GET | /api/v1/question-sets | Host, Admin | List own question sets |
| POST | /api/v1/question-sets | Host, Admin | Create question set |
| GET | /api/v1/question-sets/:id | Host, Admin | Get one question set |
| PATCH | /api/v1/question-sets/:id | Host, Admin | Update question set |
| DELETE | /api/v1/question-sets/:id | Host, Admin | Delete question set |

### Sessions (Module 2)
| Method | URL | Who | Description |
|--------|-----|-----|-------------|
| POST | /api/v1/sessions | Host, Admin | Start a game (returns 6-digit code) |
| GET | /api/v1/sessions/:code | Anyone | Get session by code |
| PATCH | /api/v1/sessions/:code | Host, Admin | Change status (ACTIVE / CLOSED) |
| POST | /api/v1/sessions/:code/players | Any account | Join or rejoin a game |

## What "completed" means in my game

One or two sentences: A player is considered completed when their finished_at column is not null (they finished the game). Players who left early or did not finish have finished_at = null and are marked as not completed.

## Tables

- users
- question_sets
- questions
- choices
- game_sessions
- players
- answers

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
