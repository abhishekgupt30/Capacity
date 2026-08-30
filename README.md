# Capacita.ai

Capacita.ai is a workload, overtime, and burnout management platform with team-scoped RBAC and AI-assisted workload rebalancing.

## Stack

- Backend: Python 3.11+, FastAPI, SQLAlchemy 2.0 (async), and Pydantic v2
- AI: LangChain, LangGraph, and Google Gemini
- Database: PostgreSQL 16
- Frontend: React, Vite, TypeScript, and Tailwind CSS

## Prerequisites

- Docker Desktop with Docker Compose
- Node.js 18 or newer
- A Google Gemini API key

Python is provided by the backend Docker image and does not need to be installed on the host machine.

## Run Locally

Run all commands below from the repository root.

### 1. Configure and start the backend

Create the backend environment file before starting Compose:

macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` before continuing:

- Set `SECRET_KEY` to a strong random value.
- Set `CORS_ORIGINS=http://localhost:3000` to match the Vite development server.
- Set `GOOGLE_API_KEY` if Gemini is enabled. The key must remain server-side in `backend/.env`.
- Set `GEMINI_ENABLED=false` if you want to run without Gemini.

Start PostgreSQL and the backend:

```bash
docker compose up -d --build
docker compose ps
```

Compose creates the database schema automatically from `backend/scripts/init.sql`. The API health check is available at <http://localhost:8000/health>. Interactive API docs are available at <http://localhost:8000/docs> only when `APP_DEBUG=true`.

To load the demo users and sample data, run this optional command:

```bash
docker compose exec backend python -m app.seed
```

The seed command drops and recreates the schema, so use it only when you want to reset the local database. It prints the demo credentials when it completes.

### 2. Configure and start the frontend

Open a second terminal at the repository root:


macOS/Linux:

```bash
cd frontend
npm install
npm run dev
```

Windows PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>.

To stop the containers:

```bash
docker compose down
```

## Useful Commands

Frontend commands are run from `frontend`:

```bash
npm run lint   # TypeScript check
npm run build  # Production build
npm run preview
```

## Security Notes

- Never commit `.env` files or provider API keys.
- Keep `GOOGLE_API_KEY` in the backend environment only.
- Use a unique `SECRET_KEY` and non-default database credentials outside local development.
- Restrict `CORS_ORIGINS` to the URLs that actually host the frontend.

## License

MIT
