# Project Roadmap — Qubits Private Limited

## Completed Milestones

### Pharma QC Homepage & Design
- [x] Dark calculator-led landing page with responsive preview
- [x] Capability cards, analyst workflow diagrams, method comparison tables, and compliance details
- [x] Brand metadata and shared navigation

### Quality Control Suite & Document Extraction
- [x] Supabase Auth, PostgreSQL schema, RLS policies, and secure document storage bucket (`analysis-documents`)
- [x] Multi-format document parser (`src/lib/analysis/parse.server.ts` — PDF, Excel, CSV, TXT, JSON, ZIP, images)
- [x] AI extraction server functions (`src/lib/analysis/functions.ts`) with intelligent local heuristic fallback
- [x] `/auth` sign-in/sign-up & password recovery flows
- [x] `/tools` protected analytical workspace with category tabs (Assay & Potency, Dilution & Preparation, Upload & Analyse, Trend Review)
- [x] Upload → Extract → Review pipeline (`UploadAnalyzer`) with live field corrections and per-user historical records
- [x] Cross-batch AI Trend Review (`TrendReviewPanel`) with statistical metric calculations, sequence drift alerts, and suggested laboratory follow-ups
- [x] Real-time Supabase subscriptions for live collaboration across lab workstations and browser sessions
