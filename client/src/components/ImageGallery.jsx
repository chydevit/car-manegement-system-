import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

const ImageGallery = ({ images = [], altTitle = "Car image" }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Filter out invalid images and sort (primary first, then by order)
    const validImages = Array.isArray(images)
        ? [...images].sort((a, b) => {
            if (a.isPrimary === b.isPrimary) return a.displayOrder - b.displayOrder;
            return a.isPrimary ? -1 : 1;
        })
        : [];

    // If no images provided, we might want to display a placeholder or return null
    // But typically this component is used where we expect at least one image or a placeholder logic handles it outside
    if (validImages.length === 0) {
        return (
            <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                No images available
            </div>
        );
    }

    const currentImage = validImages[selectedImageIndex];

    const nextImage = (e) => {
        e?.stopPropagation();
        setSelectedImageIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        setSelectedImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    const openLightbox = () => setLightboxOpen(true);
    const closeLightbox = () => setLightboxOpen(false);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-slate-100 group cursor-pointer"
                onClick={openLightbox}
            >
                <img
                    src={currentImage.imageUrl}
                    alt={`${altTitle} - View ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Navigation Arrows (only if multiple images) */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={20} />
                </div>
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {validImages.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative flex-shrink-0 w-24 aspect-[4/3] rounded-lg overflow-hidden transition-all
                ${selectedImageIndex === index
                                    ? "ring-2 ring-indigo-500 ring-offset-2"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={image.imageUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <img
                        src={validImages[selectedImageIndex].imageUrl}
                        alt="Full screen view"
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white transition-colors"
                            >
                                <ChevronLeft size={48} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white transition-colors"
                            >
                                <ChevronRight size={48} />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 font-medium">
                        {selectedImageIndex + 1} / {validImages.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
