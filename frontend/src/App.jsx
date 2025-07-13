
import UploadForm from "./components/UploadForm";
import Slideshow from "./components/SlideShow";
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Welcome to Hugh and Hannah's Wedding!</h1>
      </header>
      <main className="app-main">
        <section className="app-upload-section">          
          <UploadForm />
        </section>
        <section className="app-slideshow-section">
          <Slideshow />
        </section>
      </main>
    </div>
  );
}

export default App;
