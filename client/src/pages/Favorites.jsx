import React, { useEffect, useState, useContext } from "react";
import { Heart, HeartOff } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [favsIdsRes, carsRes] = await Promise.all([
                    axios.get("http://localhost:4000/api/favorites", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:4000/api/cars")
                ]);

                const favIds = favsIdsRes.data;
                const favCars = carsRes.data.filter(c => favIds.includes(c.id));

                setFavorites(favCars);
            } catch (err) {
                console.error("Failed to fetch favorites", err);
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
                <div className="w-20 h-20 bg-rose-50 shadow-xl rounded-3xl flex items-center justify-center text-3xl border border-rose-100">
                    <Heart size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        My <span className="text-rose-600">Favorites</span>
                    </h2>
                    <p className="text-slate-500 mt-1 italic">Vehicles you're keeping an eye on</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map((c) => (
                    <Link key={c.id} to={`/cars/${c.id}`} className="card-premium group">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={c.primaryImage?.imageUrl || c.image || `https://source.unsplash.com/800x600/?car,${c.id}`}
                                alt={c.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 text-rose-500">
                                <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-rose-600 transition-colors">{c.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 italic">
                                {c.description}
                            </p>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price</span>
                                <span className="text-lg font-black text-rose-600">${c.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {favorites.length === 0 && (
                <div className="glass-panel p-20 text-center">
                    <HeartOff size={64} className="mx-auto mb-6 text-slate-300" />
                    <h3 className="text-2xl font-bold text-slate-900">No favorites yet</h3>
                    <p className="text-slate-500 mt-2 mb-8">Click the heart icon on any vehicle to save it here.</p>
                    <Link to="/" className="btn-premium py-4 bg-rose-600 hover:bg-rose-700 hover:shadow-rose-100">Find Something Special</Link>
                </div>
            )}
        </div>
    );
}
