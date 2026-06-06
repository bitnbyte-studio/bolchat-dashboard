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

export async function getAgentsAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch agents"));
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getAgentsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function createAgentAction(formData: {
  name: string;
  description?: string;
  systemPrompt?: string;
  settings?: Record<string, unknown>;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: formData.name,
        description: formData.description || "",
        system_prompt: formData.systemPrompt || "",
        settings: formData.settings || {},
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to create agent"));

    revalidatePath("/dashboard/chatbots");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("createAgentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAgentAction(agentId: string, updates: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to update agent"));

    revalidatePath("/dashboard/chatbots");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("updateAgentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAgentAction(agentId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(extractError(data.detail, "Failed to delete agent"));
    }

    revalidatePath("/dashboard/chatbots");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAgentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function previewChatAction(agentId: string, question: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}/preview`, {
      method: "POST",
      headers,
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to get AI response"));

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("previewChatAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── Widget Settings ──

export async function getWidgetAction(agentId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/widgets/${agentId}`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch widget"));

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getWidgetAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWidgetAction(agentId: string, updates: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/widgets/${agentId}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to update widget"));

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("updateWidgetAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── Publish ──

export async function publishAgentAction(agentId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}/publish`, {
      method: "POST",
      headers,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to publish agent"));

    revalidatePath("/dashboard/chatbots");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("publishAgentAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── Knowledge Base Linking ──

export async function getAgentKBsAction(agentId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}/knowledge-bases`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch agent KBs"));

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getAgentKBsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function linkKBAction(agentId: string, kbId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}/knowledge-bases`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ knowledge_base_id: kbId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to link KB"));

    revalidatePath("/dashboard/chatbots");
    return { success: true };
  } catch (error: any) {
    console.error("linkKBAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function unlinkKBAction(agentId: string, kbId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}/knowledge-bases/${kbId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      throw new Error(extractError(data.detail, "Failed to unlink KB"));
    }

    revalidatePath("/dashboard/chatbots");
    return { success: true };
  } catch (error: any) {
    console.error("unlinkKBAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function runOptimizerAction(agentId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents/${agentId}/optimize`, {
      method: "POST",
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Optimizer failed"));
    return { success: true as const, data: data.data };
  } catch (error: any) {
    console.error("runOptimizerAction error:", error);
    return { success: false as const, error: error.message };
  }
}

