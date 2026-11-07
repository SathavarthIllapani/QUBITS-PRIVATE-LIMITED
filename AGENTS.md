# Agent Guidelines for Qubits Private Limited

This repository contains the pharmaceutical quality control calculation suite for Qubits Private Limited.

## Core Directives

1. **Calculations & Registry**:
   - Every formula in `src/lib/calculators/registry.ts` adheres to Indian Pharmacopoeia (IPC/GD/09) standards.
   - Acceptance limits and verdicts must remain grounded in validated pharmacopoeial standards.
   - Any added calculator must define its inputs, outputs, formula description, reference standard, and automated verdict evaluation.

2. **Real-Time Data Flow**:
   - All client data subscriptions leverage Supabase Realtime channels (`postgres_changes`) to guarantee instant multi-tab and team sync.
   - State mutations must trigger immediate local query invalidations alongside real-time broadcasts.

3. **Homepage Structure**:
   - Keep the product homepage as a single scrolling page with in-page anchors (`#overview`, `#calculators`, `#features`, `#contact`).
