"use client";

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight, Chrome } from 'lucide-react';
import Link from 'next/link';
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase-client";

export default function SignUpPage() {
  // 1. 正确定义状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Google 登录逻辑
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 唤起 Google 弹窗
      const result = await signInWithPopup(auth, googleProvider);
      // 获取 ID Token
      const idToken = await result.user.getIdToken();

      // 发送到后端 API 校验并设置 HttpOnly Cookie
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || 'Google authentication failed');
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. 邮箱注册逻辑 (演示用)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 实际开发中，这里也可以走 API Route 统一处理
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = '/login'; 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
      <div className="max-w-md w-full p-10 bg-white rounded-3xl shadow-2xl shadow-pink-100/50 border border-pink-50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-50 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Join SecureAuth</h1>
          <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-widest">Create your secure vault</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Social Provider: Google */}
        <button 
          type="button"
          onClick={handleGoogleLogin} // 绑定点击事件
          disabled={loading}
          className="w-full py-3 px-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center gap-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all mb-6 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-pink-400" /> : <Chrome className="w-5 h-5 text-pink-400" />}
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-300 font-bold tracking-widest">Or email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-200 group-focus-within:text-pink-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-200 group-focus-within:text-pink-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm"
                placeholder="Secure Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400 font-medium">
          Already a member?{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-600 underline underline-offset-4 decoration-2 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}