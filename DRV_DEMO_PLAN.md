# GraphRAG Demo Demo Plan — Deutsche Rentenversicherung (DRV)

**Customer:** Deutsche Rentenversicherung Bund  
**Environment:** Dedicated `demo` Kubernetes namespace (shared AKS cluster)  
**Target date:** Q2 2026  
**Status:** Planning

---

## Table of Contents

1. [Scope & Goals](#1-scope--goals)
2. [Data Import — Laws from Gesetze-im-Internet](#2-data-import--laws-from-gesetze-im-internet)
3. [Graph DB Coverage](#3-graph-db-coverage)
4. [User Scenarios](#4-user-scenarios)
5. [Frontend: NeoDash](#5-frontend-neodash)
6. [Chatbot with GraphRAG](#6-chatbot-with-graphrag)
7. [Architecture Diagram](#7-architecture-diagram)
8. [Infrastructure — Demo Namespace](#8-infrastructure--demo-namespace)
9. [Work Packages & Priorities](#9-work-packages--priorities)

---

## 1. Scope & Goals

The DRV demo shows live how GraphRAG Demo transforms the German Social Law corpus relevant to pension insurance into a navigable compliance knowledge graph and enables natural language Q&A.

| Goal | Capability |
|------|-----------|
| Show graph depth | All relevant SGB laws parsed and linked in Neo4j |
| Search demo | Full-text + semantic vector search across §§ and business rules |
| Visual exploration | NeoDash dashboard with law tree, rule overview, process view |
| Chatbot demo | Natural language Q&A grounded in the graph (GraphRAG) |
| No hallucination story | Show LLM answer + citations pointing to specific §§ |

---

## 2. Data Import — Laws from Gesetze-im-Internet

Source files are maintained under `graph-pipelines/data/examples/drv/`.  
See [data/examples/drv/README.md](../../graph-pipelines/data/examples/drv/README.md) for fetch and pipeline commands.

### 2.1 Core Laws (Priority 1 — Run First)

These cover the complete statutory basis of the DRV and are required for a meaningful demo.

| # | Law | Short | Paragraphs | Why it matters for DRV |
|---|-----|-------|-----------|------------------------|
| 1 | **SGB VI** — Gesetzliche Rentenversicherung | `sgb_6` | ~323 §§ | **Primary law** — contributions, benefits, old-age/disability pension |
| 2 | **SGB IV** — Gemeinsame Vorschriften Sozialversicherung | `sgb_4` | ~120 §§ | Shared definitions: Versicherungspflicht, Beiträge, Meldeverfahren |
| 3 | **SGB I** — Allgemeiner Teil | `sgb_1` | ~70 §§ | Framework: Leistungsansprüche, Fristen, Zuständigkeit |
| 4 | **SGB IX** — Rehabilitation und Teilhabe | `sgb_9_2018` | ~240 §§ | DRV is primary Reha-Träger — large case workload |
| 5 | **SGB X** — Verwaltungsverfahren / Sozialdatenschutz | `sgb_10` | ~115 §§ | Administrative process + data protection (essential for case handling) |

### 2.2 Extended Laws (Priority 2 — For Full Demo Depth)

| # | Law | Short | Use case |
|---|-----|-------|---------|
| 6 | **AAÜG** — Anwartschaftsüberführungsgesetz | `aa_g` | Post-reunification pension rights (DDR employees) |
| 7 | **FremdRG** — Fremdrentengesetz | `fremdrentengesetz` | Foreign country pension periods (expats, refugees) |
| 8 | **VersAusglG** — Versorgungsausgleichsgesetz | `versausglg` | Divorce-related pension splitting |
| 9 | **BetrAVG** — Betriebsrentengesetz | `betravg` | Occupational pension; coordination with DRV |

### 2.3 DRV Handlungsanweisungen — Gemeinsame Rechtliche Anweisungen (GRA)

GRA are the official Handlungsanweisungen of DRV and are **publicly accessible** on the
**rvRecht® portal** (<https://rvrecht.deutsche-rentenversicherung.de>). Content is HTML,
not PDFs. The scraper `data/examples/drv/fetch_gra.py` handles extraction.

| GRA | rvRecht Section | § Coverage | Importance |
|-----|----------------|-----------|------------|
| GRA SGB VI | rvRecht → GRA SGB → SGB VI | §§ 1–323 | ⭐⭐⭐ Primary — Altersrente, EM-Rente, Reha |
| GRA SGB IV | rvRecht → GRA SGB → SGB IV | §§ 1–120 | ⭐⭐⭐ Versicherungspflicht, Beiträge, Meldung |
| GRA SGB I  | rvRecht → GRA SGB → SGB I  | §§ 1–70  | ⭐⭐ Allgemeine Leistungsansprüche, Fristen |
| GRA SGB IX | rvRecht → GRA SGB → SGB IX | §§ 1–241 | ⭐⭐ Rehabilitation, DRV als Reha-Träger |
| GRA SGB X  | rvRecht → GRA SGB → SGB X  | §§ 1–115 | ⭐ Verwaltungsverfahren, Sozialdatenschutz |
| GRA FRG/FANG | rvRecht → GRA FRG/FANG | — | ⭐ Fremdrentenrecht für Spätaussiedler |

Fetch and parse:

```bash
# 1. Scrape GRA HTML → plain text per §
python data/examples/drv/fetch_gra.py --sgb sgb_6 --output data/examples/drv/gra_sgb_6/

# 2. Run instruction parser (text files treated as directives)
uv run graph-cli parse-pdf-directives --input-path data/examples/drv/gra_sgb_6/ --profile law-instruction
```

---

## 3. Graph DB Coverage

After full import the DRV graph will contain:

```
CT_LAW (5–9 nodes)
  └─[SR_CONTAINS]─> S_SECTION (~1 000 nodes)
       └─[SR_CONTAINS]─> S_CORE_COMPONENT (~2 500 nodes)
            ├─[SR_DEFINES]─> S_BUSINESS_RULE (~800 nodes)
            │    └─[SR_REALIZED_BY]─> S_PROCESS (~200 nodes)
            │         ├─[SR_SUPPORTS]─> S_GOAL
            │         └─[SR_COMPOSED_OF]─> S_TASK
            └─[SR_ASSOCIATES]─> S_ENT_* (~2 000 entity nodes)
                 e.g. S_ENT_PERSON, S_ENT_BUSINESS_OBJECT,
                      S_ENT_DEADLINE, S_ENT_MONEY_AMOUNT
```

Key demo queries to showcase (Cypher):

```cypher
// 1. Find all business rules in SGB VI about Altersrente
MATCH (l:CT_LAW {at_abbreviation: "SGB VI"})-[:SR_CONTAINS*]->(cc:S_CORE_COMPONENT)
      -[:SR_DEFINES]->(br:S_BUSINESS_RULE)
WHERE toLower(br.at_name) CONTAINS "altersrente"
RETURN l.at_abbreviation, cc.at_title, br.at_name, br.at_content LIMIT 20

// 2. Show process chain for Rentenantrag
MATCH path = (p:S_PROCESS {at_name: "Rentenantrag"})-[:SR_COMPOSED_OF|SR_SEQUENCE_FLOW*]->(t:S_TASK)
RETURN path

// 3. Cross-law linkage: SGB VI § → SGB X (Verwaltungsverfahren)
MATCH (cc:S_CORE_COMPONENT)-[:SR_DEFINES]->(br:S_BUSINESS_RULE)
WHERE br.at_content CONTAINS "Verwaltungsakt"
RETURN cc.at_title, br.at_name LIMIT 10
```

---

## 4. User Scenarios

### Scenario A — Compliance Analyst (Sachbearbeiter Recht)

**Goal:** Quickly find the binding rule for a specific benefit type, verify it against the source §.

1. Opens NeoDash dashboard → selects "Gesetze" overview panel
2. Clicks on `SGB VI` → drills into `§ 35 Regelaltersrente`
3. Sees extracted business rules + linked entities (Wartezeit, Vollendung Lebensalter)
4. Clicks "Chat with this §" → chatbot pre-loaded with that core component
5. Asks: *"Unter welchen Voraussetzungen hat jemand Anspruch auf Regelaltersrente?"*
6. Chatbot returns structured answer + cites `§ 35 SGB VI Abs. 1` with link to NeoDash node

### Scenario B — Process Engineer (Prozessbearbeiter)

**Goal:** Map business rules to BPMN process lanes for Rentenantrag processing.

1. Opens "Prozesse" panel → searches for "Rentenantrag"
2. Sees process graph: tasks, sequence flow, goals
3. Exports process as BPMN XML (future feature)
4. Uses chatbot: *"Welche Fristen gelten für die Bearbeitung eines Rentenantrags?"*
5. Answer cites `§ 99 SGB VI`, `§ 17 SGB I`, `§ 26 SGB X`

### Scenario C — Impact Analysis (Gesetzesänderung SGB VI 2025)

**Goal:** Identify all business rules affected by a change to `§ 33 SGB VI`.

1. Analyst enters the changed paragraph text in the "Impact" panel (future feature)
2. System computes semantic similarity to all linked business rules
3. Returns ranked list of affected rules + processes
4. Chatbot guided Q&A: *"Was ändert sich durch den neuen § 33 für die Erwerbsminderungsrente?"*

### Scenario D — New Employee Onboarding

**Goal:** Understand DRV responsibilities without reading 300+ pages.

1. Opens chatbot
2. Asks: *"Für welche Leistungen ist die DRV zuständig?"*
3. Chatbot walks through `SGB VI, §§ 1–14` (Versicherter Personenkreis) with plain-language summaries

---

## 5. Frontend: NeoDash

### 5.1 Existing Capability (reuse)

- Law/Section tree navigation (graph panel)
- Full-text search across `S_CORE_COMPONENT.at_content` (existing search report)
- Entity overview panel

### 5.2 New NeoDash Panels for DRV Demo

| Panel | Type | Cypher / Source | Priority |
|-------|------|-----------------|---------|
| DRV Law Overview | Graph | `MATCH (l:CT_LAW)-[:SR_CONTAINS]->(s:S_SECTION) RETURN l,s` | P1 |
| Business Rules Table | Table | Filter by law, keyword | P1 |
| Process Flow | Graph | `S_PROCESS -[SR_COMPOSED_OF]-> S_TASK` | P1 |
| Entity Cloud | Table/Graph | Top entities per law | P2 |
| Cross-law Heatmap | Table | Business rules referencing multiple laws | P2 |
| Chatbot Widget | iFrame | Embedded chatbot endpoint (see §6) | P1 |

### 5.3 NeoDash Dashboard File

Create `helm-charts/argocd-apps/neodash/dashboards/drv-demo.json` (NeoDash export).  
Load via NeoDash `--dashboard` startup parameter or import manually.

---

## 6. Chatbot with GraphRAG

### 6.1 Design Goals

- **Grounded answers only** — every LLM response must reference graph nodes
- **No hallucination** — context is assembled from actual Neo4j data, not open web
- **Transparent citations** — response includes `§ X Abs. Y SGB Z` with NeoDash deep-link
- **Deutsch only** — system prompt enforces German; non-German input is politely redirected
- **Persistent sessions** — Redis-backed, TTL 8h; conversation survives browser refresh

### 6.2 Architecture

```
User (NeoDash iFrame)
        │  HTTP POST /chat  { question, session_id, context_node_id? }
        ▼
FastAPI Chatbot Service  (new: api/chatbot)
        │
        ├─1─ Vector Search ──────────────────────────────────────────────────▶ Neo4j
        │      neo4j.graphrag.VectorRetriever                                  vector index: idx_core_component_emb
        │      Query embedding (text-embedding-3-large)                        on S_CORE_COMPONENT.at_embedding
        │      Top-K=10 semantically similar core components
        │
        ├─2─ Graph Expansion ────────────────────────────────────────────────▶ Neo4j
        │      VectorCypherRetriever with expansion query:
        │      MATCH (cc)<-[:SR_CONTAINS*]-(sect)<-[:SR_CONTAINS]-(law:CT_LAW)
        │      OPTIONAL MATCH (cc)-[:SR_DEFINES]->(br:S_BUSINESS_RULE)
        │      RETURN cc, br, law, sect
        │
        ├─3─ Context Assembly
        │      Structured prompt: law + section titles + core component text
        │      + business rules + previous turns
        │
        ├─4─ LLM Call ───────────────────────────────────────────────────────▶ Azure OpenAI (GPT-4o)
        │      System prompt: "Du bist ein Compliance-Experte für deutsche Rentenversicherung..."
        │      Return: answer + list of source node UUIDs
        │
        └─5─ Response  { answer, citations: [{uuid, law, section, url}] }
                │
                └──── NeoDash iFrame renders answer + clickable § citations
```

### 6.3 Neo4j GraphRAG Integration

Use [Neo4j GraphRAG Python library](https://neo4j.com/developer/genai-ecosystem/graphrag-python/) (`neo4j-graphrag`).

**Vector Index (create once, after initial import):**

```cypher
CREATE VECTOR INDEX idx_core_component_emb IF NOT EXISTS
FOR (cc:S_CORE_COMPONENT)
ON cc.AT_EMBEDDING
OPTIONS { indexConfig: {
  `vector.dimensions`: 3072,
  `vector.similarity_function`: 'cosine'
}}
```

Note: Embeddings for `S_CORE_COMPONENT` nodes should be generated and stored during the
pipeline upload step (Step 6 — `upload-neo4j`). The embedding model is `text-embedding-3-large`
(dimension 3072), already deployed in Azure OpenAI (`oai-demo-multienv`).

**Python retriever (pseudocode):**

```python
from neo4j_graphrag.retrievers import VectorCypherRetriever
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.generation import GraphRAG

EXPANSION_CYPHER = """
MATCH (cc)<-[:SR_CONTAINS*1..2]-(sect:S_SECTION)<-[:SR_CONTAINS]-(law:CT_LAW)
OPTIONAL MATCH (cc)-[:SR_DEFINES]->(br:S_BUSINESS_RULE)
RETURN
  law.AT_ABBREVIATION  AS law_name,
  sect.AT_TITLE        AS section_title,
  cc.AT_TITLE          AS component_title,
  cc.AT_CONTENT        AS component_text,
  br.AT_NAME           AS rule_name,
  br.AT_CONTENT        AS rule_text,
  elementId(cc)        AS node_id
"""

retriever = VectorCypherRetriever(
    driver=neo4j_driver,
    index_name="idx_core_component_emb",
    embedder=azure_embedding_model,          # text-embedding-3-large
    retrieval_query=EXPANSION_CYPHER,
    result_formatter=format_context,
)

rag = GraphRAG(
    retriever=retriever,
    llm=gpt4o_llm,
    system_prompt=DRV_SYSTEM_PROMPT,
)

result = rag.search(query_text=user_question, retriever_config={"top_k": 10})
```

### 6.4 System Prompt

```
Du bist ein Compliance-Experte für die deutsche Rentenversicherung.
Beantworte Fragen ausschließlich auf Basis der bereitgestellten Gesetzestexte und Geschäftsregeln.
Wenn die Antwort nicht aus dem bereitgestellten Kontext ableitbar ist, sage:
"Diese Information ist im aktuellen Datenbestand nicht verfügbar."
Zitiere immer den Paragraphen und das Gesetz (z. B. "§ 35 SGB VI Abs. 1").
Antworte auf Deutsch in klarer, sachlicher Sprache.
```

### 6.5 Session Management (Persistent / Redis)

Sessions are stored in Redis with an **8-hour TTL** (one working day). A session stores:

```json
{
  "session_id": "abc123",
  "created_at": "2026-03-03T09:00:00Z",
  "last_active": "2026-03-03T14:23:00Z",
  "turns": [
    {"role": "user",      "content": "Unter welchen Voraussetzungen..."},
    {"role": "assistant", "content": "Nach § 35 SGB VI...", "citations": [...]}
  ]
}
```

Key decisions:
- **Session ID** is generated on first message and stored in browser `sessionStorage` + returned in every response cookie (`chat-session`)
- **Browser refresh** restores the session via the cookie → Redis lookup
- **Max turns in context window**: last 10 turns (to avoid token overflow)
- **Eviction**: Redis key expires after 8h inactivity (`EXPIRE session:<id> 28800`)
- **Infrastructure**: Redis instance reuses existing `redis` service in the shared namespace (or add a small `redis-demo-drv` deployment in namespace `demo-drv`)

```python
# Pseudocode — session load/save
class RedisSessionStore:
    def load(self, session_id: str) -> list[dict]:
        raw = self.redis.get(f"session:{session_id}")
        return json.loads(raw)["turns"] if raw else []

    def save(self, session_id: str, turns: list[dict]) -> None:
        self.redis.setex(
            f"session:{session_id}",
            28800,  # 8 hours TTL
            json.dumps({"turns": turns, "last_active": utcnow()}),
        )
```

### 6.6 REST API — Chat & Search (Implemented)

> **Source:** `graph-pipelines/src/graph_pipeline/api/`  
> **Start:** `uv run graph-cli serve [--port 8000] [--reload]`

The API is implemented with **FastAPI** and served via **uvicorn**.  
OpenAPI/Swagger documentation is auto-generated and available at runtime:

| URL | Description |
|-----|-------------|
| `http://<host>:8000/docs` | **Swagger UI** — interactive API explorer |
| `http://<host>:8000/redoc` | ReDoc — readable API reference |
| `http://<host>:8000/openapi.json` | Raw OpenAPI 3.1 schema |
| `http://<host>:8000/health` | Health check endpoint |

---

#### POST `/api/v1/chat` — Multi-Turn Chat

Stateful GraphRAG chat with Redis session persistence.

**Request:**
```json
{
  "message": "Welche Voraussetzungen gelten für Altersrente?",
  "session_id": null,
  "context": {
    "gesetz": "SGB VI",
    "paragraph": "§ 35"
  },
  "top_k": 10
}
```

- `session_id` — omit or `null` for new conversation; include the returned value in follow-up messages
- `context` — optional dashboard parameters (merged into retrieval query)
- `top_k` — number of vector-index candidates (1–50, default 10)

**Response:**
```json
{
  "session_id": "a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6",
  "answer": "Nach § 35 SGB VI haben Versicherte Anspruch auf Regelaltersrente, wenn sie...",
  "citations": [
    {
      "source": "SGB VI",
      "core_component": "Regelaltersrente",
      "br_name": "BR_SGB6_35_01",
      "process": "Rentenberechnung",
      "score": 0.93
    }
  ]
}
```

**Additional chat endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `DELETE` | `/api/v1/chat/{session_id}` | Delete session from Redis |
| `GET` | `/api/v1/chat/{session_id}/history` | Retrieve full conversation history |

---

#### POST `/api/v1/search` — Single-Turn Search

Stateless GraphRAG retrieval — no session, no history.

**Request:**
```json
{
  "query": "Unter welchen Voraussetzungen wird eine Erwerbsminderungsrente gewährt?",
  "top_k": 10,
  "context": { "gesetz": "SGB VI" }
}
```

**Response:**
```json
{
  "answer": "…",
  "query": "Unter welchen Voraussetzungen…",
  "citations": [
    {
      "source": "SGB VI",
      "core_component": "Erwerbsminderungsrente",
      "br_name": "BR_SGB6_43_01",
      "process": "Rentenberechnung",
      "score": 0.91
    }
  ]
}
```

---

#### API module layout

```
graph-pipelines/src/graph_pipeline/
├── api/
│   ├── app.py            # FastAPI factory, lifespan (Neo4j + Redis startup)
│   ├── deps.py           # Dependency injection helpers (get_search_service, get_chat_service)
│   └── routes/
│       ├── chat.py       # POST /api/v1/chat, DELETE /api/v1/chat/{id}, GET /…/history
│       └── search.py     # POST /api/v1/search
└── search/
    ├── retriever.py      # GraphRAG pipeline factory (VectorCypherRetriever)
    ├── service.py        # SearchService, ChatService, Citation, SearchResult, ChatResult
    └── session.py        # RedisSessionStore, SessionData
```

### 6.7 NeoDash Integration — Custom Chatbot Panel

The chatbot is integrated directly into NeoDash as a **custom chart extension** (not an iFrame).  
Source: `neodash/src/extensions/chatbot/`

| File | Purpose |
|------|--------|
| `ChatbotPanel.tsx` | React chat UI component (chat bubbles, citations, session storage) |
| `ChatbotActions.ts` | Redux actions for endpoint config |
| `ChatbotReducer.ts` | Redux state slice |
| `ChatbotSelector.ts` | Selectors for access from components |

The panel reads NeoDash parameters `neodash_gesetz` and `neodash_paragraph` automatically and sends them as `context` to `POST /api/v1/chat`.  
Citations are rendered inline in the chat bubble.  
The `session_id` is stored in React state and persisted across messages within a dashboard session.

```json
// NeoDash panel config (inside the dashboard JSON)
{
  "type": "graph_chatbot",
  "title": "KI-Assistent",
  "settings": {
    "chatEndpoint": "http://localhost:8000/api/v1/chat"
  }
}
```

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   GraphRAG Demo DRV Demo Namespace                   │
│  (Kubernetes namespace: demo, shared AKS aks-demo-multienv) │
│                                                              │
│  ┌──────────────┐   ┌───────────────────────────────────┐   │
│  │   NeoDash    │   │         Backend API               │   │
│  │  (existing)  │   │  ┌─────────────────────┐          │   │
│  │              │   │  │  /api/v1/search      │          │   │
│  │ ┌──────────┐ │   │  │  /api/v1/chat  (NEW) │          │   │
│  │ │ iFrame   │─┼───┼─►│  /api/chat-ui  (NEW) │          │   │
│  │ │ (Chat UI)│ │   │  └──────────┬────────────┘          │   │
│  └──────────────┘   │             │                       │   │
│                     │   ┌─────────▼──────────┐            │   │
│                     │   │  GraphRAG Service  │            │   │
│                     │   │  neo4j-graphrag    │            │   │
│                     │   │  VectorCypherRet.  │            │   │
│                     └───┴────────┬───────────┘────────────┘   │
│                                  │                             │
│  ┌─────────────────────────────  │  ─────────────────────┐    │
│  │              Neo4j (demo)     │                        │    │
│  │  CT_LAW ─► S_SECTION ─►      │                        │    │
│  │  S_CORE_COMPONENT  ◄──────── vector search             │    │
│  │       │                                               │    │
│  │       └─► S_BUSINESS_RULE ─► S_PROCESS                │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         │                  │
              Azure OpenAI (GPT-4o)    text-embedding-3-large
              oai-demo-multienv       oai-demo-multienv
```

---

## 8. Infrastructure — Demo Namespace

The demo runs as a new Kubernetes namespace on the existing shared AKS cluster.  
No new Azure resources are needed.

### 8.1 New Namespace

```yaml
# helm-charts/argocd-apps/demo-drv/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo-drv
  labels:
    environment: demo
    customer: drv
```

### 8.2 Applications Required (ArgoCD App-of-Apps)

| App | Source | Notes |
|-----|--------|-------|
| `neo4j-demo-drv` | existing neo4j chart | new PVC, demo data pre-loaded |
| `neodash-demo-drv` | existing neodash chart | DRV dashboard JSON mounted |
| `api-demo-drv` | existing api chart | add chatbot routes |

### 8.3 URL Routing (Application Gateway)

Add routes to the existing Application Gateway:

| Path prefix | Destination |
|-------------|-------------|
| `/demo/neodash` | `neodash-demo-drv` service |
| `/demo/api` | `api-demo-drv` service |
| `/demo/neo4j/browser` | `neo4j-demo-drv` service |

---

## 9. Work Packages & Priorities

### Phase 1 — Data & Graph (Sprint 1–2)

- [ ] **WP-1.1** Download core laws (SGB I, IV, VI, IX, X) via `fetch_laws.sh`
- [ ] **WP-1.2** Run full pipeline for each law (parse → extract → summaries → upload)
- [ ] **WP-1.3** Create Neo4j vector index `idx_core_component_emb`
- [ ] **WP-1.4** Validate graph completeness with demo Cypher queries
- [ ] **WP-1.5** Create Neo4j dump for demo namespace initialization

### Phase 2 — NeoDash Dashboard (Sprint 2–3)

- [ ] **WP-2.1** Design DRV-specific NeoDash dashboard (5 panels — see §5.2)
- [ ] **WP-2.2** Validate all Cypher queries with DRV demo data
- [ ] **WP-2.3** Export dashboard JSON → commit to `helm-charts/argocd-apps/neodash/dashboards/drv-demo.json`
- [ ] **WP-2.4** Deploy `demo-drv` namespace via ArgoCD

### Phase 3 — Chatbot / GraphRAG (Sprint 3–4)

- [x] **WP-3.1** Add `neo4j-graphrag`, `fastapi`, `uvicorn`, `redis` deps to `pyproject.toml`
- [x] **WP-3.2** Implement `POST /api/v1/chat` + `DELETE /api/v1/chat/{id}` + `GET /…/history`
- [x] **WP-3.2a** Implement `POST /api/v1/search` (single-turn, stateless)
- [x] **WP-3.3** Implement `VectorCypherRetriever` with `BR_RETRIEVAL_QUERY` traversal
- [x] **WP-3.4** Implement persistent session management (`RedisSessionStore`, TTL 8 h)
- [x] **WP-3.5** Swagger UI auto-generated at `/docs` and `/redoc`
- [x] **WP-3.6** NeoDash Custom Chart Extension (`graph_chatbot`)
- [x] **WP-3.6a** Add `graph-cli serve` subcommand for local development
- [ ] **WP-3.4a** Add `redis-demo-drv` deployment to `demo-drv` namespace
- [ ] **WP-3.7** End-to-end demo walkthrough test (Scenarios A–D)

### Phase 4 — Demo Readiness (Sprint 4)

- [ ] **WP-4.1** Load DRV GRA instructions (PDF) if received from customer
- [ ] **WP-4.2** Performance: ensure chatbot < 5 s P95 response time
- [ ] **WP-4.3** Access credentials stored in Key Vault (`neo4j-demo-drv-password`, etc.)
- [ ] **WP-4.4** Run demo walkthrough with product team — collect feedback

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| Q1 | Will DRV provide GRA PDFs for the demo? | DRV project stakeholder |
| Q2 | ✅ **Decided:** Persistent session storage — sessions survive browser refresh (Redis-backed, TTL 8h). | Product |
| Q3 | ✅ **Decided:** German only (`language: "de"` hardcoded; system prompt enforces Deutsch). | Product |
| Q4 | NeoDash iFrame vs. standalone chat page — preference? | UX |
| Q5 | Should `demo-drv` Neo4j be pre-loaded from a dump or re-run the pipeline? | DevOps |
