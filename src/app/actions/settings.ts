"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_BASE_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// API Keys
export async function getApiKeysAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/api-keys`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch API keys");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getApiKeysAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function createApiKeyAction(name: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/api-keys`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to create API key");

    revalidatePath("/dashboard/settings");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("createApiKeyAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function revokeApiKeyAction(keyId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/api-keys/${keyId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      throw new Error(data.detail || "Failed to revoke API key");
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("revokeApiKeyAction error:", error);
    return { success: false, error: error.message };
  }
}

// Widget Settings
export async function getWidgetSettingsAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/widgets`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch widget settings");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getWidgetSettingsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWidgetSettingsAction(widgetId: string, settings: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/widgets/${widgetId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(settings),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to update widget settings");

    revalidatePath("/dashboard/settings");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("updateWidgetSettingsAction error:", error);
    return { success: false, error: error.message };
  }
}
