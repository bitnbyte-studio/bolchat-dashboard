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

export async function getOrganizationsAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/admin/organizations`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch organizations");
    
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("getOrganizationsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function provisionCompanyAction(name: string, slug: string, adminEmail: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/admin/provision`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, slug, admin_email: adminEmail }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to provision company");

    revalidatePath("/dashboard/superadmin");
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("provisionCompanyAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmailAction(userId: string, tempPassword: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/api/v1/admin/send-welcome`, {
      method: "POST",
      headers,
      body: JSON.stringify({ user_id: userId, temp_password: tempPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to send welcome email");

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("sendWelcomeEmailAction error:", error);
    return { success: false, error: error.message };
  }
}
