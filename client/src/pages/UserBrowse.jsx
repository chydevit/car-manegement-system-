import React, { useState } from "react";
import CarList from "../components/CarList";

export default function UserBrowse() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    brand: "All",
    fuel: "All",
    minPrice: "",
    maxPrice: ""
  });

  const brands = ["All", "Aura", "Defender", "Lunar", "Tesla", "Vibe"];
  const fuelTypes = ["All", "Electric", "Gasoline", "Hybrid"];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="glass-panel p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Model name..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Filters</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Brand</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none"
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Fuel Type</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none"
                    value={filters.fuel}
                    onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                  >
                    {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setFilters({ brand: "All", fuel: "All", minPrice: "", maxPrice: "" });
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                  Clear All
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Inventory</h2>
                <p className="text-slate-500 text-sm mt-1">Discover your next dream vehicle</p>
              </div>
            </div>

            <CarList
              searchQuery={search}
              filterCriteria={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
