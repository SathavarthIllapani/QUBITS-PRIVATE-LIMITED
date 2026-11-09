import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";

import logoAsset from "@/assets/qubits-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/company";

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

const NAV_LINKS = [
  { hash: "capabilities", label: "Capabilities" },
  { hash: "workflow", label: "Workflow" },
  { hash: "intelligence", label: "AI trend review" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logoAsset.url}
            alt={`${company.name} logo`}
            className="h-10 w-10 shrink-0 rounded-lg object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold text-gradient-brand">
              QUBITS
            </span>
            <span className="block truncate text-[10px] font-medium text-muted-foreground uppercase">
              Private Limited
            </span>
          </span>
        </Link>
        <nav aria-label="Homepage sections" className="hidden shrink-0 items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              to="/"
              hash={link.hash}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="shrink-0 gap-2">
          <Link to="/tools" search={{ workflow: "assay-potency" }}>
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Open calculator</span>
            <span className="sm:hidden">Calculator</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={logoAsset.url}
            alt={`${company.name} logo`}
            className="h-12 w-12 shrink-0 rounded-lg object-contain"
          />
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-foreground">{company.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{company.tagline}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              CIN: {company.cin}
              <br />
              {company.registeredAddress}
            </p>
          </div>
        </div>
        <div className="text-xs leading-relaxed text-muted-foreground md:text-right">
          <p className="font-semibold text-foreground">Board of Directors</p>
          {company.directors.map((director) => (
            <p key={director}>{director}</p>
          ))}
          <p className="mt-3">Incorporated {company.incorporationDate}</p>
          <p>Registered with {company.roc}</p>
          <p className="mt-3 flex gap-3 md:justify-end">
            <Link to="/privacy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground hover:underline">
              Terms
            </Link>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="hover:text-foreground hover:underline">
                Contact
              </a>
            ) : null}
          </p>
          <p className="mt-3">&copy; {new Date().getFullYear()} {company.name}</p>
        </div>
      </div>
    </footer>
  );
}
