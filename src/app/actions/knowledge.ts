"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_BASE_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return {
    "Authorization": `Bearer ${token}`,
  };
}

export async function getKBsAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/knowledge-bases`, {
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch knowledge bases");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getKBsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function createKBAction(name: string, description?: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/knowledge-bases`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || "" }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to create knowledge base");

    revalidatePath("/dashboard/knowledge");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("createKBAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getDocumentsAction(kbId?: string) {
  try {
    const headers = await getAuthHeaders();
    let url = `${baseUrl}/api/v1/documents`;
    if (kbId) url += `?kbId=${kbId}`;

    const res = await fetch(url, {
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail) || "Failed to fetch documents");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getDocumentsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadDocumentAction(kbId: string, formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    // For file uploads, we must NOT set Content-Type manually, 
    // let fetch handle the boundary for multipart/form-data.
    const res = await fetch(`${baseUrl}/api/v1/documents/upload?kb_id=${kbId}`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to upload document");

    revalidatePath("/dashboard/knowledge");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("uploadDocumentAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDocumentAction(docId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/documents/${docId}`, {
      method: "DELETE",
      headers: { ...headers, "Content-Type": "application/json" },
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      throw new Error(data.detail || "Failed to delete document");
    }

    revalidatePath("/dashboard/knowledge");
    return { success: true };
  } catch (error: any) {
    console.error("deleteDocumentAction error:", error);
    return { success: false, error: error.message };
  }
}
