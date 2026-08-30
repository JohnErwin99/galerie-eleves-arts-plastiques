"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "@/lib/actions/auth";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  if (state?.success) {
    return (
      <div className="space-y-4">
        <p className="rounded-md bg-tint px-4 py-3 text-sm text-accent-warm">
          Mot de passe modifié! Vous pouvez maintenant vous connecter.
        </p>
        <Link
          href="/admin/connexion"
          className="inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-medium">
          Code de récupération
        </label>
        <input
          id="code"
          name="code"
          required
          autoComplete="off"
          className="w-full rounded-md border border-line px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Nouveau mot de passe <span className="font-normal text-ink-soft">(min. 8 caractères)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-line px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-line px-3 py-2"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-4 py-2 font-medium text-white hover:bg-accent-deep disabled:opacity-50"
      >
        {pending ? "Modification…" : "Changer le mot de passe"}
      </button>
      <p className="text-center text-sm">
        <Link href="/admin/connexion" className="text-ink-soft hover:text-accent">
          ← Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
