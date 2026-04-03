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

export async function getConversationsAction(agentId?: string) {
  try {
    const headers = await getAuthHeaders();
    let url = `${baseUrl}/api/v1/conversations`;
    if (agentId) url += `?agent_id=${agentId}`;

    const res = await fetch(url, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch conversations");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getConversationsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getConversationDetailAction(conversationId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/conversations/${conversationId}`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch conversation details");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getConversationDetailAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteConversationAction(conversationId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/conversations/${conversationId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      throw new Error(data.detail || "Failed to delete conversation");
    }

    revalidatePath("/dashboard/conversations");
    return { success: true };
  } catch (error: any) {
    console.error("deleteConversationAction error:", error);
    return { success: false, error: error.message };
  }
}
