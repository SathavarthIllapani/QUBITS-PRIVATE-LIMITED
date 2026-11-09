import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { MIN_PASSWORD_LENGTH, PASSWORD_HINT, validatePassword } from "@/lib/password";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | Qubits Lab Calculator" },
      {
        name: "description",
        content: "Choose a new password for your Qubits lab calculator account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The recovery link signs the user in automatically; a valid session means
  // the link worked and a new password can be set.
  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setSignedIn(Boolean(data.user));
        setChecking(false);
      })
      .catch(() => {
        setSignedIn(false);
        setChecking(false);
      });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    const problem = validatePassword(password);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(
          /at least|weak|pwned|known to be/i.test(updateError.message)
            ? `Choose a stronger password. ${PASSWORD_HINT}`
            : "The password could not be changed. Request a fresh reset link and try again.",
        );
        return;
      }
      await supabase.auth.signOut();
      await navigate({ to: "/auth" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Set a new password
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a new password for your account.
            </p>
          </div>

          {checking ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !signedIn ? (
            <p className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-center text-sm leading-snug text-foreground">
              This password-reset link is invalid or has expired. Request a new one from the
              sign-in page.
            </p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </div>
              {error ? (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save new password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
