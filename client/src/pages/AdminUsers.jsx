import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import CarForm from "../components/CarForm";
import CarList from "../components/CarList";

export default function AdminUsers() {
  const { api } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "stock"
  const [refreshStock, setRefreshStock] = useState(0);

  useEffect(() => {
    if (activeTab === "users") {
      setLoading(true);
      api
        .get("/users")
        .then((r) => {
          setUsers(r.data);
          setLoading(false);
        })
        .catch(() => {
          setUsers([]);
          setLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Console</h2>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
            >
              Market Stock
            </button>
          </div>
        </div>
        <div className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-600/10">
          {users.length} Registered Users
        </div>
      </div>

      {activeTab === "users" ? (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/40 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                        u.role === 'seller' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                        Edit Permissions
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center text-slate-400 italic">
                      No users found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-panel p-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Create Admin Stock</h3>
              <CarForm onCreated={() => setRefreshStock((r) => r + 1)} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="glass-panel p-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Market Inventory</h3>
              <CarList refreshTrigger={refreshStock} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
