import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hand, Car, Mail } from "lucide-react";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [me, setMe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", avatar: "" });
  const [activeTab, setActiveTab] = useState("profile"); // profile or activity
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetchProfile();
    fetchActivity();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMe(data);
        setFormData({ name: data.name, phone: data.phone || "", address: data.address || "", avatar: data.avatar || "" });
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  const fetchActivity = async () => {
    try {
      const auth = { headers: { Authorization: `Bearer ${token}` } };
      const [inqRes, ordRes] = await Promise.all([
        fetch("http://localhost:4000/api/inquiries", auth),
        fetch("http://localhost:4000/api/payments/my-orders", auth)
      ]);
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (e) {
      console.error("Failed to fetch activity", e);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditing(false);
        fetchProfile();
      }
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-3xl border border-white/50 overflow-hidden">
            {me?.avatar ? <img src={me.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <Hand size={40} className="text-indigo-200" />}
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h2>
            <p className="text-slate-500 mt-1 italic">Welcome back, {me?.name || 'User'}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'activity' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}
          >
            Activity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Column */}
          <div className={`glass-panel p-8 ${activeTab !== 'profile' ? 'hidden md:block' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Profile Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {me ? (
              editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shipping Address</label>
                    <textarea
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-20"
                      placeholder="123 Vibe St, Wheels City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-premium w-full py-3">Save Changes</button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                      {me.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{me.name}</div>
                      <div className="text-xs text-slate-500">{me.email}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Phone</span>
                      <span className="text-sm text-slate-700">{me.phone || "Not set"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Role</span>
                      <span className="text-sm text-indigo-600 font-bold uppercase">{me.role}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Address</span>
                      <span className="text-sm text-slate-700">{me.address || "No address provided"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                    <span className="text-slate-500">Member Status</span>
                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Active</span>
                  </div>
                </div>
              )
            ) : (
              <p className="text-slate-500 italic">Please login to view your profile.</p>
            )}
          </div>

          {/* Activity Column */}
          <div className={`glass-panel p-8 ${activeTab !== 'activity' ? 'hidden md:block' : ''}`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Recent Activity</h3>

            <div className="space-y-8">
              {/* Orders */}
              <div>
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">My Orders ({orders.length})</h4>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Order #{o.id}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Amount: ${o.amount?.toLocaleString()}</div>
                        </div>
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase">PAID</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No orders yet.</p>
                )}
              </div>

              {/* Inquiries */}
              <div>
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">My Inquiries ({inquiries.length})</h4>
                {inquiries.length > 0 ? (
                  <div className="space-y-3">
                    {inquiries.map(i => (
                      <div key={i.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-slate-900 text-sm flex items-center">
                            {i.type === 'test_drive' ? <><Car size={14} className="inline mr-1" /> Test Drive Request</> : <><Mail size={14} className="inline mr-1" /> Inquiry</>}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${i.status === 'open' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                            {i.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 italic">"{i.message}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No inquiries sent.</p>
                )}
              </div>
            </div>
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
