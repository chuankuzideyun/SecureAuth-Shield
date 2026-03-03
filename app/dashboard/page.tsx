import { cookies } from 'next/headers';
import { unsealData } from "iron-session";
import { adminDb } from '@/lib/firebase-admin';
import { Dessert, ShieldCheck, History, LogOut, User } from 'lucide-react';
import Link from 'next/link';

async function getAuditLogs(email: string) {
  const snapshot = await adminDb.collection('audit_logs')
    .where('email', '==', email)
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'N/A'
  }));
}

export default async function DashboardPage() {
  // 1. Get Cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session")?.value;
  
  if (!sessionCookie) return null; 

  const payload = await unsealData(sessionCookie, {
    password: process.env.SESSION_PASSWORD as string,
  }) as { email: string };

  const logs = await getAuditLogs(payload.email);

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-xl">
              <Dessert className="text-pink-500 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Member Lounge</h1>
              <p className="text-xs text-gray-400 font-medium">Welcome back, {payload.email}</p>
            </div>
          </div>
          <Link href="/api/auth/logout" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Exclusive Sweets */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <User className="w-6 h-6 text-pink-400" />
              Your Exclusive Selection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Matcha Opera Cake', 'Lavender Macarons'].map((item) => (
                <div key={item} className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-video bg-pink-50 rounded-2xl mb-4 flex items-center justify-center">
                    <Dessert className="w-12 h-12 text-pink-200" />
                  </div>
                  <h3 className="font-bold text-gray-800">{item}</h3>
                  <p className="text-sm text-gray-400 mt-1 text-pretty">Hand-crafted by our head pastry chef, exclusively for members.</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Security Center */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Security Center
            </h2>
            <div className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Access Logs
              </h3>
              <div className="space-y-4">
                {logs.map((log: any) => (
                  <div key={log.id} className="text-xs border-l-2 border-pink-100 pl-3 py-1">
                    <p className="text-gray-700 font-bold">{log.timestamp}</p>
                    <p className="text-gray-400">IP: {log.ip}</p>
                    <p className="text-emerald-500 font-medium uppercase text-[10px]">Status: {log.status}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[10px] text-gray-300 leading-relaxed italic">
                * If you notice any unauthorized activity, please contact our security team immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}