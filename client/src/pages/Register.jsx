import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const r = await axios.post("http://localhost:4000/api/auth/register", {
                name,
                email,
                password,
                role
            });
            login(r.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container min-h-[80vh] flex items-center justify-center py-12 animate-fade-in">
            <div className="glass-panel p-10 w-full max-w-md shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-200">
                        <span className="text-2xl font-black">V</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 mt-2 font-medium italic">Join the Vibe Wheels community</p>
                </div>

                <form onSubmit={submit} className="space-y-6 text-left">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <input
                            placeholder="John Doe"
                            className="input-premium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            placeholder="name@example.com"
                            type="email"
                            className="input-premium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            placeholder="••••••••"
                            type="password"
                            className="input-premium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">I want to...</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => setRole("user")}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === "user"
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md"
                                        : "border-slate-100 hover:border-slate-200 text-slate-400"
                                    }`}
                            >
                                <span className="text-xl">🏁</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Buy Cars</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("seller")}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === "seller"
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md"
                                        : "border-slate-100 hover:border-slate-200 text-slate-400"
                                    }`}
                            >
                                <span className="text-xl">💰</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Sell Cars</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-premium w-full flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : "Join Now"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
