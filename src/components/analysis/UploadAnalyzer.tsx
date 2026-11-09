/**
 * Upload → AI extract → human review → calculate → save workflow.
 * The analyst uploads any supported document (PDF, Excel, CSV, TXT, JSON,
 * ZIP or an image); matching calculators are proposed with extracted
 * values, and results are calculated in real time as the analyst reviews the values.
 * Realtime sync keeps history updated across all open analyst tabs.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  Radio,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { CalculatorCard, type CalculatorCardResult } from "@/components/calculator/CalculatorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthSession } from "@/hooks/use-auth-session";
import { supabase } from "@/integrations/supabase/client";
import {
  ANALYSIS_BUCKET,
  ACCEPTED_UPLOAD,
  MAX_UPLOAD_BYTES,
  type AnalysisDTO,
  type Suggestion,
} from "@/lib/analysis/types";
import {
  analyzeUpload,
  deleteAnalysis,
  listAnalyses,
  saveReviewedAnalysis,
} from "@/lib/analysis/functions";
import { CALCULATORS, type CalculatorDef } from "@/lib/calculators/registry";
import { canExport, exportRunToExcel, printRunAsPdf } from "@/lib/analysis/export";

interface ReviewSelection {
  analysisId: string;
  calculatorId: string;
  baseValues: Record<string, string>;
}

/** Fill the calculator's fields from a suggestion, keeping only valid values. */
function prepareValues(def: CalculatorDef, provided: Record<string, string>): Record<string, string> {
  const v: Record<string, string> = {};
  for (const field of def.fields) {
    const raw = provided[field.key];
    if (field.type === "select") {
      const options = (field.options ?? []).map((option) => option.value);
      v[field.key] = raw && options.includes(raw) ? raw : (field.defaultValue ?? options[0] ?? "");
    } else {
      v[field.key] = typeof raw === "string" && raw.trim() !== "" ? raw : (field.defaultValue ?? "");
    }
  }
  return v;
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return "High match";
  if (confidence >= 0.5) return "Likely match";
  return "Possible match";
}

