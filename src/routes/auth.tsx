import logoAsset from "@/assets/qubits-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthSession } from "@/hooks/use-auth-session";
import { supabase } from "@/integrations/supabase/client";
import { company } from "@/lib/company";
import { MIN_PASSWORD_LENGTH, PASSWORD_HINT, validatePassword } from "@/lib/password";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | Qubits Lab Calculator" },
      {
        name: "description",
        content:
          "Sign in to the Qubits lab calculator to upload documents, review extracted values, save runs and follow trends across your assay results.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

const MODE_LABELS: Record<Mode, string> = {
  signin: "Sign in",
  signup: "Create account",
  forgot: "Forgot password",
};

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuthSession();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [failures, setFailures] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  // Already signed in: the calculator is the only destination.
  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/tools", search: { workflow: "assay-potency" } });
    }
  }, [loading, user]);

  function friendlyError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error ?? "");
    if (/invalid login credentials/i.test(message)) return "Email or password is incorrect.";
    if (/email not confirmed/i.test(message))
      return "Please confirm your email first — check your inbox for the confirmation link.";
    if (/user already registered/i.test(message))
      return "An account with this email already exists — try signing in instead.";
    if (/password should|weak|pwned|known to be/i.test(message))
      return `Choose a stronger password. ${PASSWORD_HINT}`;
    if (/rate limit/i.test(message)) return "Too many attempts — please wait a moment and try again.";
    return "That didn't work. Please check your details and try again.";
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (mode === "signin" && Date.now() < lockedUntil) {
      const seconds = Math.ceil((lockedUntil - Date.now()) / 1000);
      setNotice(`Too many failed attempts — please wait ${seconds} seconds and try again.`);
      return;
    }
    if (mode === "signup") {
      const problem = validatePassword(password, email);
      if (problem) {
        setNotice(problem);
        return;
      }
    }
    setBusy(true);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/tools", search: { workflow: "assay-potency" } });
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) {
          await navigate({ to: "/tools", search: { workflow: "assay-potency" } });
        } else {
          setNotice("Account created. Check your email to confirm it, then sign in here.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice(
          "If that email is registered, a password-reset link is on its way. Check your inbox.",
        );
      }
    } catch (error) {
      if (mode === "signin") {
        const next = failures + 1;
        if (next >= 5) {
          setLockedUntil(Date.now() + 30_000);
          setFailures(0);
        } else {
          setFailures(next);
        }
      }
      setNotice(friendlyError(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 p-8">
          <img
            src={logoAsset.url}
            alt={`${company.name} logo`}
            className="h-20 w-20 rounded-2xl border border-border/60 bg-card p-2"
          />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {MODE_LABELS[mode]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "forgot"
                ? "Enter your email and we'll send a reset link."
                : "Sign in to upload documents, save runs and follow trends."}
            </p>
          </div>

          <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="analyst@company.com"
              />
            </div>
            {mode !== "forgot" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={mode === "signup" ? MIN_PASSWORD_LENGTH : undefined}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
                {mode === "signup" ? (
                  <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>
                ) : null}
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {MODE_LABELS[mode]}
            </Button>
          </form>

          {notice ? (
            <p className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-center text-sm leading-snug text-foreground">
              {notice}
            </p>
          ) : null}

          <div className="flex w-full flex-col items-center gap-2 text-sm">
            {mode === "signin" ? (
              <>
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    setMode("forgot");
                    setNotice(null);
                  }}
                >
                  Forgot your password?
                </button>
                <span className="text-muted-foreground">
                  New here?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => {
                      setMode("signup");
                      setNotice(null);
                    }}
                  >
                    Create an account
                  </button>
                </span>
              </>
            ) : (
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setMode("signin");
                  setNotice(null);
                }}
              >
                Back to sign in
              </button>
            )}
            <Link to="/" className="text-muted-foreground hover:text-foreground hover:underline">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
