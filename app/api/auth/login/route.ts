import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const BACKEND_LOGIN_PATH = "/public/login";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, password } = body;

  if (!name || !password) {
    return NextResponse.json(
      { message: "Tên đăng nhập và mật khẩu không được để trống" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}${BACKEND_LOGIN_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Backend returns "Bearer <token>" as plain text body
    const token = await response.text();

    // Forward the JWT token to the browser as a cookie
    const backendResponse = NextResponse.json(
      { message: "Đăng nhập thành công" },
      { status: 200 }
    );

    // Set auth_token cookie (client stores JWT here, not JSESSIONID)
    backendResponse.headers.set(
      "Set-Cookie",
      `auth_token=${token.replace("Bearer ", "")}; Path=/; Max-Age=86400; SameSite=Lax`
    );

    return backendResponse;
  } catch {
    return NextResponse.json(
      { message: "Không thể kết nối đến máy chủ. Vui lòng thử lại." },
      { status: 503 }
    );
  }
}
