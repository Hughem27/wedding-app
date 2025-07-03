import UploadForm from "./components/UploadForm";
import Slideshow from "./components/SlideShow";

function App() {
  return (
    <div>
      <h1>Welcome to Hugh and Hannahs Wedding!</h1>
      <h3>Upload Your Photo Here!</h3>
      <UploadForm />
      <>
        <Slideshow />
      </>
    </div>
  );
}

export default App;
