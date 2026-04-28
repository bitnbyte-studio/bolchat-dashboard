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

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getLeadStatsAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/leads/stats`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch lead stats"));
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getLeadStatsAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── List ──────────────────────────────────────────────────────────────────────

export async function listLeadsAction(params?: {
  status?: string;
  min_score?: number;
  interest?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}) {
  try {
    const headers = await getAuthHeaders();
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.min_score != null) qs.set("min_score", String(params.min_score));
    if (params?.interest) qs.set("interest", params.interest);
    if (params?.date_from) qs.set("date_from", params.date_from);
    if (params?.date_to) qs.set("date_to", params.date_to);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const url = `${baseUrl}/api/v1/leads${qs.toString() ? `?${qs}` : ""}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch leads"));
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("listLeadsAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── Single lead ───────────────────────────────────────────────────────────────

export async function getLeadAction(leadId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/leads/${leadId}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to fetch lead"));
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getLeadAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateLeadStatusAction(leadId: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/leads/${leadId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to update lead"));
    revalidatePath("/dashboard/leads");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("updateLeadStatusAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadAction(leadId: string, updates: {
  status?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/leads/${leadId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractError(data.detail, "Failed to update lead"));
    revalidatePath("/dashboard/leads");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("updateLeadAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── Delete / Archive ──────────────────────────────────────────────────────────

export async function deleteLeadAction(leadId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/leads/${leadId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      throw new Error(extractError(data.detail, "Failed to archive lead"));
    }
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error: any) {
    console.error("deleteLeadAction error:", error);
    return { success: false, error: error.message };
  }
}

// ── CSV Export (returns a download URL to open client-side) ───────────────────

export async function exportLeadsCsvAction(params?: {
  status?: string;
  min_score?: number;
  interest?: string;
}) {
  // We return the full URL + token for the client to navigate to (server streaming)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.min_score != null) qs.set("min_score", String(params.min_score));
    if (params?.interest) qs.set("interest", params.interest);

    // Do the fetch server-side and return the CSV blob URL
    const res = await fetch(
      `${baseUrl}/api/v1/leads/export${qs.toString() ? `?${qs}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to export CSV");
    const csvText = await res.text();
    return { success: true, csv: csvText };
  } catch (error: any) {
    console.error("exportLeadsCsvAction error:", error);
    return { success: false, error: error.message };
  }
}
