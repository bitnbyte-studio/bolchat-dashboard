"use server";

import { cookies } from "next/headers";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!/[A-Z]/.test(password)) {
    return { error: "Password must contain at least one uppercase letter." };
  }

  const baseUrl = process.env.NEXT_BASE_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store", // Ensure we bypass Next.js cache
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      return { error: "Invalid response from the authentication server." };
    }

    if (!res.ok) {
      if (res.status === 401) return { error: "Invalid credentials. Please try again." };
      if (res.status === 429) return { error: "Too many attempts. Please try again later." };
      return { error: data?.message || "Failed to authenticate with backend." };
    }

    if (data.success && data.data) {
      // Very secure: Server-side token storage (HTTP-Only cookies) -> JavaScript never sees truth!
      const cookieStore = await cookies();
      
      if (data.data.accessToken) {
         cookieStore.set("accessToken", data.data.accessToken, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: "lax",
             path: "/",
             maxAge: 60 * 60 * 24 * 7 // 7 days expiration
         });
      }

      // Handle 2FA or Password Change using the tempToken
      if (data.data.tempToken) {
        if (data.data.require2FA) {
            cookieStore.set("tempToken", data.data.tempToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               path: "/",
               maxAge: 60 * 15 // 15 mins for 2FA flow
           });
           return { success: true, require2FA: true };
        }

        if (data.data.requirePasswordChange) {
            cookieStore.set("tempToken", data.data.tempToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               path: "/",
               maxAge: 60 * 15 // 15 mins for reset flow
           });
           return { success: true, requirePasswordChange: true };
        }
      }

      return { success: true, redirect: "/dashboard" };
    }

    return { error: "Unexpected server response format." };

  } catch (error) {
    console.error("Login server action error:", error);
    return { error: "Network communication error. Verify backend server is online." };
  }
}

export async function forceResetPasswordAction(prevState: any, formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword !== confirmPassword) {
    return { error: "Passwords do not match or are empty." };
  }

  if (!/[A-Z]/.test(newPassword)) {
    return { error: "New password must contain at least one uppercase letter." };
  }

  const cookieStore = await cookies();
  const tempToken = cookieStore.get("tempToken")?.value;

  if (!tempToken) {
    return { error: "Session expired or invalid token. Please log in again." };
  }

  const baseUrl = process.env.NEXT_BASE_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${baseUrl}/api/v1/auth/force-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tempToken, newPassword }),
      cache: "no-store",
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      return { error: "Invalid response from the authentication server." };
    }

    if (!res.ok) {
      return { error: data?.message || "Failed to reset password." };
    }

    if (data.success && data.data?.accessToken) {
      // Set new access token
      cookieStore.set("accessToken", data.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7
      });
      // Clear tempToken map
      cookieStore.delete("tempToken");

      return { success: true, redirect: "/dashboard" };
    }

    return { error: "Unexpected response format from server." };
  } catch (error) {
    console.error("Force reset server action error:", error);
    return { error: "Network communication error." };
  }
}
