
import { useEffect, useState } from "react";
import { API_BASE } from "../api/config";
import "./SlideShow.css";

function Slideshow() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch image list on mount
    fetch(`${API_BASE}/ListMedia`)
      .then((res) => res.json())
      .then((data) => {
        if (data.images) {
          setImages(data.images);
        }
      });
  }, []);

  // Auto-advance the slideshow every 5 seconds
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <p>Loading slideshow...</p>;
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="slideshow-root">
      <h2 className="slideshow-title">Wedding Slideshow</h2>
      <div className="slideshow-image-container" style={{ position: "relative" }}>
        <button
          className="slideshow-nav-btn prev"
          onClick={goToPrev}
          aria-label="Previous photo"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
        >
          &#8592;
        </button>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="slideshow-image"
        />
        <button
          className="slideshow-nav-btn next"
          onClick={goToNext}
          aria-label="Next photo"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
        >
          &#8594;
        </button>
      </div>
      <button
        className="slideshow-download-btn"
        onClick={() => {
          const link = document.createElement('a');
          link.href = images[currentIndex];
          link.download = images[currentIndex].split('/').pop() || `slide-${currentIndex}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        Download This Photo
      </button>
    </div>
  );
}

export default Slideshow;
