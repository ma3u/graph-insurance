# 📋 GraphRAG Demo — Wissensassistent für die Rentenversicherung

Interaktive 3D-Visualisierung eines Sozialrecht-Knowledge-Graphs mit GraphRAG und Chat-API. Demo-Anwendung zur Veranschaulichung von Knowledge Graphs und GraphRAG.

> **[▶ Live-App öffnen](https://ma3u.github.io/graph-insurance/)**

![Knoten](https://img.shields.io/badge/Knoten-65+-blue) ![Beziehungen](https://img.shields.io/badge/Beziehungen-90+-green) ![SGB](https://img.shields.io/badge/SGB-5%2B-orange) ![Chat API](https://img.shields.io/badge/Chat_API-OpenAI--kompatibel-brightgreen)

---

## Worum geht es?

Diese Demo zeigt, wie ein **Knowledge Graph** mit **GraphRAG** die Komplexität des Sozialrechts beherrschbar macht. Das Projekt veranschaulicht die **Multi-Layered Ontologie-Architektur** am Beispiel der Deutschen Rentenversicherung:

| Schicht | Name | Beschreibung |
|---------|------|-------------|
| 1 | **Normative Schicht** | Hierarchie der Rechtsquellen — EU-Recht, SGB I–XII, Rechtsverordnungen, GRA |
| 2 | **Zeitliche Dimension** | Übergangsregelungen (§235 SGB VI), Rentenanpassungen, stufenweise Anhebungen |
| 3 | **Prozedurale Schicht** | DRV-Geschäftsprozesse: Rentenantrag, EM-Prüfung, Reha, Widerspruchsverfahren |
| 4 | **Fallbezogener Overlay** | Versichertendaten: Entgeltpunkte, Wartezeiten, Gutachten, Bescheide |

## Features

- **Interaktiver 3D-Knowledge-Graph** — 65+ Knoten, 90+ Beziehungen, 10 Knotentypen (Gesetze, Paragraphen, Regeln, Prozesse, Entitäten, GRA, Chat-API-Standards)
- **Graph RAG vs. Vector RAG** — 4 konkrete Beispiele, wo Vector RAG bei gesetzesübergreifenden Fragen versagt
- **Chat-API nach Industriestandards** — OpenAI-kompatible API mit GraphRAG-Erweiterungen (Zitationen, Sessions)
- **Praxisszenarien** — Compliance-Analyse, Prozess-Engineering, Gesetzesfolgen-Analyse, Onboarding
- **Detailpanel** — Klick auf jeden Knoten zeigt Paragraphendetails, Geschäftsregeln, Querverweise
- **Standards & Compliance** — SGB I/IV/VI/IX/X, DSGVO, BSI IT-Grundschutz, GRA-Anweisungen
- **Responsive Design** — Optimiert für Desktop und Tablet

---

## tech Stack

| Technologie | Version | Zweck |
|-------------|---------|-------|
| React | 19 | UI-Framework |
| TypeScript | 5.7 | Typsicherheit |
| Vite | 7 | Build-Tool (SWC) |
| Tailwind CSS | 4 | Styling (oklch Farbsystem) |
| shadcn/ui | — | UI-Komponentenbibliothek (Radix UI) |
| react-force-graph-3d | 1.29 | 3D-Graph-Visualisierung |
| three.js | 0.175 | WebGL-Rendering |
| framer-motion | 12.6 | Animationen |

---

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/ma3u/graph-insurance.git
cd graph-insurance

# Abhängigkeiten installieren
npm ci

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:5173/graph-insurance/](http://localhost:5173/graph-insurance/) im Browser.

## Build & Deploy

```bash
npm run build     # Produktions-Build → dist/
npm run preview   # Vorschau des Builds
npm run lint      # ESLint
```

### GitHub Pages

Das Projekt wird automatisch via GitHub Actions deployed:
- Push auf `main` → Build → Deploy auf GitHub Pages
- URL: `https://ma3u.github.io/graph-insurance/`

---

## Graph RAG vs. Vector RAG

Die Landing Page zeigt 4 konkrete Beispiele, wo Vector RAG versagt:

| Beispiel | Problem bei Vector RAG | Graph RAG Lösung |
|----------|----------------------|-----------------|
| **Multi-Hop Rentenanspruch** | Verknüpft nicht §35 → §50 → §235 → §56 | Traversiert alle relevanten Paragraphen |
| **Gesetzesübergreifende Fristen** | Findet Reha-Fristen nicht in SGB X | Folgt Querverweisen über 3 Gesetze |
| **Ausnahmeregel §53** | Übersieht vorzeitige Wartezeiterfüllung | Erkennt Ausnahme via Graph-Kante |
| **Temporale Altersgrenze** | Gibt generisch 67 Jahre an | Hat strukturierte Übergangstabelle |

## Chat API

Die Demo implementiert eine OpenAI-kompatible Chat-API:

```
POST /api/v1/chat        # Multi-Turn Chat mit Session
POST /api/v1/search       # Single-Turn Search (stateless)
GET  /api/v1/chat/{id}/history  # Konversationsverlauf
DELETE /api/v1/chat/{id}  # Session löschen
GET  /docs                # Swagger UI
GET  /health              # Health Check
```

---

## Projektstruktur

```
src/
├── App.tsx                           # Haupt-SPA mit allen Sektionen
├── components/
│   ├── DRVKnowledgeGraph3D.tsx       # 3D-Graph (65+ Knoten, Sozialrecht)
│   └── ui/                           # 45 shadcn/ui-Komponenten
├── hooks/use-mobile.ts               # Mobile-Breakpoint-Hook
├── lib/utils.ts                      # cn() Utility
├── main.css                          # Tailwind v4, Design-Tokens
├── index.css                         # DRV-Farbschema (oklch)
└── styles/theme.css                  # Radix-Farbskalen
```

## Lizenz

[MIT](LICENSE)
