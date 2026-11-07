import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

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
import {
  type CalculatorDef,
  type Verdict,
} from "@/lib/calculators/registry";

const verdictStyles: Record<Verdict["status"], string> = {
  pass: "border-success/40 bg-success/10 text-foreground",
  fail: "border-destructive/40 bg-destructive/10 text-destructive",
  warn: "border-warning/50 bg-warning/15 text-warning-foreground",
  info: "border-border bg-muted/60 text-muted-foreground",
};

const verdictLabel: Record<Verdict["status"], string> = {
  pass: "Pass",
  fail: "Fail",
  warn: "Review",
  info: "Note",
};

/** Snapshot of the live calculation, reported back to the parent on every change. */
export interface CalculatorCardResult {
  values: Record<string, string>;
  outputs: Record<string, number | string | null>;
  verdicts: Verdict[];
}

export function CalculatorCard({
  def,
  initialValues,
  onChange,
}: {
  def: CalculatorDef;
  initialValues?: Record<string, string>;
  onChange?: (result: CalculatorCardResult) => void;
}) {
  const defaults = useMemo(() => {
    const v: Record<string, string> = {};
    for (const field of def.fields) v[field.key] = field.defaultValue ?? "";
    return v;
  }, [def]);
  const base = useMemo(() => initialValues ?? defaults, [initialValues, defaults]);
  const [values, setValues] = useState<Record<string, string>>(base);
  const result = useMemo(() => def.compute(values), [def, values]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  useEffect(() => {
    onChangeRef.current?.({ values, outputs: result.outputs, verdicts: result.verdicts });
  }, [values, result]);

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <Card className="overflow-hidden pt-0">
      <div className="brand-gradient h-1.5 w-full" />
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {def.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{def.summary}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live Calc
            </Badge>
            <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
              {def.reference}
            </Badge>
          </div>
        </div>

        {def.formula ? (
          <p className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs leading-relaxed text-secondary-foreground">
            {def.formula}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {def.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`${def.id}-${field.key}`} className="text-sm font-medium">
                {field.label}
                {field.unit ? (
                  <span className="ml-1 font-normal text-muted-foreground">({field.unit})</span>
                ) : null}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={values[field.key] ?? ""}
                  onValueChange={(value) => setValue(field.key, value)}
                >
                  <SelectTrigger id={`${def.id}-${field.key}`} className="w-full">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`${def.id}-${field.key}`}
                  type={field.type === "number" ? "number" : "text"}
                  inputMode={field.type === "number" ? "decimal" : undefined}
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(event) => setValue(field.key, event.target.value)}
                />
              )}
              {field.help ? (
                <p className="text-xs leading-snug text-muted-foreground">{field.help}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Result
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
              onClick={() => setValues(base)}
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
            {def.outputs.map((output) => {
              const raw = result.outputs[output.key];
              const display =
                typeof raw === "number"
                  ? raw.toFixed(output.decimals ?? 2)
                  : raw !== null && raw !== undefined
                    ? String(raw)
                    : "—";
              return (
                <div
                  key={output.key}
                  className={output.multiline ? "min-w-full" : "min-w-0"}
                >
                  <span className="block text-xs text-muted-foreground">{output.label}</span>
                  {output.multiline ? (
                    <pre className="mt-1 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                      {display}
                    </pre>
                  ) : (
                    <span
                      className={
                        output.primary
                          ? "font-display text-3xl font-bold text-primary"
                          : "font-display text-xl font-semibold text-foreground"
                      }
                    >
                      {display}
                      {output.unit && display !== "—" ? (
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          {output.unit}
                        </span>
                      ) : null}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {result.verdicts.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {result.verdicts.map((verdict, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${verdictStyles[verdict.status]}`}
                >
                  <Badge
                    variant="outline"
                    className="mt-0.5 h-5 shrink-0 border-current px-1.5 text-[10px] font-semibold uppercase"
                  >
                    {verdictLabel[verdict.status]}
                  </Badge>
                  <span className="leading-snug">{verdict.message}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
