import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../APIs/axios";
import "../App.css";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await API.get("/galleries/published");
        const publishedImages = response.data.filter(
          (img) => img.status === "Publish"
        );
        setImages(publishedImages); // only set published images
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setError("Failed to load gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchImages();
  }, []);
  

  return (
    <div className="bg-white min-h-screen font-robotoSerif">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-2 text-black">
            Exploring Our Moments from Lotus Blanc
          </h2>
          <p className="text-gray-700 max-w-2xl">
            Explore the heart of Lotus Blanc through our gallery — from the
            artistry of our dishes and baked goods to the vibrant energy of our
            students in training. Each image tells a story of learning, passion,
            and purpose.
          </p>
        </section>

        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading gallery...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No images to display.</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[150px]">
            {images.map((img, index) => {
              const isSelected = selectedImageIndex === index;

              return (
                <div
                  key={img.id || index}
                  onClick={() =>
                    setSelectedImageIndex(isSelected ? null : index)
                  }
                  className={`relative cursor-pointer overflow-hidden rounded-lg shadow transition-all duration-300 ${
                    isSelected ? "col-span-2 row-span-3" : ""
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.title || `Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-60 text-black p-4">
                      <h3 className="text-lg font-semibold">{img.title}</h3>
                      <p className="text-sm">
                        {img.description || "No description provided."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
