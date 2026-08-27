import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Connexion" };

export default async function ConnexionPage() {
  if (await isLoggedIn()) redirect("/admin");
  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-6 text-2xl font-semibold">Connexion</h1>
      <LoginForm />
    </div>
  );
}
