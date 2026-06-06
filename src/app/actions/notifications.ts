"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function authHeaders() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUnreadCount(): Promise<number> {
  try {
    const res = await fetch(`${API}/api/v1/notifications/unread-count`, {
      headers: await authHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const json = await res.json();
    return json.data?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function listNotifications(limit = 20): Promise<Notification[]> {
  try {
    const res = await fetch(
      `${API}/api/v1/notifications?limit=${limit}`,
      { headers: await authHeaders(), cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function markReadAction(id: string): Promise<void> {
  await fetch(`${API}/api/v1/notifications/${id}/read`, {
    method: "PATCH",
    headers: await authHeaders(),
  });
}

export async function markAllReadAction(): Promise<void> {
  await fetch(`${API}/api/v1/notifications/read-all`, {
    method: "PATCH",
    headers: await authHeaders(),
  });
}

// Type re-export so callers can use it
export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};
