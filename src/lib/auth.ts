import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SessionData {
  isAdmin?: boolean;
}

const sessionOptions = {
  cookieName: "galerie_session",
  password: process.env.SESSION_SECRET ?? "",
  ttl: 60 * 60 * 24 * 30,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  if (!sessionOptions.password || sessionOptions.password.length < 32) {
    throw new Error("SESSION_SECRET manquant ou trop court (min. 32 caractères)");
  }
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function isLoggedIn() {
  const session = await getSession();
  return session.isAdmin === true;
}

// Redirects to the login page; use at the top of admin pages and server actions.
export async function requireAdmin() {
  if (!(await isLoggedIn())) redirect("/admin/connexion");
}
