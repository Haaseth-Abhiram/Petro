import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "petronex_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "petronex_secure_admin_session_key_2026_super_secret";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export function createSessionToken(user: { id: string; email: string; name?: string; role?: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name || "Administrator",
      role: user.role || "Admin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const data: SessionUser = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return data;
  } catch (e) {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return verifySessionToken(sessionCookie.value);
  } catch (e) {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
