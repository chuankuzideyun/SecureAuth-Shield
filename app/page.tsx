import Link from 'next/link';
import { Dessert, ShieldCheck, Heart, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Dessert className="w-8 h-8 text-pink-400" />
          <span className="text-xl font-bold text-gray-800 tracking-tight">Velvet Crumbs</span>
        </div>
        
        <Link 
          href="/login" 
          className="px-6 py-2.5 bg-white border border-pink-100 text-pink-500 font-semibold rounded-full hover:bg-pink-50 transition-all shadow-sm"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100/50 rounded-full text-pink-600 text-xs font-bold uppercase tracking-widest">
            <Star className="w-3 h-3 fill-pink-600" />
            Voted Best Patisserie 2024
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Indulgence <br /> 
            <span className="text-pink-400 font-serif italic">Secured</span> with Love.
          </h1>
          
          <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
            Experience the finest artisanal pastries in a safe, members-only digital environment. Your privacy is our secret ingredient.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link 
              href="/login"
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-200 transition-all flex items-center justify-center gap-3 group"
            >
              Access Member Club
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-100 hover:border-pink-200 transition-all">
              View Seasonal Menu
            </button>
          </div>

          <div className="pt-8 flex items-center justify-center md:justify-start gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-medium">Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-medium">Artisan Crafted</span>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements / Image Placeholder */}
        <div className="flex-1 relative">
          <div className="w-72 h-72 md:w-96 md:h-96 bg-pink-200 rounded-full filter blur-3xl opacity-30 absolute -top-10 -left-10 animate-pulse"></div>
          <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl rotate-3 border border-pink-50">
            <div className="bg-pink-50 w-full aspect-square rounded-[2rem] flex items-center justify-center">
               <Dessert className="w-32 h-32 text-pink-200" />
               {/* 提示：之后你可以在这里放一张真实的马卡龙或蛋糕图片 */}
            </div>
            <div className="p-6">
               <p className="text-gray-800 font-bold text-xl">Member Exclusive</p>
               <p className="text-pink-400 font-medium italic">Rosemary Honey Macarons</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}