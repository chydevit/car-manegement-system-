import React, { useState } from "react";
import axios from "axios";

export default function CarForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:4000/api/cars",
        { title, price: Number(price), description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setPrice("");
      setDesc("");
      if (onCreated) onCreated();
    } catch (err) {
      alert("Error creating car listing");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Vehicle Title</label>
        <input
          className="input-premium"
          placeholder="e.g. 2024 Porsche 911 Carrera"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Listing Price ($)</label>
        <input
          className="input-premium"
          type="number"
          placeholder="e.g. 120000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
        <textarea
          className="input-premium h-32 resize-none"
          placeholder="Describe the vehicle's features, history, and condition..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
      </div>
      <button
        className="btn-premium w-full flex items-center justify-center gap-2"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : "Publish Listing"}
      </button>
    </form>
  );
}
