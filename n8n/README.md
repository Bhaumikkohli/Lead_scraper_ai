Local n8n module

Prereqs
- Docker + Docker Compose

Setup
1. Copy env: `cp .env.example .env` and fill `ABR_GUID`, `SERPAPI_API_KEY` if available.
2. Start services: `docker compose up -d` from this directory.
3. Open n8n at `http://localhost:5678` (auth from `.env`).
4. Import workflow `workflows/lead_extraction_parallel.json` and activate if desired.

Trigger from app
- Set `N8N_WEBHOOK_URL` in `leadflow-ai/.env` to: `http://localhost:5678/webhook/lead-extract`
- Call Next API `POST /api/run` with `{ userId, keywords, locations, limit }`.

Notes
- Workflow branches in parallel: SERP -> fetch website -> regex email, and ABR name match -> ABN details.
- Response merges results and returns JSON to caller.

