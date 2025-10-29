# Project Scaffold

This repository hosts the groundwork for a full-stack TypeScript application composed of a Node.js backend API and a modern React frontend. The goal of this scaffold is to establish a clear structure, document architectural decisions, and prepare for incremental feature development.

## Architecture Overview

- **Separation of concerns:** Backend API and frontend client live in dedicated `backend/` and `frontend/` directories to allow independent development lifecycles.
- **Shared configuration:** Workspace-level tooling (ESLint, formatting, testing) will be coordinated through root-level configuration files as the project evolves.
- **Extensibility:** The monorepo layout is intended to support future shared packages (e.g., common types) and CI pipelines.

## Tech Stack

### Backend
- **Runtime:** Node.js (>=18) with TypeScript for type safety.
- **Framework:** Express.js for building the REST API surface.
- **Database:** SQLite managed via Prisma ORM for migrations and schema management.

### Frontend
- **Framework:** React with Vite for fast, modern frontend tooling.
- **Language:** TypeScript to enable shared types with the backend and ensure compile-time safety.

### Tooling & Package Management
- **Package management:** npm workspaces configured in the root `package.json` to coordinate dependencies across `backend/` and `frontend/`.
- **Code style:** `.editorconfig` and `.prettierrc` provide consistent formatting across editors and CI.

## Repository Structure

```
.
├── backend/
├── frontend/
├── .editorconfig
├── .gitignore
├── .prettierrc
├── package.json
└── README.md
```

## TODO

- Initialize `backend/` with an Express + TypeScript project structure and Prisma configuration.
- Bootstrap `frontend/` with a Vite-powered React + TypeScript application.
- Add shared TypeScript configuration, linting, and formatting scripts to the workspace.
- Document development setup instructions, including environment variables, database migrations, and npm scripts.
