import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { sealData } from "iron-session";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // 1. 核心安全步骤：后端校验 ID Token 的合法性
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. 创建加密的 HttpOnly Session
    const sessionData = { uid, email, name, picture };
    const encryptedSession = await sealData(sessionData, {
      password: process.env.SESSION_PASSWORD as string,
    });

    const response = NextResponse.json({ message: "Google Auth Success" });
    
    // 3. 设置安全 Cookie
    response.cookies.set("auth_session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error: any) {
  // 关键：在终端看这个详细报错
  console.error("Firebase Admin Verification Error Detail:", {
    code: error.code,
    message: error.message,
  });

  return NextResponse.json(
    { error: `Authentication failed: ${error.code}` }, 
    { status: 401 }
  );
}
}