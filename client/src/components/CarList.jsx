import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CarList({
  sellerId,
  refreshTrigger,
}) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:4000/api/cars")
      .then((r) => {
        let data = r.data;
        if (sellerId) data = data.filter((c) => c.sellerId === sellerId);
        setCars(data);
      })
      .finally(() => setLoading(false));
  }, [sellerId, refreshTrigger]);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="h-8 w-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {cars.map((c) => (
        <Link
          key={c.id}
          to={`/cars/${c.id}`}
          className="bg-white/50 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:bg-white transition-all shadow-sm hover:shadow-md group decoration-transparent"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={c.image || "https://source.unsplash.com/100x100/?car"}
              alt={c.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-grow">
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-indigo-600">${c.price.toLocaleString()}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.status}</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
            View
          </div>
        </Link>
      ))}
      {cars.length === 0 && (
        <div className="text-center py-10">
          <p className="text-sm text-slate-400 italic">No listings found.</p>
        </div>
      )}
    </div>
  );
}
