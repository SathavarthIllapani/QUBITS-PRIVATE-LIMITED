import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ClipboardCheck,
  FileSearch,
  FlaskConical,
  Scale,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardMockup } from "@/components/home/DashboardMockup";
import { company } from "@/lib/company";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qubits Private Limited | Pharmaceutical QC Tools" },
      {
        name: "description",
        content:
          "Learn how Qubits supports pharmaceutical analysts with document-assisted assay and potency, dilution and preparation calculations, saved runs and human-reviewed trend insights.",
      },
      { property: "og:title", content: "Qubits Private Limited | Pharmaceutical QC Tools" },
      {
        property: "og:description",
        content:
          "Explore Qubits Lab Calculator workflows for pharmaceutical assay, potency, dilution, document review and trend checks.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://qubitsprivatelimited.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://qubitsprivatelimited.vercel.app/" }],
  }),
  component: Index,
});

const PAGE_LINKS = [
  { hash: "about", label: "About" },
  { hash: "capabilities", label: "Capabilities" },
  { hash: "workflow", label: "How it works" },
  { hash: "company", label: "Company" },
  { hash: "intelligence", label: "AI trend review" },
] as const;

const CAPABILITIES = [
  {
    icon: FlaskConical,
    title: "Assay & potency",
    body: "Run structured calculations with outputs and configured compliance verdicts ready for analyst review.",
    tag: "IPC-guided calculations",
    workflow: "assay-potency",
    action: "Open assay calculator",
  },
  {
    icon: Scale,
    title: "Dilution & preparation",
    body: "Work through preparation calculations with clear inputs and live results in the same calculator workspace.",
    tag: "Preparation workflows",
    workflow: "dilution-preparation",
    action: "Open dilution calculator",
  },
  {
    icon: FileSearch,
    title: "Document-assisted review",
    body: "Upload supported lab documents, inspect extracted values and suggested calculations, then confirm before calculating.",
    tag: "Analyst-confirmed",
    workflow: "upload",
    action: "Upload & analyse",
  },
] as const;

const WORKFLOW_STEPS = [
  {
    icon: Upload,
    title: "Add source data",
    body: "Upload a PDF, spreadsheet, ZIP archive, text file or supported image.",
  },
  {
    icon: FileSearch,
    title: "Review suggestions",
    body: "Inspect extracted values and the proposed calculation before anything is run.",
  },
  {
    icon: ClipboardCheck,
    title: "Calculate & save",
    body: "Confirm the fields, review the result and its verdict, then save the run to your history.",
  },
  {
    icon: TrendingUp,
    title: "Review trends",
    body: "Select saved assay and potency runs for an AI summary and follow-up checks.",
  },
] as const;

