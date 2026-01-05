import React, { useEffect, useState, useContext } from "react";
import { Key, Ghost } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function MyCollection() {
    const [purchases, setPurchases] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, carsRes] = await Promise.all([
                    axios.get("http://localhost:4000/api/payments/my-orders", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:4000/api/cars")
                ]);

                const myCarIds = ordersRes.data.map(o => o.carId);
                const myCars = carsRes.data.filter(c => myCarIds.includes(c.id));

                setPurchases(myCars);
            } catch (err) {
                console.error("Failed to fetch collection", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    if (loading) {
        return (
            <div className="container py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="container py-12 animate-fade-in">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-emerald-50 shadow-xl rounded-3xl flex items-center justify-center text-3xl border border-emerald-100">
                    <Key size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        My <span className="text-emerald-600">Collection</span>
                    </h2>
                    <p className="text-slate-500 mt-1 italic">Vehicles you now own</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {purchases.map((c) => (
                    <Link key={c.id} to={`/cars/${c.id}`} className="card-premium group">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={c.primaryImage?.imageUrl || c.image || `https://source.unsplash.com/800x600/?car,${c.id}`}
                                alt={c.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-lg">
                                    Owned
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{c.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 italic">
                                {c.description}
                            </p>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Value</span>
                                <span className="text-lg font-black text-emerald-600">${c.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {purchases.length === 0 && (
                <div className="glass-panel p-20 text-center">
                    <Ghost size={64} className="mx-auto mb-6 text-slate-300" />
                    <h3 className="text-2xl font-bold text-slate-900">Your garage is empty</h3>
                    <p className="text-slate-500 mt-2 mb-8">Start your collection by purchasing your first vehicle.</p>
                    <Link to="/" className="btn-premium">Browse Marketplace</Link>
                </div>
            )}
        </div>
    );
}
