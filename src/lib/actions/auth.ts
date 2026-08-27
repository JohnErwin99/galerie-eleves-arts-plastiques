"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminHash = process.env.ADMIN_PASSWORD_HASH ?? "";

  const ok =
    adminEmail !== "" &&
    adminHash !== "" &&
    email === adminEmail &&
    (await bcrypt.compare(password, adminHash));

  if (!ok) {
    return { error: "Courriel ou mot de passe invalide." };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();
  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/connexion");
}
