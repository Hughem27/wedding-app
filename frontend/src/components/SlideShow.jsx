import { useEffect, useState } from "react";
import { API_BASE } from "../api/config";
import "./SlideShow.css";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SlideshowTwoToneIcon from '@mui/icons-material/SlideshowTwoTone';

function Slideshow() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);

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
    // if (images.length === 0) return;

    // const interval = setInterval(() => {
    //   setCurrentIndex((prev) => (prev + 1) % images.length);
    // }, 10000);

    // return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <p>Loading slideshow...</p>;
  }

  const goToPrev = () => {
    setPrevIndex(currentIndex);
    setSlideDirection("left");
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setPrevIndex(currentIndex);
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="slideshow-root">
      <h2 className="slideshow-title"> <SlideshowTwoToneIcon fontSize="inherit"></SlideshowTwoToneIcon> Wedding Slideshow</h2>
      <div className="slideshow-image-container" style={{ position: "relative", overflow: "hidden" }}>
        {prevIndex !== null && (
          <img
            src={images[prevIndex]}
            alt={`Slide ${prevIndex}`}
            className="slideshow-image"
            key={prevIndex}
          />
        )}
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="slideshow-image"
          key={currentIndex}
          style={{ cursor: "pointer" }}
          onClick={() => {
            // Create overlay for fullscreen image
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "#000";
            overlay.style.zIndex = "9999";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";

            // Create fullscreen image
            const imgEl = document.createElement("img");
            imgEl.src = images[currentIndex];
            imgEl.style.maxWidth = "100vw";
            imgEl.style.maxHeight = "100vh";
            imgEl.style.objectFit = "contain";
            imgEl.style.background = "#000";
            imgEl.style.cursor = "default";

            // Create back button
            const backBtn = document.createElement("button");
            backBtn.innerText = "Back";
            backBtn.style.position = "absolute";
            backBtn.style.top = "2rem";
            backBtn.style.left = "2rem";
            backBtn.style.padding = "0.7rem 1.5rem";
            backBtn.style.fontSize = "1.1rem";
            backBtn.style.background = "#fff";
            backBtn.style.color = "#b47b4d";
            backBtn.style.border = "none";
            backBtn.style.borderRadius = "0.7rem";
            backBtn.style.boxShadow = "0 2px 8px 0 rgba(31, 38, 135, 0.10)";
            backBtn.style.cursor = "pointer";
            backBtn.style.fontWeight = "600";
            backBtn.onclick = () => document.body.removeChild(overlay);

            // Create download button
            const downloadBtn = document.createElement("button");
            downloadBtn.innerText = "Download";
            downloadBtn.style.position = "absolute";
            downloadBtn.style.top = "2rem";
            downloadBtn.style.right = "2rem";
            downloadBtn.style.padding = "0.7rem 1.5rem";
            downloadBtn.style.fontSize = "1.1rem";
            downloadBtn.style.background = "#fff";
            downloadBtn.style.color = "#b47b4d";
            downloadBtn.style.border = "none";
            downloadBtn.style.borderRadius = "0.7rem";
            downloadBtn.style.boxShadow = "0 2px 8px 0 rgba(31, 38, 135, 0.10)";
            downloadBtn.style.cursor = "pointer";
            downloadBtn.style.fontWeight = "600";
            downloadBtn.onclick = () => {
              const link = document.createElement("a");
              link.href = images[currentIndex];
              link.download =
                images[currentIndex].split("/").pop() ||
                `slide-${currentIndex}.jpg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            overlay.appendChild(imgEl);
            overlay.appendChild(backBtn);
            overlay.appendChild(downloadBtn);
            document.body.appendChild(overlay);
          }}
        />
      </div>
      {/* Image preview scrollbar */}
      <div className="slideshow-preview-bar">
        {images.map((img, idx) => (
          <button
            key={idx}
            className={`slideshow-preview-thumb${idx === currentIndex ? " active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            tabIndex={0}
          >
            <img src={img} alt={`Preview ${idx}`} />
          </button>
        ))}
      </div>
      <div className="slideshow-controls" style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginTop: "1rem",
      }}>
        <button
          className="slideshow-nav-btn prev"
          onClick={goToPrev}
          aria-label="Previous photo"
        >
          <NavigateBeforeIcon />
        </button>
        <button
          className="slideshow-nav-btn next"
          onClick={goToNext}
          aria-label="Next photo"
        >
          <NavigateNextIcon />
        </button>
      </div>
      <button
        className="slideshow-download-btn"
        onClick={() => {
          const link = document.createElement("a");
          link.href = images[currentIndex];
          link.download =
            images[currentIndex].split("/").pop() ||
            `slide-${currentIndex}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        Download this image <br />
        <DownloadIcon />
      </button>
    </div>
  );
}

export default Slideshow;
