# Qubits Private Limited — Lab Calculator Suite

A modern, real-time quality control (QC) calculation platform built for pharmaceutical laboratories conforming to Indian Pharmacopoeia standards (IPC/GD/09).

## Key Capabilities

- **Real-Time Lab Calculations**: Instant, dynamic recalculation and IPC compliance verdict checking as you type (HPLC assay, titration, bioassay potency, stock dilution, target normality).
- **Document Extraction**: Upload certificates of analysis, chromatography reports, weighing records, and spreadsheets (PDF, Excel, CSV, TXT, JSON, ZIP, images) with automated parameter extraction.
- **Human-in-the-Loop Review**: Extracted values are presented for review against IPC limits before committing to history.
- **AI Trend Analysis**: Cross-batch chronology review across saved assay and potency runs to identify drift, variability (RSD), and suggested follow-up checks.
- **Real-Time Data Sync**: Supabase Realtime synchronization keeps analysis history, reviewed runs, and trend evaluations synchronized live across all active laboratory sessions and analyst workstations.

## Technology Stack

- **Framework**: TanStack Start (SSR) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Radix UI + Lucide Icons
- **Backend & Auth**: Supabase (PostgreSQL, Storage, Realtime, Auth with RLS)
- **Data Querying**: TanStack React Query with real-time invalidation
- **Bundler**: Vite 8 + Nitro

## Getting Started

### Prerequisites

- Node.js (v20+) or Bun (v1.1+)
- Supabase project credentials

### Environment Configuration

Create or update `.env` in the root directory:

```env
SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<your-publishable-key>"
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-publishable-key>"

# Optional: OpenAI or compatible API key for enhanced LLM extraction and trend analysis
OPENAI_API_KEY="sk-..."
AI_MODEL="gpt-4o-mini"
```

### Installation & Run

Using Bun:
```sh
bun install
bun run dev
```

Or using npm:
```sh
npm install
npm run dev
```

Visit `http://localhost:8080` (or the port specified in terminal) in your browser.

### Testing & Building

Run the unit and integration tests:
```sh
bun run test
```

Create an optimized production build:
```sh
bun run build
```
