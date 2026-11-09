import { createFileRoute, Link } from "@tanstack/react-router";

import { company } from "@/lib/company";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Qubits Private Limited" },
      {
        name: "description",
        content:
          "How Qubits Private Limited handles account data, uploaded lab documents and saved runs in the Lab Calculator.",
      },
    ],
    links: [{ rel: "canonical", href: "https://qubitsprivatelimited.vercel.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">
        {company.name} (CIN {company.cin}). Draft for review by your legal adviser before launch.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">What we collect</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Account details (email, display name, job title, organisation), documents you upload for
          analysis, the values you confirm, calculation results and saved trend reviews.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">How it is used</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your data is used only to provide the calculator: extracting values from your documents,
          running calculations, keeping your run history and generating trend summaries. Uploaded
          documents, runs and trend reviews are private to your account.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">AI processing</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          When AI extraction or trend review is enabled, the text or images from your document may be
          sent to a third-party AI provider to produce suggestions. Do not upload documents you are
          not permitted to share. AI output is decision support only and must be verified by a
          qualified analyst.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Storage and deletion</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Data is stored with our database and storage provider (Supabase). Deleting a history entry
          also deletes its uploaded file. To close your account or request deletion of your data,
          contact us using the details below.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {company.name}, {company.registeredAddress}.
        </p>
      </section>

      <Link to="/" className="inline-block text-sm font-medium text-primary hover:underline">
        ← Back to home
      </Link>
    </article>
  );
}
