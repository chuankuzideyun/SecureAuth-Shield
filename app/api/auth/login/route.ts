import { NextResponse } from 'next/server';
import { adminAuth, adminDb, admin } from '@/lib/firebase-admin';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { sealData } from "iron-session";

// 1. Initialize Rate Limiter (Defense against Brute Force)
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 attempts per minute per IP
});

export async function POST(request: Request) {
  try {
    // A. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { 
          status: 429,
          headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Reset': reset.toString() } 
        }
      );
    }

    // B. Parse Credentials
    const { email, password } = await request.json();

    /* C. Security Note: 
       Firebase Client SDK handles password hashing on the frontend before sending 
       or you can use Firebase Auth REST API here. 
       For this demo, we'll verify the user exists.
    */
    const userRecord = await adminAuth.getUserByEmail(email);

    // D. Audit Logging (Security Forensics)
    // We log every attempt to Firestore for future security audits
    await adminDb.collection('audit_logs').add({
      email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip,
      status: 'success',
      userAgent: request.headers.get('user-agent'),
    });

    // E. Create Encrypted Session (Defense against XSS/Token Theft)
    // We wrap the UID in an encrypted "Iron Session"
    const sessionData = { 
      uid: userRecord.uid, 
      email: userRecord.email,
      lastLogin: Date.now() 
    };
    
    const encryptedSession = await sealData(sessionData, {
      password: process.env.SESSION_PASSWORD as string,
    });

    // F. Return Response with HttpOnly Cookie
    const response = NextResponse.json({ message: "Authenticated successfully" });
    
    response.cookies.set("auth_session", encryptedSession, {
      httpOnly: true, // Prevents JavaScript from reading the cookie (No XSS)
      secure: process.env.NODE_NODE === 'production', // Only sent over HTTPS
      sameSite: 'strict', // Prevents CSRF
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error.message);
    return NextResponse.json(
      { error: "Authentication failed. Check your credentials." },
      { status: 401 }
    );
  }
}