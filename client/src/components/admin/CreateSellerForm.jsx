import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Check, AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function CreateSellerForm({ onCreated, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [successData, setSuccessData] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const res = await axios.post(
                "http://localhost:4000/api/admin/sellers",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessData(res.data);
            if (onCreated) onCreated();
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.details?.[0] || "Failed to create seller account");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (successData?.temporaryPassword) {
            navigator.clipboard.writeText(successData.temporaryPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (successData) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 mb-6 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <Check size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">Seller Account Created!</h3>
                    <p className="text-emerald-700 mb-6">
                        The account for <strong>{successData.seller.name}</strong> is now active.
                    </p>

                    {successData.temporaryPassword && (
                        <div className="w-full max-w-md bg-white rounded-xl p-4 border border-emerald-200 shadow-sm mb-6">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Temporary Password</p>
                            <div className="flex items-center justify-between gap-4">
                                <code className="text-xl font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded">
                                    {successData.temporaryPassword}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 italic">
                                {successData.note}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => { setSuccessData(null); setFormData({ name: '', email: '', password: '', phone: '', address: '' }); }}
                        className="text-emerald-700 font-bold hover:text-emerald-900 underline text-sm"
                    >
                        Create Another Seller
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 mb-8 animate-fade-in border-indigo-100/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Add New Seller</h3>
                    <p className="text-xs text-slate-500">Create a vendor account for car listings</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <input
                            name="name"
                            className="input-premium"
                            placeholder="e.g. Acme Motors"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            className="input-premium"
                            placeholder="e.g. contact@acmemotors.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone (Optional)</label>
                        <input
                            name="phone"
                            className="input-premium"
                            placeholder="e.g. +855 12 345 678"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Address (Optional)</label>
                        <input
                            name="address"
                            className="input-premium"
                            placeholder="e.g. Phnom Penh, Cambodia"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Password <span className="text-slate-300 font-normal normal-case">(Optional - Auto-generated if empty)</span>
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="input-premium pr-12"
                                placeholder="Leave empty to auto-generate secure password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-premium flex-[2] flex items-center justify-center gap-2"
                    >
                        {isLoading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Create Account"}
                    </button>
                </div>
            </form>
        </div>
    );
}
