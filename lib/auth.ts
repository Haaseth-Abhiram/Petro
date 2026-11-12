export interface AuthResult {
  success: boolean;
  message: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
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

    const data = await res.json();
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

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: "Connection to registration API failed.",
      error: err.message,
    };
  }
}
