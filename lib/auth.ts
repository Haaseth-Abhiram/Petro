export const ADMIN_TOKEN_KEY = "petronex_admin_token";

export interface AuthResult {
  success: boolean;
  message: string;
  error?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

async function safeParseJson(res: Response): Promise<AuthResult> {
  const text = await res.text();
  if (!text) {
    return {
      success: false,
      message: `Authentication server returned empty response (HTTP ${res.status}).`,
    };
  }
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: `Unexpected server response (HTTP ${res.status}).`,
      error: text.slice(0, 120),
    };
  }
}

export async function authenticateAdmin(credentials: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResult> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await safeParseJson(res);
    if (data.success && data.token && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      } catch {
        // ignore storage quota errors
      }
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: "Connection to authentication API failed.",
      error: err.message,
    };
  }
}

export async function registerUser(details: {
  fullName: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}): Promise<AuthResult> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    const data = await safeParseJson(res);
    if (data.success && data.token && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      } catch {
        // ignore storage quota errors
      }
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: "Connection to registration API failed.",
      error: err.message,
    };
  }
}
