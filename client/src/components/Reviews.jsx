import React, { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

export function ReviewForm({ carId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login to leave a review");
        if (!comment.trim()) return alert("Please enter a comment");

        setSubmitting(true);
        try {
            await axios.post("http://localhost:4000/api/reviews", {
                carId,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComment("");
            setRating(5);
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Leave a Review</h4>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className={`text-xl transition-transform hover:scale-120 ${s <= rating ? 'grayscale-0' : 'grayscale text-slate-300'}`}
                            >
                                <Star size={24} className={`transition-all ${s <= rating ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-slate-300'}`} />
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    className="w-full input-premium h-24 resize-none text-sm"
                    placeholder="Share your experience with this vehicle..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 btn-premium text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    {submitting ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Review"}
                </button>
            </div>
        </form>
    );
}

export function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <p className="text-sm text-slate-400 italic py-4">No reviews yet. Be the first to share your thoughts!</p>;
    }

    return (
        <div className="space-y-4 py-4">
            {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-white/50 border border-slate-100 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 uppercase">
                                {r.userName[0]}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-900">{r.userName}</div>
                                <div className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="flex text-[10px] gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{r.comment}"</p>
                </div>
            ))}
        </div>
    );
}
