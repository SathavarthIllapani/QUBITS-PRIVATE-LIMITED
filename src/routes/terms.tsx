import { createFileRoute, Link } from "@tanstack/react-router";

import { company } from "@/lib/company";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Qubits Private Limited" },
      {
        name: "description",
        content: "Terms of use for the Qubits Lab Calculator.",
      },
    ],
    links: [{ rel: "canonical", href: "https://qubitsprivatelimited.vercel.app/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Terms of Use</h1>
      <p className="text-sm text-muted-foreground">
        {company.name}. Draft for review by your legal adviser before launch.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Decision support only</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The Lab Calculator is a support tool. It is not a laboratory information management system
          and has not been validated as a GxP or 21 CFR Part 11 system. Analysts remain responsible
          for confirming source data, calculation choices and results against approved procedures and
          raw records.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Your account</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Keep your credentials confidential. You are responsible for the documents you upload and
          must have the right to upload them.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">AI suggestions</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Extracted values and trend observations may be incomplete or wrong. Always verify them
          before acting.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Liability</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The service is provided as is, without warranties, to the extent permitted by law.
        </p>
      </section>

      <Link to="/" className="inline-block text-sm font-medium text-primary hover:underline">
        ← Back to home
      </Link>
    </article>
  );
}