function Index() {
  return (
    <div className="w-full">
      <section className="bg-hero-background text-hero-foreground">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] md:py-16">
          <div className="min-w-0">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
              <span className="text-sm font-medium text-hero-muted">{company.tagline}</span>
            </div>
            <h1 className="max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              Pharmaceutical QC calculations, in one analyst-led workspace.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-hero-muted sm:text-lg">
              Qubits Lab Calculator brings assay and potency, dilution and preparation, document
              review and trend checks into a single workflow. Review every extracted value before
              calculating.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-brand-green text-brand-blue-deep hover:bg-brand-green/90"
              >
                <Link to="/auth">
                  <FlaskConical className="h-4 w-4" /> Sign in to calculator
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-hero-foreground/30 bg-transparent text-hero-foreground hover:bg-hero-panel hover:text-hero-foreground"
              >
                <Link to="/auth" search={{ mode: "signup" }}>
                  Create an account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-hero-muted">
              Calculator access requires a personal account. Uploads and saved runs stay private to
              the signed-in user.
            </p>
            <p className="mt-3 text-sm text-hero-muted">
              Just looking?{" "}
              <Link
                to="/demo"
                className="font-medium text-hero-foreground underline underline-offset-4"
              >
                Try the demo calculator
              </Link>{" "}
              or{" "}
              <Link
                to="/formulas"
                className="font-medium text-hero-foreground underline underline-offset-4"
              >
                read the formulas
              </Link>
              .
            </p>
          </div>
          <div className="min-w-0 md:justify-self-end">
            <DashboardMockup />
          </div>
        </div>
      </section>

      <nav aria-label="Homepage sections" className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-2 px-4 py-4 sm:px-6">
          <span className="mr-1 text-xs font-semibold uppercase text-muted-foreground">Explore</span>
          {PAGE_LINKS.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section id="about" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-start">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-brand-green/40 text-brand-green-deep">
              About Qubits
            </Badge>
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Software support for pharmaceutical analysis.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Qubits Private Limited builds software support and maintenance tools for computer
              programming and related activities. The Lab Calculator is a focused workspace for
              pharmaceutical QC analysts—not a replacement for a laboratory information management
              system, validated equipment or approved procedures.
            </p>
          </div>
          <div className="grid gap-5 border-l border-border pl-5 sm:grid-cols-2 md:pl-7">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">The workspace</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Guided calculation, document-assisted value review, personal run history and trend
                summaries.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">The analyst</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                You confirm source data and calculation choices; AI trend observations remain
                decision support for human review.
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Account privacy
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Calculator workflows require sign-in. Uploaded documents, calculations and saved
                trends are scoped to the individual account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="scroll-mt-24 border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-brand-green/40 text-brand-green-deep">
              Lab workflows
            </Badge>
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              The calculations your QC work starts with
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Choose a workflow, review the inputs and results, and keep confirmed runs together.
            </p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {CAPABILITIES.map((capability) => (
              <Card key={capability.title} className="h-full border-border/80 shadow-sm">
                <CardContent className="flex h-full flex-col items-start gap-4 p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <capability.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {capability.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {capability.body}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-2 text-xs font-semibold text-brand-green-deep">
                    <Check className="h-4 w-4" aria-hidden="true" /> {capability.tag}
                  </div>
                  <Link
                    to="/auth"
                    search={{ workflow: capability.workflow }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Sign in to {capability.action.toLowerCase()}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Document analysis supports PDF, Excel, CSV, TXT, JSON, ZIP and common image files up to
            25 MB. Extracted values are suggestions for analyst review.
          </p>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              From source data to a reviewed run
            </h2>
          </div>
          <ol className="mt-10 grid gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, index) => (
              <li key={step.title} className="border-l border-border pl-5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold text-primary">
                    0{index + 1}
                  </span>
                  <step.icon className="h-4 w-4 text-brand-green-deep" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="company" className="scroll-mt-24 border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <Badge variant="outline" className="mb-3">Company information</Badge>
              <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {company.name}
              </h2>
              <p className="mt-2 text-base text-muted-foreground">{company.tagline}</p>
            </div>
          </div>
          <dl className="mt-9 grid gap-x-8 gap-y-6 border-t border-border pt-7 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Corporate identification number", company.cin],
              ["Incorporated", company.incorporationDate],
              ["Registrar of Companies", company.roc],
              ["Authorized and paid-up capital", company.capital],
              ["Business classification", company.nicClassification],
              ["Directors", company.directors.join(" and ")],
              ["Registered office", company.registeredAddress],
            ].map(([term, detail]) => (
              <div key={term} className="min-w-0">
                <dt className="text-xs font-semibold uppercase text-muted-foreground">{term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="intelligence" className="scroll-mt-24 border-b border-border bg-accent/35 py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="max-w-xl">
            <Badge variant="outline" className="mb-4 border-brand-green/40 text-brand-green-deep">
              <Sparkles className="mr-1 h-3 w-3" aria-hidden="true" /> AI-assisted review
            </Badge>
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Trend signals for human review
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Select reviewed assay and potency runs to get a concise trend summary, unusual-shift
              flags and suggested follow-up checks. The analyst reviews every suggestion against
              the source data before acting.
            </p>
            <Button asChild className="mt-7 gap-2">
              <Link to="/auth" search={{ workflow: "trend" }}>
                Sign in to review trends <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Trend review</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                  Analyst review output
                </h3>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <ul className="divide-y divide-border">
              {[
                ["Trend summary", "A concise read across selected reviewed runs"],
                ["Shift flags", "Normal, watch or unusual signals to inspect"],
                ["Follow-up checks", "Suggested checks to consider against raw data"],
              ].map(([title, detail]) => (
                <li key={title} className="flex gap-3 py-4 last:pb-0">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-deep" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              Decision support only. Verify findings with the original records and approved procedures.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}