"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setInfo(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Si la confirmation e-mail est activée, pas de session immédiate.
        if (!data.session) {
          setInfo(
            "Compte créé. Vérifiez votre boîte mail pour confirmer, puis connectez-vous.",
          );
          setMode("login");
          return;
        }
        router.push("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-black/[0.02]">
      <Link href="/" className="mb-8 text-2xl font-bold text-balia">
        Balia
      </Link>

      <div className="w-full max-w-sm rounded-2xl bg-white border border-black/5 p-8">
        <h1 className="text-xl font-semibold text-balia-ink">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mt-1 text-sm text-balia-ink/50">
          {mode === "login"
            ? "Accédez à votre tableau de bord."
            : "Live en 48h. Sans engagement."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-balia-ink/70">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-balia-ink outline-none focus:border-balia"
              placeholder="vous@entreprise.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-balia-ink/70">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-balia-ink outline-none focus:border-balia"
              placeholder="••••••••"
            />
          </div>

          {erreur && (
            <p className="text-sm text-red-600" role="alert">
              {erreur}
            </p>
          )}
          {info && <p className="text-sm text-balia">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-balia px-4 py-2.5 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "…"
              : mode === "login"
                ? "Se connecter"
                : "Créer mon compte"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setErreur(null);
            setInfo(null);
          }}
          className="mt-4 w-full text-center text-sm text-balia-ink/60 hover:text-balia-ink"
        >
          {mode === "login"
            ? "Pas encore de compte ? Créer un compte"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </main>
  );
}
