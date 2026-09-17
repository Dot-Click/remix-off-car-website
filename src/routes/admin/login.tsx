import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminUser } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import showroomImg from "@/assets/admin-login-showroom.jpg";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    denied: s["denied"] === true || s["denied"] === "true",
  }),
  head: () => ({
    meta: [
      { title: "Admin Login | J1 Autoland" },
      { name: "description", content: "Secure administrator sign-in for the J1 Autoland inventory dashboard." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Login | J1 Autoland" },
      { property: "og:description", content: "Secure administrator sign-in for the J1 Autoland dashboard." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { denied } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    denied ? "This account does not have administrator access." : null,
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (mode === "forgot") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
      } else {
        setNotice("Password reset instructions sent. Please check your email.");
        setMode("login");
      }
      return;
    }

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/login` },
      });
      if (signUpError) {
        setLoading(false);
        setError(signUpError.message);
        return;
      }
      // Supabase returns a user with no identities when the email already exists.
      if (data.user && (data.user.identities?.length ?? 0) === 0) {
        setLoading(false);
        setMode("login");
        setError("An account with this email already exists. Please sign in instead.");
        return;
      }
      const { isAdmin } = await getAdminUser();
      if (isAdmin) {
        setLoading(false);
        navigate({ to: "/admin" });
        return;
      }
      setLoading(false);
      setMode("login");
      setNotice(
        data.session
          ? "Account created. Signing in is now available."
          : "Account created. Confirm your email if prompted, then sign in.",
      );
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const { isAdmin } = await getAdminUser();
    if (!isAdmin) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account does not have administrator access.");
      return;
    }

    setLoading(false);
    navigate({ to: "/admin" });
  };

  const isForgot = mode === "forgot";
  const isSignup = mode === "signup";

  return (
    <main className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Left — cinematic showroom image */}
      <section className="relative hidden min-h-[220px] w-full overflow-hidden lg:block lg:w-[55%]">
        <img
          src={showroomImg}
          alt="Premium automotive showroom"
          className="absolute inset-0 h-full w-full object-cover"
          width={1024}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 via-foreground/45 to-foreground/75" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <Logo variant="header" tone="transparent" asLink={false} size="lg" />
          <div className="max-w-md">
            <p className="font-display text-3xl font-semibold leading-tight text-primary-foreground lg:text-4xl">
              Premium Automotive Management
            </p>
            <p className="mt-4 text-sm font-medium text-primary-foreground/75">
              Manage inventory, enquiries, and content with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile image header */}
      <section className="relative h-48 w-full shrink-0 overflow-hidden lg:hidden">
        <img
          src={showroomImg}
          alt="Premium automotive showroom"
          className="absolute inset-0 h-full w-full object-cover"
          width={1024}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 to-foreground/85" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <Logo variant="header" tone="transparent" asLink={false} size="md" />
        </div>
      </section>

      {/* Right — login form */}
      <section className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[45%] lg:px-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center text-center">
            <Logo variant="default" tone="transparent" asLink={false} size="md" />
            <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {isForgot ? "Reset password" : isSignup ? "Create admin account" : "Administrator Sign In"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isForgot
                ? "Enter your email and we'll send reset instructions."
                : isSignup
                  ? "Set up administrator access for this dealership."
                  : "Sign in to manage your dealership."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="J1autoland26@gmail.com"
                className="h-12"
              />
            </div>

            {!isForgot && (
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required={!isForgot}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {!isForgot && !isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setNotice(null);
                  }}
                  className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {notice && (
              <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                {notice}
              </p>
            )}

            {error && (
              <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isForgot ? "Sending…" : isSignup ? "Creating account…" : "Signing in…"}
                </span>
              ) : isForgot ? (
                "Send reset link"
              ) : isSignup ? (
                "Create admin account"
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="flex flex-col gap-3 pt-2 text-center">
              {!isForgot && (
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError(null);
                    setNotice(null);
                  }}
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                >
                  {mode === "login" ? "First-time setup — create admin account" : "Back to sign in"}
                </button>
              )}
              {(isForgot || isSignup) && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setNotice(null);
                  }}
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>

          <p className="pt-8 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            J1 AUTOLAND • Admin Portal
          </p>
        </div>
      </section>
    </main>
  );
}