export function UploadAnalyzer() {
  const { user } = useAuthSession();
  const analyst = {
    name: String(user?.user_metadata?.display_name ?? ""),
    email: user?.email ?? "",
  };

  async function handleExcelExport(entry: AnalysisDTO) {
    try {
      const ok = await exportRunToExcel(entry, analyst);
      if (ok) toast.success("Excel report downloaded.");
      else toast.error("Only reviewed and saved runs can be exported.");
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Could not create the Excel report.");
    }
  }

  function handlePdfExport(entry: AnalysisDTO) {
    if (!printRunAsPdf(entry, analyst)) {
      toast.error("Could not open the PDF report.");
      return;
    }
    toast.message("In the print dialog, choose “Save as PDF”.");
  }
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [stepMessage, setStepMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisDTO | null>(null);
  const [review, setReview] = useState<ReviewSelection | null>(null);
  const [cardResult, setCardResult] = useState<CalculatorCardResult | null>(null);

  const history = useQuery({
    queryKey: ["analyses"],
    queryFn: () => listAnalyses(),
  });

  const invalidateHistory = () => {
    void queryClient.invalidateQueries({ queryKey: ["analyses"] });
  };

  // Real-time synchronization for analysis records
  useEffect(() => {
    const channel = supabase
      .channel("analyses-realtime-feed")
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

  function pickFile(next: File | null) {
    setError(null);
    setAnalysis(null);
    setReview(null);
    setCardResult(null);
    setStepMessage(null);
    if (next && next.size > MAX_UPLOAD_BYTES) {
      setError("That file is larger than 25 MB — please upload a smaller file.");
      return;
    }
    setFile(next);
  }

  async function handleUpload() {
    if (!file || !user) return;
    setBusy(true);
    setError(null);
    setStepMessage("Uploading document to secure storage…");
    try {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(ANALYSIS_BUCKET)
        .upload(path, file);
      if (uploadError) {
        setError("The file could not be uploaded. Please try again.");
        return;
      }

      setStepMessage("Parsing document & extracting laboratory parameters…");
      const result = await analyzeUpload({ data: { path, fileName: file.name, mimeType: file.type } });
      if (!result.ok) {
        setError(result.error);
        void supabase.storage.from(ANALYSIS_BUCKET).remove([path]);
        return;
      }
      setAnalysis(result.analysis);
      toast.success("Extraction ready — review the values before calculating.");
      invalidateHistory();
    } finally {
      setBusy(false);
      setStepMessage(null);
    }
  }

  function openReview(entry: AnalysisDTO, suggestion: Suggestion | null) {
    const calculatorId = suggestion?.calculatorId ?? entry.calculatorId;
    const def = CALCULATORS.find((calc) => calc.id === calculatorId);
    if (!def) return;
    const provided = suggestion ? suggestion.values : (entry.values ?? {});
    setReview({ analysisId: entry.id, calculatorId: def.id, baseValues: prepareValues(def, provided) });
    setCardResult(null);
    setAnalysis(entry);
    document.getElementById("review-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!review || !cardResult) throw new Error("Nothing to save yet.");
      return saveReviewedAnalysis({
        data: {
          id: review.analysisId,
          calculatorId: review.calculatorId,
          values: cardResult.values,
          outputs: cardResult.outputs,
          verdicts: cardResult.verdicts,
        },
      });
    },
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Saved to your history.");
        setAnalysis(null);
        setReview(null);
        setCardResult(null);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        invalidateHistory();
      } else {
        toast.error(result.error ?? "Could not save to your history.");
      }
    },
    onError: () => toast.error("Could not save to your history."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnalysis({ data: { id } }),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Removed from your history.");
        invalidateHistory();
      } else {
        toast.error(result.error ?? "Could not delete this entry.");
      }
    },
    onError: () => toast.error("Could not delete this entry."),
  });

  const reviewDef = review ? CALCULATORS.find((calc) => calc.id === review.calculatorId) : null;
  const hasOutputs = Boolean(cardResult && Object.keys(cardResult.outputs).length > 0);

  return (
    <div className="flex flex-col gap-8">
      {/* ------------------------------- upload ------------------------------- */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Upload a document</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Certificates of analysis, chromatography reports, weighing records, spreadsheets or
                archives. PDF, Excel, CSV, TXT, JSON, ZIP and images up to 25 MB.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Radio className="mr-1 h-3 w-3 animate-pulse" /> Real-time active
              </Badge>
              <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
                <Sparkles className="mr-1 h-3 w-3" /> QC Extraction
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_UPLOAD}
              className="max-w-sm cursor-pointer"
              onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
            />
            <Button onClick={handleUpload} disabled={!file || busy}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {busy ? "Analyzing document…" : "Upload & analyse"}
            </Button>
          </div>

          {stepMessage ? (
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{stepMessage}</span>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* ----------------------------- suggestions ---------------------------- */}
      {analysis ? (
        <div id="review-anchor" className="flex scroll-mt-24 flex-col gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    What was found in “{analysis.fileName}”
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysis.suggestions.length > 0 ? (
            <div className="grid gap-4">
              {analysis.suggestions.map((suggestion, index) => {
                const def = CALCULATORS.find((calc) => calc.id === suggestion.calculatorId);
                if (!def) return null;
                const missing = def.fields
                  .filter((field) => !(field.key in suggestion.values))
                  .map((field) => field.label);
                return (
                  <Card key={`${suggestion.calculatorId}-${index}`}>
                    <CardContent className="flex flex-col gap-3 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {def.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{def.summary}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {confidenceLabel(suggestion.confidence)}
                          </Badge>
                          <Button size="sm" onClick={() => openReview(analysis, suggestion)}>
                            Review & calculate
                          </Button>
                        </div>
                      </div>
                      {Object.keys(suggestion.values).length > 0 ? (
                        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                          {Object.entries(suggestion.values).map(([key, value]) => {
                            const field = def.fields.find((f) => f.key === key);
                            return (
                              <li key={key} className="text-muted-foreground">
                                {field?.label ?? key}:{" "}
                                <span className="font-medium text-foreground">
                                  {value}
                                  {field?.unit ? ` ${field.unit}` : ""}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                      {missing.length > 0 ? (
                        <p className="text-xs leading-snug text-muted-foreground">
                          Not found in the document (you can fill these in during review):{" "}
                          {missing.join(", ")}.
                        </p>
                      ) : null}
                      {suggestion.notes ? (
                        <p className="text-xs italic leading-snug text-muted-foreground">{suggestion.notes}</p>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
              No calculator matched this document. If it should match one, check that the values are
              readable and try again, or enter them manually in the calculator tabs.
            </p>
          )}
        </div>
      ) : null}

      {/* ------------------------------- review ------------------------------- */}
      {review && reviewDef ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Review the extracted values
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Correct anything the extraction got wrong — results are calculated live as you type.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={review.calculatorId}
                onValueChange={(value) => {
                  const def = CALCULATORS.find((calc) => calc.id === value);
                  if (def && analysis) {
                    openReview(analysis, { calculatorId: def.id, confidence: 1, values: {}, notes: "" });
                  }
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Calculator" />
                </SelectTrigger>
                <SelectContent>
                  {CALCULATORS.map((calc) => (
                    <SelectItem key={calc.id} value={calc.id}>
                      {calc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!hasOutputs || saveMutation.isPending}
              >
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save to history
              </Button>
            </div>
          </div>
          <CalculatorCard
            key={`${review.analysisId}-${review.calculatorId}`}
            def={reviewDef}
            initialValues={review.baseValues}
            onChange={setCardResult}
          />
        </div>
      ) : null}

      {/* ------------------------------- history ------------------------------ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Your history</h2>
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

        {history.isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (history.data?.analyses.length ?? 0) === 0 ? (
          <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            Nothing saved yet — uploaded documents and reviewed runs will appear here automatically.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Calculator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Saved</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.data?.analyses.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="max-w-48 truncate font-medium" title={entry.fileName}>
                      {entry.fileName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {CALCULATORS.find((calc) => calc.id === entry.calculatorId)?.title ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          entry.status === "reviewed"
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-border text-muted-foreground"
                        }
                      >
                        {entry.status === "reviewed" ? "Reviewed" : "Extracted"}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {(entry.suggestions.length > 0 || (entry.status === "reviewed" && entry.values)) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => openReview(entry, entry.suggestions[0] ?? null)}
                          >
                            Review
                          </Button>
                        )}
                        {canExport(entry) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground"
                              aria-label={`Download Excel report for ${entry.fileName}`}
                              title="Download Excel report"
                              onClick={() => void handleExcelExport(entry)}
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground"
                              aria-label={`Save PDF report for ${entry.fileName}`}
                              title="Save PDF report"
                              onClick={() => handlePdfExport(entry)}
                            >
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          aria-label={`Delete ${entry.fileName}`}
                          onClick={() => deleteMutation.mutate(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
