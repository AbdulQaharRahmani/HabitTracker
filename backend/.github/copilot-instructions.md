# Copilot instructions for HabitTracker (backend)

Quick, actionable instructions so an AI coding assistant is immediately productive working on this repo.

## Big picture
- Small Express API using ESM (`type: module` in `package.json`). Entry points:
  - `src/server.js` — boots the server: loads environment, connects DB, starts listening.
  - `src/app.js` — configures the Express `app` (middleware, routes) and **exports the app**.
  - `src/config/database.js` — exports `connectDB()` which uses `mongoose` and exits on connection error.
- Typical data flow: HTTP request → routes (`src/routes/*`) → controllers (`src/controllers/*`) → Mongoose models (`src/models/*`) → MongoDB (via `MONGO_URI` in `.env`). The project scaffold includes these directories (currently mostly placeholders like `.gitkeep`).

## Key developer workflows (exact commands)
- Start dev server (auto-reload): `npm run dev` (nodemon → runs `src/server.js`).
- Start production server: `npm start` (`node ./src/server.js`).
- Run test suite: `npm test` (uses Vitest).
- Lint: `npm run lint` (ESLint + Prettier configured).

## Testing & integration notes (important)
- Tests use `vitest` and `supertest`. Example pattern used in this repo:
  - **Do not** import `src/server.js` directly in tests — it calls `connectDB()` and `app.listen()`.
  - Instead, import `app` from `src/app.js` and use `supertest(app)` to test routes without starting a real server.
    ```js
    // example: src/_tests_/route.test.js
    import request from 'supertest';
    import app from '../app.js';

    test('GET / returns API running', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
    ```
- Because `connectDB()` will call `process.exit(1)` on failure, tests that require DB access should either:
  - set a test `MONGO_URI` to a reachable test DB before importing `src/server.js`, or
  - mock `mongoose`/`connectDB()` (preferred for unit tests).

## Conventions & project-specific patterns
- ESM imports/exports everywhere (no `require`). Follow `import x from '...'` and `export default` or named exports in config modules.
- `app` is the single Express application exported from `src/app.js`; `server.js` is thin and only responsible for env + DB + listen.
- Middlewares used by default: `express.json()` and `cors({ origin: '*' })` (see `src/app.js`).
- Keep route/controller/model files inside `src/routes`, `src/controllers`, `src/models`. Add one router per resource and wire it into `app` (e.g., `app.use('/api/habits', habitsRouter)`).

## Environment and runtime
- Environment variables live in `.env` (example keys: `PORT`, `MONGO_URI`). `src/server.js` calls `configDotenv()` at startup.
- `package.json` specifies Node engine `22.15.1`. Expect modern ESM features.

## Files to reference while coding/reviewing
- Boot & env: `src/server.js`
- Express App: `src/app.js`
- DB connector: `src/config/database.js`
- Tests: `src/_tests_/*.test.js` (simple sanity tests present)
- Scripts & dependencies: `package.json`

## When modifying CI / test behavior
- There is no CI config in repo. If adding GitHub Actions, ensure tests run with a DB mock or a dedicated test DB (do not rely on a local developer DB without setup instructions).

---
If anything above is unclear or you want more examples for test/mocking patterns or route wiring examples, tell me which section to expand. Thank you! ✅