import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import CreateSellerForm from "../components/admin/CreateSellerForm";

export default function AdminConsole() {
    const { api } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("overview");
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
    const [settings, setSettings] = useState({ maintenanceMode: false, globalDiscount: 0, requireApproval: true });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "users") {
                const res = await api.get("/admin/users");
                setUsers(res.data);
            } else if (activeTab === "inventory") {
                const res = await api.get("/admin/cars");
                setCars(res.data);
            } else if (activeTab === "reports" || activeTab === "overview") {
                const res = await api.get("/admin/reports/sales");
                setReports(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        }
        setLoading(false);
    };

    const handleToggleUserStatus = async (user) => {
        try {
            await api.patch(`/admin/users/${user.id}`, { isActive: !user.isActive });
            fetchData();
        } catch (err) {
            alert("Failed to update user status");
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await api.patch(`/admin/users/${userId}`, { role: newRole });
            fetchData();
        } catch (err) {
            alert("Failed to update role");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post("/admin/users", newUser);
            setShowCreateModal(false);
            setNewUser({ name: "", email: "", password: "", role: "seller" });
            if (activeTab === "users") fetchData();
        } catch (err) {
            alert("Failed to create user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleApproveCar = async (carId, status) => {
        try {
            await api.patch(`/admin/cars/${carId}/approval`, { status });
            fetchData();
        } catch (err) {
            alert("Failed to update car status");
        }
    };

    return (
        <div className="container py-12 animate-fade-in min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Console</h2>
                    <p className="text-slate-500 mt-1 italic">Enterprise Management System</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    {["overview", "users", "inventory", "reports", "settings"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                ? "bg-white text-indigo-600 shadow-md scale-105"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {activeTab === "overview" && reports && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="glass-panel p-8 flex flex-col items-center text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Revenue</span>
                                    <span className="text-3xl font-black text-slate-900">${reports.totalRevenue.toLocaleString()}</span>
                                </div>
                                <div className="glass-panel p-8 flex flex-col items-center text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Sales</span>
                                    <span className="text-3xl font-black text-slate-900">{reports.totalSales}</span>
                                </div>
                                <div className="glass-panel p-8 flex flex-col items-center text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Order Value</span>
                                    <span className="text-3xl font-black text-slate-900">${(reports.totalRevenue / reports.totalSales).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="glass-panel p-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Activity</h3>
                                <div className="space-y-4">
                                    {reports.recentTransactions.map(t => (
                                        <div key={t.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div>
                                                <div className="font-bold text-slate-900">{t.car}</div>
                                                <div className="text-xs text-slate-400">Sold to {t.buyer}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-indigo-600">${t.price.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-6">
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowSellerModal(true)}
                                    className="btn-premium px-6 py-3 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                                >
                                    Add New Seller
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 rounded-xl bg-white text-slate-600 font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    Create User
                                </button>
                            </div>
                            <div className="glass-panel overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/50">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-slate-900">{u.name}</div>
                                                    <div className="text-xs text-slate-400">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                                        className="bg-transparent text-xs font-bold text-slate-600 border-none focus:ring-0 cursor-pointer"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="seller">Seller</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                        {u.isActive ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => handleToggleUserStatus(u)}
                                                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${u.isActive ? 'text-red-400 hover:text-red-600' : 'text-emerald-400 hover:text-emerald-600'}`}
                                                    >
                                                        {u.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "inventory" && (
                        <div className="glass-panel overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Car</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                    {cars.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-900">{c.title}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-widest">{c.brand} {c.model} • {c.fuelType}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-black text-indigo-600">${c.price.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === 'available' ? 'bg-emerald-100 text-emerald-600' :
                                                    c.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-4">
                                                {c.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveCar(c.id, 'approved')}
                                                            className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleApproveCar(c.id, 'rejected')}
                                                            className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-600">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "reports" && reports && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-panel p-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Seller Performance</h3>
                                <div className="space-y-4">
                                    {reports.sellerPerformance.map((s, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                            <div>
                                                <div className="font-bold text-slate-900">{s.name}</div>
                                                <div className="text-xs text-slate-400">{s.listings} active listings</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-indigo-600">${s.revenue.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.sales} sales</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-panel p-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Market Trends</h3>
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                        <div key={i} className="flex-1 bg-indigo-600/10 rounded-t-lg relative group transition-all hover:bg-indigo-600/20" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                        <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="glass-panel p-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">System Configuration</h3>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-slate-900">Maintenance Mode</div>
                                            <div className="text-xs text-slate-400">Suspend marketplace operations for scheduled maintenance.</div>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                            className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-slate-900">Require Approval</div>
                                            <div className="text-xs text-slate-400">All new listings must be approved by an administrator.</div>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, requireApproval: !settings.requireApproval })}
                                            className={`w-12 h-6 rounded-full transition-all relative ${settings.requireApproval ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.requireApproval ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Global Seasonal Discount (%)</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="number"
                                                value={settings.globalDiscount}
                                                onChange={(e) => setSettings({ ...settings, globalDiscount: Number(e.target.value) })}
                                                className="w-24 bg-slate-50 border-none rounded-xl p-4 text-sm font-black text-indigo-600 focus:ring-2 focus:ring-indigo-600"
                                            />
                                            <div className="flex-grow flex items-center text-xs text-slate-400 italic">
                                                This discount will be applied to all active listings on the marketplace.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="btn-premium w-full py-4" onClick={() => alert("Settings saved successfully (mocked persistence)")}>
                                            Save System Settings
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-8 border-red-100 bg-red-50/10">
                                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-6">Danger Zone</h3>
                                <div className="space-y-4">
                                    <button className="w-full text-left p-4 rounded-xl border border-red-100 bg-white hover:bg-red-50 transition-colors group">
                                        <div className="font-bold text-slate-900 group-hover:text-red-600">Clear System Cache</div>
                                        <div className="text-[10px] text-slate-400">Force refresh all session data and temporary store.</div>
                                    </button>
                                    <button className="w-full text-left p-4 rounded-xl border border-red-100 bg-white hover:bg-red-50 transition-colors group" onClick={() => alert("System Lockdown initiated (mocked action)")}>
                                        <div className="font-bold text-slate-900 group-hover:text-red-600">Emergency System Lockdown</div>
                                        <div className="text-[10px] text-slate-400">Immediately logout all users and disable logins.</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* CREATE USER MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="glass-panel p-10 max-w-md w-full animate-scale-up shadow-2xl">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Create Account</h3>
                        <p className="text-slate-500 text-sm mb-8 italic">Add a new admin or seller to the system.</p>
                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Full Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Email Address</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Account Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                                >
                                    <option value="seller">Seller</option>
                                    <option value="admin">Administrator</option>
                                    <option value="user">Regular User</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                                <button type="submit" className="flex-[2] btn-premium">Confirm Creation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE SELLER MODAL */}
            {showSellerModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full animate-scale-up relative">
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                onClick={() => setShowSellerModal(false)}
                                className="p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-slate-600 shadow-sm transition-all hover:rotate-90"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <CreateSellerForm
                            onCreated={() => { fetchData(); }}
                            onCancel={() => setShowSellerModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
