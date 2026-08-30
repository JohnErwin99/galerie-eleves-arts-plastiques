import { eq } from "drizzle-orm";
import { db, adminCredentials } from "@/db";

/** Identifiants de l'admin : la ligne en base fait foi; à défaut, les
 *  variables d'environnement servent de valeurs initiales. */
export async function getAdminCredentials() {
  const [row] = await db
    .select()
    .from(adminCredentials)
    .where(eq(adminCredentials.id, 1));
  if (row) return { email: row.email, passwordHash: row.passwordHash };
  return {
    email: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH ?? "",
  };
}

export async function setAdminPassword(passwordHash: string) {
  const current = await getAdminCredentials();
  await db
    .insert(adminCredentials)
    .values({ id: 1, email: current.email, passwordHash })
    .onConflictDoUpdate({
      target: adminCredentials.id,
      set: { passwordHash, updatedAt: new Date() },
    });
}
