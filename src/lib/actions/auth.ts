"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminCredentials, setAdminPassword } from "@/lib/admin-credentials";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = await getAdminCredentials();

  const ok =
    admin.email !== "" &&
    admin.passwordHash !== "" &&
    email === admin.email &&
    (await bcrypt.compare(password, admin.passwordHash));

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

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function resetPassword(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const code = String(formData.get("code") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const recoveryCode = (process.env.RECOVERY_CODE ?? "").trim();
  if (!recoveryCode) {
    return { error: "La réinitialisation n'est pas configurée (RECOVERY_CODE manquant)." };
  }
  if (!code || !safeEqual(code, recoveryCode)) {
    return { error: "Code de récupération invalide." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== confirm) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  await setAdminPassword(await bcrypt.hash(password, 12));
  return { success: true };
}
