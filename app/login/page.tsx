"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessage({ 
          type: 'error', 
          content: 'Security Alert: Too many attempts. Your IP has been rate-limited for 60 seconds.' 
        });
      } else if (!response.ok) {
        setMessage({ 
          type: 'error', 
          content: data.error || 'Invalid credentials. Please try again.' 
        });
      } else {
        setMessage({ 
          type: 'success', 
          content: 'Identity verified. Redirecting to Secure Dashboard...' 
        });
        // router.push('/dashboard');
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        content: 'Connection error. Secure tunnel could not be established.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
      <div className="max-w-md w-full p-10 bg-white rounded-3xl shadow-2xl shadow-pink-100/50 border border-pink-50">
        
        {/* Branding & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-2xl mb-5 rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck className="w-10 h-10 text-pink-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SecureAuth Shield</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium uppercase tracking-wider">
            Enterprise Authentication Gateway
          </p>
        </div>

        {/* Status Messages */}
        {message.content && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-100' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-semibold leading-relaxed">{message.content}</p>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-200 group-focus-within:text-pink-400 transition-colors" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all text-gray-700 placeholder:text-gray-300"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Secret Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-200 group-focus-within:text-pink-400 transition-colors" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all text-gray-700 placeholder:text-gray-300"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Authorize Access
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="text-pink-500 hover:text-pink-600 underline underline-offset-4 decoration-2 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        {/* Security Compliance Footer */}
        <div className="mt-10 pt-6 border-t border-pink-50 flex flex-col items-center gap-3">
          <div className="flex gap-4">
            <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-400 rounded">TLS 1.3</span>
            <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-400 rounded">AES-256</span>
            <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-400 rounded">HTTPONLY</span>
          </div>
          <p className="text-[10px] text-gray-300 font-medium uppercase tracking-[0.2em]">
            Identity protection by SecureAuth Systems
          </p>
        </div>
      </div>
    </div>
  );
}