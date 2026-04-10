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

function extractError(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ");
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return fallback;
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
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch API keys"));

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
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to create API key"));

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
      throw new Error(extractError(data.detail, "Failed to revoke API key"));
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
    
    // First, get the user's agent to find the agent_id
    const agentsRes = await fetch(`${baseUrl}/api/v1/agents`, {
      headers,
      cache: "no-store",
    });
    const agentsData = await agentsRes.json();
    if (!agentsRes.ok || !agentsData.data?.length) {
      return { success: true, data: null }; // No agent yet
    }
    
    const agentId = agentsData.data[0].id;
    
    // Then fetch the widget config for that agent
    const res = await fetch(`${baseUrl}/api/v1/widgets/${agentId}`, {
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

export async function updateWidgetSettingsAction(agentId: string, settings: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/widgets/${agentId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        greeting: settings.greeting,
        brand_color: settings.brand_color,
        position: settings.position,
      }),
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
