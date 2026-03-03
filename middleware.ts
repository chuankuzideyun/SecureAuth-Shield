import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { unsealData } from "iron-session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. 定义公开路由（不需要登录也能看的页面）
  const isPublicPath = path === '/login' || path === '/signup';

  // 2. 从 Cookie 中获取加密的 Session
  const sessionCookie = request.cookies.get("auth_session")?.value;

  // 3. 如果是私有路径且没有 Cookie，重定向到登录页
  if (!isPublicPath && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. 如果有 Cookie，尝试解密并验证（可选：验证 UID 是否存在）
  if (sessionCookie) {
    try {
      const payload = await unsealData(sessionCookie, {
        password: process.env.SESSION_PASSWORD as string,
      });

      if (isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete("auth_session");
      return response;
    }
  }

  return NextResponse.next();
}

// 5. 配置拦截规则：拦截除静态文件和 API 以外的所有路径
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};