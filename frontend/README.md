# Todo Frontend

A Vite + React + TypeScript frontend for managing todos. The UI talks to the backend REST API, supports inline editing, optimistic updates, and comes with Tailwind CSS for styling and React Query for data fetching and caching.

## Getting started

```bash
cd frontend
npm install
cp .env.example .env            # Configure the backend API URL
npm run dev                      # Start the dev server at http://localhost:5173
```

Update the `.env` file so that `VITE_API_BASE_URL` points at the running backend (for example `http://localhost:3000`).

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module reload. |
| `npm run build` | Type-check (via `tsc -b`) and generate a production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint over the project. |

## Project structure

```
src/
  api/           // API client, typed endpoints, and shared contracts
  components/    // Shared UI components (e.g. Spinner)
  config/        // Runtime configuration helpers (env parsing)
  features/
    todos/       // Todo feature entry point and UI components
  hooks/         // Custom hooks built on React Query
```

## Styling

Tailwind CSS powers the design system. Global resets and utilities are declared in `src/index.css`, and component-level styling is achieved with utility classes. Refer to `tailwind.config.js` if you need to adjust the theme.

## Data fetching

The application uses [React Query](https://tanstack.com/query/latest) to handle API calls, caching, and optimistic UI updates. Network errors surface inline with retry controls, and mutations disable relevant UI affordances until the backend confirms the change.

### Todo API contract

The frontend expects a REST API that exposes the following endpoints under `VITE_API_BASE_URL`:

- `GET /todos` – Return an array of todo objects.
- `POST /todos` – Create a todo. Accepts `{ title: string, description?: string }`.
- `PATCH /todos/:id` – Update a todo partially (title, description, completed).
- `DELETE /todos/:id` – Remove a todo.

A todo item is shaped as:

```ts
{
  id: string
  title: string
  description?: string | null
  completed: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
```

The API client gracefully handles JSON parsing and reports structured errors via `ApiError`.

## Production build

```bash
npm run build
npm run preview  # Optional: serve the built assets locally
```

The build output lives in `dist/` and can be deployed behind any static file server. Ensure the frontend is served with the appropriate environment variables by configuring `.env` (or the hosting platform’s environment settings) before building.
