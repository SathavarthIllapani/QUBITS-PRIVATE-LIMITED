/**
 * AI trend review over reviewed assay & potency runs.
 * The analyst selects saved runs; the model summarises the trend, flags
 * unusual shifts and suggests follow-up checks — always for human review.
 * Realtime synchronization keeps reviewed runs and trend reports updated live.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Radio, TrendingUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { isTrendEligible } from "@/lib/analysis/trend-select";
import type { TrendFlag, TrendReviewDTO } from "@/lib/analysis/types";
import {
  generateTrendReview,
  listTrendReviews,
  TREND_LIMITS,
  deleteTrendReview,
} from "@/lib/analysis/trend.functions";
import { listAnalyses } from "@/lib/analysis/functions";
import { CALCULATORS } from "@/lib/calculators/registry";
import { supabase } from "@/integrations/supabase/client";

const severityStyles: Record<TrendFlag["severity"], string> = {
  normal: "border-success/40 bg-success/10 text-foreground",
  watch: "border-warning/50 bg-warning/15 text-warning-foreground",
  unusual: "border-destructive/40 bg-destructive/10 text-destructive",
};

const severityLabel: Record<TrendFlag["severity"], string> = {
  normal: "Normal",
  watch: "Watch",
  unusual: "Unusual",
};

export function TrendReviewPanel() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState<TrendReviewDTO | null>(null);

  const history = useQuery({ queryKey: ["analyses"], queryFn: () => listAnalyses() });
  const reviews = useQuery({ queryKey: ["trend-reviews"], queryFn: () => listTrendReviews() });

  const candidates = (history.data?.analyses ?? []).filter(isTrendEligible);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["trend-reviews"] });
  };

  // Real-time synchronization for trend reviews and underlying analyses
  useEffect(() => {
    const channel = supabase
      .channel("trend-reviews-realtime-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trend_reviews",
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["trend-reviews"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "analyses",
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["analyses"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const generate = useMutation({
    mutationFn: (ids: string[]) => generateTrendReview({ data: { ids } }),
    onSuccess: (result) => {
      if (result.ok) {
        setActive(result.review);
        invalidate();
        toast.success("Trend review ready — please check it yourself before acting on it.");
      } else {
        toast.error(result.error ?? "The trend review could not be generated.");
      }
    },
    onError: () => toast.error("The trend review could not be generated. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTrendReview({ data: { id } }),
    onSuccess: (result, id) => {
      if (result.ok) {
        setActive((current) => (current?.id === id ? null : current));
        invalidate();
        toast.success("Trend review deleted.");
      } else {
        toast.error(result.error ?? "Could not delete this trend review.");
      }
    },
    onError: () => toast.error("Could not delete this trend review."),
  });

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function generateReport() {
    generate.mutate(selected);
  }

  if (history.isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ------------------------------ selection ----------------------------- */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-2xl">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Select reviewed assay & potency runs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick {TREND_LIMITS.MIN_RUNS}–{TREND_LIMITS.MAX_RUNS} reviewed runs in chronological
                order. Dilution & preparation runs and unreviewed extractions are never included.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Radio className="mr-1 h-3 w-3 animate-pulse" /> Real-time active
              </Badge>
              <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
                {selected.length}/{TREND_LIMITS.MAX_RUNS} selected
              </Badge>
            </div>
          </div>

          {candidates.length === 0 ? (
            <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
              No eligible runs yet. Review and save at least two assay & potency runs in the
              “Upload &amp; analyse” tab, then come back here.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {candidates.map((entry) => {
                const def = CALCULATORS.find((calc) => calc.id === entry.calculatorId);
                return (
                  <li key={entry.id}>
                    <Label
                      htmlFor={`run-${entry.id}`}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/40 p-3 transition-colors hover:bg-secondary"
                    >
                      <Checkbox
                        id={`run-${entry.id}`}
                        className="mt-0.5"
                        checked={selected.includes(entry.id)}
                        onCheckedChange={() => toggle(entry.id)}
                        disabled={
                          !selected.includes(entry.id) && selected.length >= TREND_LIMITS.MAX_RUNS
                        }
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {entry.fileName}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {def?.title ?? entry.calculatorId} ·{" "}
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    </Label>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={generateReport}
              disabled={selected.length < TREND_LIMITS.MIN_RUNS || generate.isPending}
            >
              {generate.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="mr-2 h-4 w-4" />
              )}
              {generate.isPending ? "Reviewing trends…" : "Generate trend review"}
            </Button>
            {selected.length > 0 && selected.length < TREND_LIMITS.MIN_RUNS ? (
              <span className="text-xs text-muted-foreground">
                Select at least {TREND_LIMITS.MIN_RUNS} runs for a trend.
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------- report ------------------------------- */}
      {active ? (
        <Card className="overflow-hidden pt-0">
          <div className="brand-gradient h-1.5 w-full" />
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Trend summary</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{active.report.summary}</p>
              </div>
            </div>

            {active.report.flags.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {active.report.flags.map((flag, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${severityStyles[flag.severity]}`}
                  >
                    <Badge
                      variant="outline"
                      className="mt-0.5 h-5 shrink-0 border-current px-1.5 text-[10px] font-semibold uppercase"
                    >
                      {flag.severity === "unusual" ? (
                        <AlertTriangle className="mr-0.5 h-3 w-3" />
                      ) : null}
                      {severityLabel[flag.severity]}
                    </Badge>
                    <span className="leading-snug">
                      <span className="font-medium">{flag.metric}</span> — {flag.detail}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {active.report.followUps.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Suggested follow-up checks
                </h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {active.report.followUps.map((item, index) => (
                    <li key={index} className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="block leading-snug text-muted-foreground">{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="text-xs leading-snug text-muted-foreground">
              Generated {new Date(active.createdAt).toLocaleString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · This summary is decision support only — verify every point against the raw data
              before acting on it.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* --------------------------- past reviews ----------------------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Past trend reviews</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Real-time sync active
            </span>
          </div>
        </div>

        {reviews.isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (reviews.data?.reviews.length ?? 0) === 0 ? (
          <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            No trend reviews yet — generated summaries will be kept here and synced in real time.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {reviews.data?.reviews.map((entry) => (
              <li key={entry.id}>
                <Card>
                  <CardContent className="flex flex-col gap-2 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {entry.report.summary.length > 160
                          ? `${entry.report.summary.slice(0, 160)}…`
                          : entry.report.summary}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                        aria-label="Delete trend review"
                        onClick={() => deleteMutation.mutate(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {" · "}
                        {entry.analysisIds.length} runs ·{" "}
                        {entry.report.flags.filter((flag) => flag.severity === "unusual").length} unusual
                      </span>
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                        onClick={() => {
                          setActive(entry);
                          document
                            .getElementById("trend-report-anchor")
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <span id="trend-report-anchor" className="sr-only scroll-mt-24" />
    </div>
  );
}
