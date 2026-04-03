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

export async function getAgentsAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch agents");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getAgentsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function createAgentAction(formData: { name: string; description?: string; systemPrompt?: string }) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/agents`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: formData.name,
        description: formData.description || "",
        system_prompt: formData.systemPrompt || "",
        settings: {}
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to create agent");

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
    if (!res.ok) throw new Error(data.detail || "Failed to update agent");

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
      throw new Error(data.detail || "Failed to delete agent");
    }

    revalidatePath("/dashboard/chatbots");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAgentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function previewChatAction(agentId: string, query: string, history: any[] = []) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/chat/query`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        agentId: agentId,
        query: query,
        history: history
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to get AI response");

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("previewChatAction error:", error);
    return { success: false, error: error.message };
  }
}
