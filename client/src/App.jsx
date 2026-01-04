import React from "react";
import { Outlet, Link } from "react-router-dom";
import Nav from "./components/Nav";

export default function App() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <header className="sticky top-0 z-50 py-4 mb-8 backdrop-blur-xl border-b border-white/10 shadow-sm" style={{ backgroundColor: 'var(--header-bg)' }}>
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group decoration-transparent">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <span className="text-xl font-black">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Vibe <span className="text-indigo-600">Wheels</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Premium Marketplace</p>
            </div>
          </Link>

          <Nav />
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">© 2026 Vibe Wheels. Engineered for Excellence.</p>
          <div className="flex gap-8 items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="https://t.me/chydevit" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Telegram</a>
            <a href="https://github.com/chydevit" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
