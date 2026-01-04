import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import CarForm from "../components/CarForm";
import CarList from "../components/CarList";

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-indigo-50 shadow-xl rounded-3xl flex items-center justify-center text-3xl border border-indigo-100">
          📦
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Inventory <span className="text-indigo-600">Control</span>
          </h2>
          <p className="text-slate-500 mt-1 italic">Manage your marketplace stock (Logged in as {user?.role})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-panel p-8 sticky top-32">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Create New Listing</h3>
            <CarForm onCreated={() => setRefresh((r) => r + 1)} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel p-0 overflow-hidden">
            <div className="p-8 border-b border-slate-100/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Active Inventory</h3>
            </div>
            <div className="p-4">
              <CarList sellerId={user?.id} refreshTrigger={refresh} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
