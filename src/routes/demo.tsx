import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";
import { useEffect, useState } from "react";

import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CALCULATORS,
  CATEGORY_META,
  calculatorsByCategory,
  type CalculatorCategory,
  type CalculatorDef,
} from "@/lib/calculators/registry";

const DEMO_CATEGORIES: CalculatorCategory[] = ["assay-potency", "dilution-preparation"];

export const Route = createFileRoute("/demo")({
  // Interactive widget; the calculators themselves are client-side only.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { calc?: string } =>
    typeof search["calc"] === "string" ? { calc: search["calc"] } : {},
  head: () => ({
    meta: [
      { title: "Try the Calculator (no sign-up) | Qubits Private Limited" },
      {
        name: "description",
        content:
          "Try the Qubits assay, potency, dilution and preparation calculators without an account. Nothing you enter is saved or uploaded.",
      },
    ],
  }),
  component: DemoPage,
});

function pickCalculator(id: string | undefined): CalculatorDef {
  const found = CALCULATORS.find((calc) => calc.id === id);
  if (found) return found;
  const [first] = CALCULATORS;
  if (!first) throw new Error("No calculators are registered.");
  return first;
}

function DemoPage() {
  const { calc } = Route.useSearch();
  const [selectedId, setSelectedId] = useState(() => pickCalculator(calc).id);

  useEffect(() => {
    if (calc) setSelectedId(pickCalculator(calc).id);
  }, [calc]);

  const def = pickCalculator(selectedId);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Try the calculator
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Pick a calculation and enter your own numbers. Results update live and are checked
          against the acceptance limits as you type.
        </p>
      </header>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm leading-relaxed text-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          This is a demo: nothing you enter is saved, uploaded or sent to a server. Create a free
          account to save runs, upload documents, review trends and export reports. Results are
          decision support only — verify them against your approved procedures.
        </p>
      </div>

      <div className="mt-8 flex max-w-md flex-col gap-1.5">
        <label htmlFor="demo-calculator" className="text-sm font-medium text-foreground">
          Calculation
        </label>
        <Select value={def.id} onValueChange={setSelectedId}>
          <SelectTrigger id="demo-calculator" className="w-full">
            <SelectValue placeholder="Choose a calculation" />
          </SelectTrigger>
          <SelectContent>
            {DEMO_CATEGORIES.map((category) => (
              <SelectGroup key={category}>
                <SelectLabel>{CATEGORY_META[category].label}</SelectLabel>
                {calculatorsByCategory(category).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <CalculatorCard key={def.id} def={def} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link to="/auth" search={{ mode: "signup" }}>
            Create an account <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/formulas" hash={def.id}>
            See how this is calculated
          </Link>
        </Button>
      </div>
    </div>
  );
}
