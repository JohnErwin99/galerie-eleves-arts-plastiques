import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = { title: "Réinitialiser le mot de passe" };

export default function ReinitialisationPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-2 font-display text-3xl font-semibold">
        Mot de passe oublié
      </h1>
      <p className="mb-6 text-sm text-ink-soft">
        Entrez le code de récupération fourni par la personne qui gère le site,
        puis choisissez un nouveau mot de passe.
      </p>
      <ResetPasswordForm />
    </div>
  );
}
