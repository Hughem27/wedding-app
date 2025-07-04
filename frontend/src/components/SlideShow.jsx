import { useEffect, useState } from 'react';
import { API_BASE } from '../api/config';


function Slideshow() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch image list on mount
    fetch(`${API_BASE}/ListMedia`)
      .then(res => res.json())
      .then(data => {
        if (data.images) {
          setImages(data.images);
        }
      });
  }, []);

  // Auto-advance the slideshow every 5 seconds
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <p>Loading slideshow...</p>;
  }

  return (
    <div>
      <h2>Wedding Slideshow</h2>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
      />
    </div>
  );
}

export default Slideshow;
