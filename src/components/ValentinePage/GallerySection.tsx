import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ValentinePhoto } from '../../types/valentine';

interface GallerySectionProps {
  photos: ValentinePhoto[];
}

export function GallerySection({ photos }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-rose-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-rose-600 text-center mb-4">
          Our Memories
        </h2>
        <p className="text-lg text-rose-400 text-center mb-12">
          Every moment with you is a treasure
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.photo_url}
                alt={photo.caption || `Memory ${index + 1}`}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-sm font-light">{photo.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors z-50"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white hover:text-rose-300 transition-colors z-50"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white hover:text-rose-300 transition-colors z-50"
          >
            <ChevronRight size={48} />
          </button>

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={photos[currentIndex].photo_url}
              alt={photos[currentIndex].caption || `Memory ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {photos[currentIndex].caption && (
              <p className="text-white text-center mt-6 text-lg">
                {photos[currentIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
