import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function CarDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [order, setOrder] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Fetch car details
        axios.get(`http://localhost:4000/api/cars/${id}`)
            .then((r) => {
                setCar(r.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });

        // Check if favorite
        if (token) {
            axios.get("http://localhost:4000/api/favorites", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => {
                setIsFavorite(r.data.includes(Number(id)));
            }).catch(e => console.error("Could not fetch favorites", e));
        }
    }, [id]);

    const toggleFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            const r = await axios.post("http://localhost:4000/api/favorites/toggle",
                { carId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsFavorite(r.data.status === "added");
        } catch (err) {
            console.error("Toggle favorite failed", err);
        }
    };

    const handleBuy = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            const r = await axios.post("http://localhost:4000/api/payments/checkout",
                { carId: car.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrder(r.data.order);
            setShowPayment(true);
        } catch (err) {
            alert(err.response?.data?.error || "Checkout failed");
        }
    };

    const confirmPayment = async () => {
        setIsPaying(true);
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:4000/api/payments/confirm-payment",
                { orderId: order.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTimeout(() => {
                setIsPaying(false);
                setShowPayment(false);
                alert("Payment Successful! The car is now yours.");
                window.location.reload();
            }, 2000);
        } catch (err) {
            setIsPaying(false);
            alert("Payment confirmation failed");
        }
    };

    const delistCar = async () => {
        if (!window.confirm("Are you sure you want to remove this listing?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:4000/api/cars/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Listing removed successfully");
            navigate("/");
        } catch (err) {
            alert("Failed to remove listing");
        }
    };

    if (loading) {
        return (
            <div className="container py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold">Vehicle Not Found</h2>
                <button onClick={() => navigate("/")} className="btn-premium mt-4">Go Back Home</button>
            </div>
        );
    }

    return (
        <div className="container py-12 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-xs uppercase tracking-widest"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Listings
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="card-premium p-0 h-[500px]">
                    <img
                        src={car.image || `https://source.unsplash.com/1200x800/?car,${car.id}`}
                        alt={car.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-600/10 mb-4 inline-block">
                            {car.status}
                        </span>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2 italic">
                            {car.title}
                        </h1>
                        <p className="text-xl text-slate-500 font-medium">Exclusive Collection</p>
                    </div>

                    <div className="glass-panel p-8 mb-8 border-indigo-100 shadow-indigo-100">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mb-2 font-outfit">Starting at</div>
                        <div className="text-5xl font-extrabold text-indigo-600">${car.price.toLocaleString()}</div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <p className="text-slate-600 leading-relaxed text-lg italic">
                            "{car.description}"
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Condition</div>
                                <div className="font-bold text-slate-900">Pristine</div>
                            </div>
                            <div className="p-4 bg-white/50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Availability</div>
                                <div className="font-bold text-slate-900">In Stock</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={handleBuy}
                            disabled={car.status !== "available" || (user && (user.role === "admin" || user.role === "seller"))}
                            className="btn-premium flex-grow py-5 shadow-2xl shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none"
                        >
                            {car.status === "available"
                                ? (user && (user.role === "admin" || user.role === "seller") ? "Only Buyers Can Buy" : "Buy with KHQR")
                                : "Already Sold"}
                        </button>
                        <button
                            onClick={toggleFavorite}
                            className={`px-8 py-5 rounded-xl border-2 transition-all active:scale-95 ${isFavorite
                                ? "bg-rose-50 border-rose-200 text-rose-500 shadow-lg shadow-rose-100"
                                : "border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorite ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {(user && (user.role === 'admin' || user.id === car.sellerId)) && (
                        <button
                            onClick={delistCar}
                            className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition-all active:scale-95 text-xs uppercase tracking-widest"
                        >
                            Remove Listing from Market
                        </button>
                    )}
                </div>
            </div>

            {/* KHQR Modal */}
            {showPayment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="glass-panel max-w-sm w-full p-8 text-center bg-white shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Scan to Pay</h3>
                            <button onClick={() => setShowPayment(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl mb-6 relative group">
                            <img src="/images/khqr.png" alt="KHQR Code" className="w-full aspect-square object-contain mix-blend-multiply" />
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-sm">
                                    Official KHQR
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</div>
                            <div className="text-3xl font-black text-slate-900 italic">${car.price.toLocaleString()}</div>
                        </div>

                        <button
                            onClick={confirmPayment}
                            disabled={isPaying}
                            className="btn-premium w-full py-4 flex items-center justify-center gap-3"
                        >
                            {isPaying ? (
                                <>
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "I have paid"
                            )}
                        </button>

                        <p className="mt-4 text-[10px] text-slate-400 font-medium">
                            Payments are secure and encrypted. Scan the code with any KHQR enabled banking app.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
