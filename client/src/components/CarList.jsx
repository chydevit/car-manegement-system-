import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CarList({
  sellerId,
  refreshTrigger,
  onStatusUpdate,
  onSell,
  onEdit,
  searchQuery,
  filterCriteria
}) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:4000/api/cars")
      .then((r) => {
        let data = r.data;

        // 1. Role-based filtering
        if (sellerId) {
          data = data.filter((c) => c.sellerId === sellerId);
        } else {
          data = data.filter((c) => c.status === "available");
        }

        // 2. Search filtering
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          data = data.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.brand.toLowerCase().includes(q)
          );
        }

        // 3. Criteria filtering
        if (filterCriteria) {
          if (filterCriteria.brand !== "All") {
            data = data.filter(c => c.brand === filterCriteria.brand);
          }
          if (filterCriteria.fuel !== "All") {
            data = data.filter(c => c.fuelType === filterCriteria.fuel);
          }
          if (filterCriteria.minPrice) {
            data = data.filter(c => c.price >= Number(filterCriteria.minPrice));
          }
          if (filterCriteria.maxPrice) {
            data = data.filter(c => c.price <= Number(filterCriteria.maxPrice));
          }
        }

        setCars(data);
      })
      .finally(() => setLoading(false));
  }, [sellerId, refreshTrigger, searchQuery, filterCriteria]);

  const getCarImage = (c) => {
    if (c.primaryImage?.imageUrl) return c.primaryImage.imageUrl;
    if (c.images && c.images.length > 0) return c.images[0].imageUrl;
    return c.image || "https://source.unsplash.com/100x100/?car";
  };

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
              src={getCarImage(c)}
              alt={c.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-grow">
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-bold text-indigo-600">${Number(c.price).toLocaleString()}</span>
              <span className="text-slate-200">|</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${c.status === 'available' ? 'bg-emerald-50 text-emerald-500' :
                c.status === 'reserved' ? 'bg-indigo-50 text-indigo-500' :
                  c.status === 'pending' ? 'bg-amber-50 text-amber-500' :
                    'bg-red-50 text-red-400'
                }`}>
                {c.status}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to={`/cars/${c.id}`}
              className="px-3 py-1 rounded-lg bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all text-center decoration-transparent"
            >
              View
            </Link>
            {sellerId && (
              <button
                onClick={(e) => { e.preventDefault(); onEdit(c); }}
                className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-all font-bold"
              >
                Edit
              </button>
            )}
            {sellerId && c.status === 'available' && (
              <button
                onClick={(e) => { e.preventDefault(); onStatusUpdate(c.id, 'reserved'); }}
                className="px-3 py-1 rounded-lg bg-amber-50 text-[10px] font-bold text-amber-600 uppercase tracking-widest hover:bg-amber-100 transition-all"
              >
                Reserve
              </button>
            )}
            {sellerId && (c.status === 'available' || c.status === 'reserved') && (
              <button
                onClick={(e) => { e.preventDefault(); onSell(c); }}
                className="px-3 py-1 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:bg-emerald-100 transition-all"
              >
                Sold
              </button>
            )}
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
