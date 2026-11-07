import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Scale, TrendingUp, Upload } from "lucide-react";

import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { TrendReviewPanel } from "@/components/analysis/TrendReviewPanel";
import { UploadAnalyzer } from "@/components/analysis/UploadAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORY_META,
  calculatorsByCategory,
  type CalculatorCategory,
} from "@/lib/calculators/registry";

const TOOL_WORKFLOWS = ["assay-potency", "dilution-preparation", "upload", "trend"] as const;
type ToolWorkflow = (typeof TOOL_WORKFLOWS)[number];

function validateWorkflow(value: unknown): ToolWorkflow {
  return TOOL_WORKFLOWS.find((workflow) => workflow === value) ?? "assay-potency";
}

export const Route = createFileRoute("/_authenticated/tools")({
  validateSearch: (search: Record<string, unknown>) => ({
    workflow: validateWorkflow(search["workflow"]),
  }),
  head: () => ({
    meta: [
      {
        title: "Lab Calculator & Trend Review | Assay, Potency, Dilution | Qubits Private Limited",
      },
      {
        name: "description",
        content:
          "Upload certificates and reports, review AI-extracted values, calculate against IPC limits and review trends across your saved assay & potency runs.",
      },
      {
        property: "og:title",
        content: "Lab Calculator & Trend Review | Qubits Private Limited",
      },
      {
        property: "og:description",
        content:
          "Assay & potency and dilution & preparation calculators with document upload, saved runs and AI trend review.",
      },
    ],
  }),
  component: ToolsPage,
});

const CATEGORY_ICONS: Record<CalculatorCategory, typeof FlaskConical> = {
  "assay-potency": FlaskConical,
  "dilution-preparation": Scale,
};

const TABS = [
  { value: "assay-potency", icon: FlaskConical, label: CATEGORY_META["assay-potency"].label },
  {
    value: "dilution-preparation",
    icon: Scale,
    label: CATEGORY_META["dilution-preparation"].label,
  },
  { value: "upload", icon: Upload, label: "Upload & analyse" },
  { value: "trend", icon: TrendingUp, label: "Trend review" },
] as const;

function ToolsPage() {
  const { workflow } = Route.useSearch();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Lab calculator
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Every formula runs live from a single, extensible registry — add a new method and the
          tool picks it up. Results are checked against the IPC acceptance limits as you type, and
          everything you save stays in your private history.
        </p>
      </header>

      <Tabs defaultValue={workflow} className="mt-8 gap-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary/60 p-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.value === "assay-potency" || tab.value === "dilution-preparation"
                ? calculatorsByCategory(tab.value).length
                : null;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {count ? (
                  <span className="rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                    {count}
                  </span>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(["assay-potency", "dilution-preparation"] as CalculatorCategory[]).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {CATEGORY_META[category].blurb}
            </p>
            <div className="grid gap-6 xl:grid-cols-2">
              {calculatorsByCategory(category).map((def) => (
                <CalculatorCard key={def.id} def={def} />
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="upload" className="mt-0">
          <UploadAnalyzer />
        </TabsContent>

        <TabsContent value="trend" className="mt-0">
          <TrendReviewPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
