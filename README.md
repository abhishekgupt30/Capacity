# Capacita.ai

Autonomous workload, overtime, and burnout management platform with team-scoped RBAC and integrated AI-powered rebalancing.

## Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy 2.0 (async), Pydantic v2
- **AI Engine:** LangChain + Gemini Flash (tool-calling agent)
- **Database:** PostgreSQL 16
- **Frontend:** React 18, Vite, Tailwind CSS v3

## Setup

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Database

```bash
docker compose up -d db
docker compose ps  # wait for healthy
```

### Backend

```bash
cd backend
cp .env.example .env
# IMPORTANT: Update .env with your own credentials before proceeding
python -m venv venv
venv\Scripts\activate   # Linux/Mac: source venv/bin/activate
pip install -r requirements.txt

# Initialize database tables
python -m app.seed
```

### Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Security

- All secrets loaded from environment variables — never committed to source
- CORS restricted to explicit origins
- SQL injection mitigated via parameterized ORM queries
- API key exposure prevented through server-side-only access
- Rate limiting on sensitive endpoints

## License

MIT
