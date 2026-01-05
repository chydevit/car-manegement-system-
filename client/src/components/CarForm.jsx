import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUpload from "./ImageUpload";

export default function CarForm({ onCreated, existingCar, onCancel }) {
  const [formData, setFormData] = useState(existingCar ? {
    title: existingCar.title,
    price: existingCar.price,
    description: existingCar.description,
    brand: existingCar.brand || "",
    model: existingCar.model || "",
    year: existingCar.year || new Date().getFullYear(),
    fuelType: existingCar.fuelType || "Gasoline"
  } : {
    title: "",
    price: "",
    description: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    fuelType: "Gasoline"
  });

  const [images, setImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]); // To track deletions
  const [isLoading, setIsLoading] = useState(false);

  // Fetch images if editing existing car
  useEffect(() => {
    if (existingCar) {
      const fetchImages = async () => {
        try {
          // If existingCar already has full image data, use it
          if (existingCar.images && Array.isArray(existingCar.images)) {
            setImages(existingCar.images);
            setInitialImages(existingCar.images);
          } else {
            // Otherwise fetch from API
            const res = await axios.get(`http://localhost:4000/api/cars/${existingCar.id}/images`);
            setImages(res.data);
            setInitialImages(res.data);
          }
        } catch (err) {
          console.error("Error fetching images:", err);
        }
      };
      fetchImages();
    }
  }, [existingCar]);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      let carId;

      // 1. Create or Update Car details
      if (existingCar) {
        carId = existingCar.id;
        await axios.put(
          `http://localhost:4000/api/cars/${carId}`,
          {
            ...formData,
            price: Number(formData.price),
            year: Number(formData.year)
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const res = await axios.post(
          "http://localhost:4000/api/cars",
          {
            ...formData,
            price: Number(formData.price),
            year: Number(formData.year)
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        carId = res.data.id;
      }

      // 2. Handle Image Deletions (only for existing cars)
      if (existingCar) {
        const currentImageIds = images.filter(img => img.id).map(img => img.id);
        const imagesToDelete = initialImages.filter(img => !currentImageIds.includes(img.id));

        for (const img of imagesToDelete) {
          await axios.delete(
            `http://localhost:4000/api/cars/${carId}/images/${img.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // 3. Handle New Image Uploads
      const newImages = images.filter(img => !img.id && img.file);
      if (newImages.length > 0) {
        const uploadData = new FormData();
        newImages.forEach(img => {
          uploadData.append("images", img.file);
        });

        const uploadRes = await axios.post(
          `http://localhost:4000/api/cars/${carId}/images`,
          uploadData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );

        // If the user selected a primary image among the NEW ones, we might need to update it
        // But the backend ensures the first one set becomes primary if no others exist.
        // For simplicity, we rely on backend order or update later if needed.
        // If strict primary selection is needed for new images mixed with old, 
        // we'd need to map the returned IDs back to the UI selection.
      }

      // 4. Handle Primary Image Updates (for existing images)
      const primaryImage = images.find(img => img.isPrimary && img.id);
      if (primaryImage) {
        // Check if it was already primary to avoid unnecessary requests
        const wasPrimary = initialImages.find(img => img.id === primaryImage.id)?.isPrimary;
        if (!wasPrimary) {
          await axios.put(
            `http://localhost:4000/api/cars/${carId}/images/${primaryImage.id}`,
            { isPrimary: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      if (!existingCar) {
        setFormData({
          title: "",
          price: "",
          description: "",
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          fuelType: "Gasoline"
        });
        setImages([]);
      }

      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert("Error saving car listing: " + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Vehicle Title</label>
          <input
            name="title"
            className="input-premium"
            placeholder="e.g. 2024 Porsche 911 Carrera"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload Section */}
        <div className="col-span-1 md:col-span-2">
          <ImageUpload
            images={images}
            onChange={setImages}
            maxImages={10}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Brand</label>
          <input
            name="brand"
            className="input-premium"
            placeholder="e.g. Porsche"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Model</label>
          <input
            name="model"
            className="input-premium"
            placeholder="e.g. 911"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Year</label>
          <input
            name="year"
            type="number"
            className="input-premium"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Fuel Type</label>
          <select
            name="fuelType"
            className="input-premium"
            value={formData.fuelType}
            onChange={handleChange}
          >
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Listing Price ($)</label>
          <input
            name="price"
            className="input-premium"
            type="number"
            placeholder="e.g. 120000"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
        <textarea
          name="description"
          className="input-premium h-32 resize-none"
          placeholder="Describe the vehicle's features, history, and condition..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
        )}
        <button
          className="btn-premium flex-[2] flex items-center justify-center gap-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (existingCar ? "Update Listing" : "Publish Listing")}
        </button>
      </div>
    </form>
  );
}
