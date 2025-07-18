import UploadForm from "./components/UploadForm";
import Slideshow from "./components/SlideShow";
import { useRef } from "react";
import "./App.css";
import FooterQR from "./components/Footer";
import './components/Footer.css';

function App() {
  const slideshowRef = useRef();

  const handleUploadComplete = () => {
    if (
      slideshowRef.current &&
      typeof slideshowRef.current.refreshImages === "function"
    ) {
      slideshowRef.current.refreshImages();
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            {/* You can replace this with a wedding icon or logo if available */}
            <span role="img" aria-label="wedding" style={{ fontSize: "2.5rem" }}>
              💍
            </span>
          </div>
          <div className="header-text">
            <h1 className="header-title">Hannah & Hugh's Wedding</h1>
            {/* <p className="header-subtitle">Share your memories and enjoy the day</p> */}
          </div>
        </div>
      </header>
      <main className="app-main">
        <section className="app-upload-section">
          <UploadForm onUploadComplete={handleUploadComplete} />
        </section>
        <section className="app-slideshow-section">
          <Slideshow ref={slideshowRef} />
        </section>
        <FooterQR></FooterQR>        
      </main>      
    </div>
  );
}

export default App;
