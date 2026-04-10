import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_BASE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const kbId = request.nextUrl.searchParams.get("kbId");
    if (!kbId) {
      return NextResponse.json(
        { success: false, error: "Missing kbId parameter" },
        { status: 400 }
      );
    }

    // Forward the multipart form data to the backend
    const formData = await request.formData();

    const res = await fetch(`${baseUrl}/api/v1/documents/upload?kbId=${kbId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail) || "Upload failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
