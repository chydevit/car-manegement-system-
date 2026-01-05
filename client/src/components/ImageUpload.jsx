import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Star, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ImageUpload = ({ images = [], onChange, maxImages = 10 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            images.forEach(image => {
                if (image.preview && image.file) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file) => {
        // Check type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            return "Only JPEG, PNG, and WebP images are allowed.";
        }
        // Check size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return `Image ${file.name} exceeds the 5MB limit.`;
        }
        return null;
    };

    const handleFiles = (files) => {
        setError(null);

        if (images.length + files.length > maxImages) {
            setError(`You can only upload a maximum of ${maxImages} images.`);
            return;
        }

        const newImages = [];

        Array.from(files).forEach(file => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }

            newImages.push({
                file,
                preview: URL.createObjectURL(file),
                isPrimary: images.length === 0 && newImages.length === 0 // Make first image primary if none exist
            });
        });

        if (newImages.length > 0) {
            onChange([...images, ...newImages]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];

        // If removing primary, set next available as primary
        if (newImages[index].isPrimary && newImages.length > 1) {
            const nextIndex = index === 0 ? 1 : 0;
            newImages[nextIndex].isPrimary = true;
        }

        // Revoke URL if it's a preview
        if (newImages[index].preview && newImages[index].file) {
            URL.revokeObjectURL(newImages[index].preview);
        }

        newImages.splice(index, 1);
        onChange(newImages);
    };

    const setPrimary = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }));
        onChange(newImages);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">
                    Car Images ({images.length}/{maxImages})
                </label>
                {error && (
                    <div className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>

            <div
                className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
          ${dragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleChange}
                />

                <Upload size={32} className={`mb-2 ${dragActive ? "text-indigo-600" : "text-slate-400"}`} />
                <p className="text-sm font-medium text-slate-600">
                    Drag & drop images here, or click to select
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    JPEG, PNG, WebP (max 5MB)
                </p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                            <img
                                src={image.preview || image.imageUrl}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setPrimary(index); }}
                                    className={`p-2 rounded-full ${image.isPrimary ? "bg-yellow-400 text-white" : "bg-white/20 text-white hover:bg-white/40"}`}
                                    title="Set as primary"
                                >
                                    <Star size={16} fill={image.isPrimary ? "currentColor" : "none"} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow-sm text-white">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
