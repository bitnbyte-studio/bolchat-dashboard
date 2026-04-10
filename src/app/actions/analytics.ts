"use server";

import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_BASE_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function extractError(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ");
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return fallback;
}

export async function getOverviewStats() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/analytics/overview`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(extractError(data.detail, "Failed to fetch overview"));
    return { success: true as const, data: data.data };
  } catch (error: any) {
    console.error("getOverviewStats error:", error);
    return { success: false as const, error: error.message };
  }
}

export async function getTrends(period = "day", days = 30) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${baseUrl}/api/v1/analytics/trends?period=${period}&days=${days}`,
      { headers, cache: "no-store" },
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(extractError(data.detail, "Failed to fetch trends"));
    return { success: true as const, data: data.data };
  } catch (error: any) {
    console.error("getTrends error:", error);
    return { success: false as const, error: error.message };
  }
}

export async function getHeatmap(days = 30) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${baseUrl}/api/v1/analytics/heatmap?days=${days}`,
      { headers, cache: "no-store" },
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(extractError(data.detail, "Failed to fetch heatmap"));
    return { success: true as const, data: data.data };
  } catch (error: any) {
    console.error("getHeatmap error:", error);
    return { success: false as const, error: error.message };
  }
}
