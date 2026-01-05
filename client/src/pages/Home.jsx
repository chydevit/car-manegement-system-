import React, { useEffect, useState } from "react";
import { CarFront } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:4000/api/cars")
      .then((r) => {
        setCars(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Premium <span className="text-indigo-600">Fleet</span>
          </h2>
          <p className="text-slate-500 mt-2 text-lg italic">Discover your next masterpiece on wheels</p>
        </div>
        <div className="hidden md:block">
          <span className="bg-white/50 px-4 py-2 rounded-full text-sm font-medium border border-white/50 shadow-sm">
            {cars.length} vehicles available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((c) => (
          <div key={c.id} className="card-premium group">
            <div className="relative h-64 overflow-hidden">
              <img
                src={c.primaryImage?.imageUrl || c.image || `https://source.unsplash.com/800x600/?car,${c.id}`}
                alt={c.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${c.status === 'available' ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/20 text-amber-600 border-amber-500/20'
                  }`}>
                  {c.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {c.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-6 h-10">
                {c.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-widest mb-1">Price</span>
                  <div className="text-2xl font-extrabold text-indigo-600">${c.price.toLocaleString()}</div>
                </div>
                <Link
                  to={`/cars/${c.id}`}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="glass-panel p-20 text-center">
          <div className="mb-6 text-slate-900"><CarFront size={64} strokeWidth={1.5} /></div>
          <h3 className="text-2xl font-bold text-slate-900">No cars found</h3>
          <p className="text-slate-500 mt-2">Checking our garage... Please wait a moment.</p>
        </div>
      )}
    </div>
  );
}
