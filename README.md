# Todo Backend API

A TypeScript-based Express API that manages todo items backed by a SQLite database via Prisma.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables by copying `.env` (already provided) if you need to override defaults. The API expects a `DATABASE_URL` pointing to a SQLite database file and optionally a custom `PORT`.

3. Run database migrations and generate the Prisma client:

   ```bash
   npm run prisma:migrate
   ```

   When introducing new schema changes during development, pass a descriptive migration name (e.g. `npm run prisma:migrate -- --name add-deadline`). To seed the database with sample todos, run:

   ```bash
   npm run prisma:seed
   ```

4. Start the development server with hot reloading:

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` by default.

5. Build the production bundle (emits compiled JavaScript to `dist/`):

   ```bash
   npm run build
   ```

   Then start it with:

   ```bash
   npm start
   ```

## Running tests

Tests are implemented with Vitest and Supertest. They run against an isolated SQLite database defined in the `test` npm script.

```bash
npm test
```

## API overview

All endpoints are prefixed with `/api/todos` and exchange JSON payloads.

| Method | Endpoint            | Description                           |
| ------ | ------------------- | ------------------------------------- |
| GET    | `/api/todos`        | List all todos (newest first).        |
| POST   | `/api/todos`        | Create a new todo item.               |
| PUT    | `/api/todos/:id`    | Update the title/description/completed state of a todo. |
| PATCH  | `/api/todos/:id/toggle` | Toggle the completed status.      |
| DELETE | `/api/todos/:id`    | Remove a todo item.                   |

Payloads are validated with [Zod](https://github.com/colinhacks/zod); invalid requests return a `400` status and a detailed error response. Not-found resources respond with `404`.

## Project structure

```
├── prisma
│   ├── migrations        # Prisma migration history
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Optional seed script
├── src
│   ├── app.ts            # Express application setup
│   ├── config            # Environment configuration
│   ├── controllers       # Route handlers
│   ├── middlewares       # Error and 404 handlers
│   ├── routes            # Express routers
│   ├── services          # Business logic and Prisma interactions
│   ├── utils             # Shared helpers (e.g., Prisma & errors)
│   └── server.ts         # HTTP server bootstrap
└── tests                 # Vitest + Supertest integration tests
```

## JSON error structure

Errors are returned with the following shape to aid clients:

```json
{
  "error": {
    "message": "Invalid request payload",
    "details": {
      "fieldErrors": {
        "title": ["Title is required"]
      },
      "formErrors": []
    }
  }
}
```

## Logging & graceful shutdown

Requests are logged to the console via `morgan` (disabled during tests). The server listens for `SIGINT`, `SIGTERM`, and unhandled errors to close the HTTP server and release Prisma connections cleanly.
