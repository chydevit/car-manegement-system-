import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setMe(payload);
    } catch (e) { }
  }, [token]);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-3xl border border-white/50">
            👋
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h2>
            <p className="text-slate-500 mt-1 italic">Welcome back to your workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Profile Information</h3>
            {me ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {me.email[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{me.email}</div>
                    <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{me.role} Account</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Member Status</span>
                  <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Active</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic">Please login to view your profile.</p>
            )}
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                As a {me?.role || 'user'}, you have access to specialized tools to manage your listings and explore the marketplace.
              </p>
              {me?.role !== "admin" && me?.role !== "seller" && (
                <Link to="/portfolio" className="btn-premium text-center">
                  Check My Portfolio
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
