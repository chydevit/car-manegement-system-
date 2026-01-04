import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // First, quick check if server is there
      try {
        await axios.get("http://localhost:4000/ping");
      } catch (e) {
        setError("Cannot reach server at port 4000. Please ensure the backend is running.");
        setIsLoading(false);
        return;
      }

      const r = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      login(r.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container min-h-[70vh] flex items-center justify-center py-12 animate-fade-in">
      <div className="glass-panel p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-200">
            <span className="text-2xl font-black">V</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium italic">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              placeholder="name@example.com"
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-premium w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 mb-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>

          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Demo Credentials</p>
          <div className="mt-2 text-[10px] text-slate-500 space-y-1">
            <p>Admin: admin@example.com / admin123</p>
            <p>Seller: seller@example.com / seller123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
