import React, { useEffect, useState, useContext } from "react";
import { Car, Folder, Heart, Store, Settings, TrendingUp } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Portfolio() {
    const { user, token } = useContext(AuthContext);
    const [stats, setStats] = useState({
        owned: 0,
        favorites: 0,
        totalValue: 0,
        selling: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const [ordersRes, favsRes, carsRes] = await Promise.all([
                    axios.get("http://localhost:4000/api/payments/my-orders", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:4000/api/favorites", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:4000/api/cars")
                ]);

                const myOwnedCars = carsRes.data.filter(c =>
                    ordersRes.data.map(o => o.carId).includes(c.id)
                );

                const mySellingCars = user.role === 'seller'
                    ? carsRes.data.filter(c => c.sellerId === user.id)
                    : [];

                const totalValue = myOwnedCars.reduce((acc, car) => acc + car.price, 0);

                setStats({
                    owned: myOwnedCars.length,
                    favorites: favsRes.data.length,
                    totalValue: totalValue,
                    selling: mySellingCars.length
                });
            } catch (err) {
                console.error("Error fetching portfolio stats", err);
            } finally {
                setLoading(false);
            }
        };

        if (token && user) fetchPortfolioData();
    }, [token, user]);

    if (loading) {
        return (
            <div className="container py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="container py-12 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="relative mb-12 p-10 glass-panel overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center text-4xl text-white font-bold border-4 border-white/20">
                                {user.email[0].toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Portfolio</h1>
                                <p className="text-slate-500 font-medium italic">Asset Management & Tracking</p>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/50 shadow-xl text-center md:text-right">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio Value</div>
                            <div className="text-4xl font-black text-indigo-600">${stats.totalValue.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="glass-panel p-6 border-l-4 border-indigo-500">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vehicles Owned</div>
                        <div className="text-3xl font-black text-slate-900">{stats.owned}</div>
                    </div>
                    <div className="glass-panel p-6 border-l-4 border-rose-500">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Watchlist Items</div>
                        <div className="text-3xl font-black text-slate-900">{stats.favorites}</div>
                    </div>
                    <div className="glass-panel p-6 border-l-4 border-emerald-500">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active ROI</div>
                        <div className="text-3xl font-black text-slate-900">12.4%</div>
                    </div>
                    <div className="glass-panel p-6 border-l-4 border-amber-500">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Market Rank</div>
                        <div className="text-3xl font-black text-slate-900">#142</div>
                    </div>
                </div>

                {/* Action Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600"><Car size={20} /></span>
                            Quick Navigation
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/collection" className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-center">
                                <div className="text-2xl mb-2 flex justify-center text-indigo-600"><Folder size={24} /></div>
                                <div className="text-sm font-bold text-slate-900">My Garage</div>
                            </Link>
                            <Link to="/favorites" className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-center">
                                <div className="text-2xl mb-2 flex justify-center text-rose-500"><Heart size={24} /></div>
                                <div className="text-sm font-bold text-slate-900">Wishlist</div>
                            </Link>
                            <Link to="/" className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-center">
                                <div className="text-2xl mb-2 flex justify-center text-emerald-600"><Store size={24} /></div>
                                <div className="text-sm font-bold text-slate-900">Market</div>
                            </Link>
                            <Link to="/dashboard" className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-center">
                                <div className="text-2xl mb-2 flex justify-center text-slate-600"><Settings size={24} /></div>
                                <div className="text-sm font-bold text-slate-900">Settings</div>
                            </Link>
                        </div>
                    </div>

                    <div className="glass-panel p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600"><TrendingUp size={20} /></span>
                            Performance Summary
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Market Influence</span>
                                    <span>78%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Collection Diversity</span>
                                    <span>42%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Buyer Engagement</span>
                                    <span>95%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
