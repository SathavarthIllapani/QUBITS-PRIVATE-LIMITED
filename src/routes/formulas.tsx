import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_META,
  calculatorsByCategory,
  type CalculatorCategory,
} from "@/lib/calculators/registry";

const FORMULA_CATEGORIES: CalculatorCategory[] = ["assay-potency", "dilution-preparation"];

export const Route = createFileRoute("/formulas")({
  head: () => ({
    meta: [
      { title: "Formulas and References | Qubits Lab Calculator" },
      {
        name: "description",
        content:
          "Every calculation in the Qubits Lab Calculator: formulas, required inputs, outputs and the IPC reference each one follows.",
      },
      { property: "og:title", content: "Formulas and References | Qubits Lab Calculator" },
      {
        property: "og:description",
        content: "Transparent formulas, inputs and references for pharmaceutical QC calculations.",
      },
    ],
    links: [{ rel: "canonical", href: "https://qubitsprivatelimited.vercel.app/formulas" }],
  }),
  component: FormulasPage,
});

function FormulasPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Formulas and references
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Analysts should be able to see exactly how a number was produced. This page is generated
          from the same registry the calculator runs on, so it always matches what the tool does.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The Lab Calculator is decision support. Always verify results against your original
          records and approved procedures.
        </p>
      </header>

      {FORMULA_CATEGORIES.map((category) => (
        <section key={category} className="mt-12">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {CATEGORY_META[category].label}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {CATEGORY_META[category].blurb}
          </p>

          <div className="mt-6 space-y-8">
            {calculatorsByCategory(category).map((def) => (
              <article
                key={def.id}
                id={def.id}
                className="scroll-mt-24 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {def.title}
                  </h3>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {def.reference}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{def.summary}</p>

                {def.formula ? (
                  <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs leading-relaxed text-secondary-foreground">
                    {def.formula}
                  </p>
                ) : null}

                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Inputs
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                      {def.fields.map((field) => (
                        <li key={field.key}>
                          {field.label}
                          {field.unit ? (
                            <span className="text-muted-foreground"> ({field.unit})</span>
                          ) : null}
                          {field.help ? (
                            <span className="block text-xs text-muted-foreground">
                              {field.help}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Outputs
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                      {def.outputs.map((output) => (
                        <li key={output.key}>
                          {output.label}
                          {output.unit ? (
                            <span className="text-muted-foreground"> ({output.unit})</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/demo" search={{ calc: def.id }}>
                      Try this calculation
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
