import { BarChart3, CheckCircle2, FileSearch, FlaskConical, Home, TrendingUp, Upload } from "lucide-react";

const RESULT_ROWS = [
  { id: "AS-2411-082", method: "Assay · HPLC", result: "99.5%", verdict: "Pass" },
  { id: "AS-2411-083", method: "Assay · HPLC", result: "98.1%", verdict: "Pass" },
  { id: "PT-2411-014", method: "Potency · UV", result: "101.9%", verdict: "Watch" },
  { id: "AS-2411-084", method: "Assay · HPLC", result: "97.2%", verdict: "Pass" },
  { id: "DP-2411-006", method: "Dilution prep", result: "0.5 mg/mL", verdict: "Pass" },
  { id: "AS-2411-085", method: "Assay · HPLC", result: "94.3%", verdict: "OOS" },
] as const;

const VERDICT_STYLES: Record<string, string> = {
  Pass: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  OOS: "bg-red-100 text-red-700",
};

const TREND_POINTS = "0,34 14,30 28,33 42,26 56,28 70,22 84,24 98,16 112,19 126,12";

function Sparkline() {
  return (
    <svg viewBox="0 0 126 40" className="h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.66 0.16 148)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.66 0.16 148)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${TREND_POINTS} 126,40 0,40`} fill="url(#trend-fill)" />
      <polyline points={TREND_POINTS} fill="none" stroke="oklch(0.50 0.155 252)" strokeWidth="2" strokeLinecap="round" />
      <line x1="0" y1="10" x2="126" y2="10" stroke="oklch(0.577 0.245 27.325)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="0" y1="34" x2="126" y2="34" stroke="oklch(0.63 0.16 150)" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

const SIDEBAR_ICONS = [Home, Upload, FileSearch, FlaskConical, BarChart3, TrendingUp];

/**
 * Static, presentational mock of the Qubits lab console used in the hero.
 * Deliberately not interactive — the real product lives at /tools.
 */
export function DashboardMockup() {
  return (
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-card text-card-foreground shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-secondary/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />
          <span className="font-display text-xs font-bold tracking-wide text-foreground">QUBITS LAB CONSOLE</span>
        </div>
        <div className="hidden flex-1 items-center sm:flex">
          <span className="w-full rounded-md border border-border/70 bg-background px-3 py-1 text-[11px] text-muted-foreground">
            Search samples, methods, runs…
          </span>
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
          AN
        </span>
      </div>

      <p className="border-b border-border/70 bg-amber-50 px-4 py-1 text-center text-[10px] font-medium text-amber-800">
        Illustrative sample data — not real lab results
      </p>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden flex-col items-center gap-1 border-r border-border/70 bg-secondary/40 px-2 py-3 sm:flex">
          {SIDEBAR_ICONS.map((Icon, i) => (
            <span
              key={i}
              className={`grid h-8 w-8 place-items-center rounded-lg ${
                i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>

        {/* Main panel */}
        <div className="min-w-0 flex-1 space-y-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Samples today", "24"],
              ["Pass rate", "96%"],
              ["Review queue", "3"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border/70 bg-background px-3 py-2">
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
                <p className="font-display text-lg font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-border/70">
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/50 px-3 py-1.5">
              <span className="text-[11px] font-semibold text-foreground">Recent results</span>
              <span className="text-[10px] text-muted-foreground">IPC limits applied</span>
            </div>
            <div className="divide-y divide-border/60">
              {RESULT_ROWS.map((row) => (
                <div key={row.id} className="flex items-center gap-2 px-3 py-1.5 text-[11px]">
                  <span className="w-24 shrink-0 font-medium text-foreground">{row.id}</span>
                  <span className="hidden min-w-0 flex-1 truncate text-muted-foreground sm:block">{row.method}</span>
                  <span className="ml-auto font-semibold text-foreground">{row.result}</span>
                  <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${VERDICT_STYLES[row.verdict]}`}>
                    {row.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">Trend · Assay % label claim</span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-brand-green-deep">
                <CheckCircle2 className="h-3 w-3" /> AI reviewed
              </span>
            </div>
            <Sparkline />
          </div>
        </div>
      </div>
    </div>
  );
}
