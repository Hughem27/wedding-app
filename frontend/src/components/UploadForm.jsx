
import { useState } from "react";
import { API_BASE } from "../api/config.js";
import "./UploadForm.css";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  console.log("API_Base: " + API_BASE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setMessage("Getting upload URL...");

    // Request a SAS upload URL from backend
    const res = await fetch(`${API_BASE}/UploadMedia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name }),
    });

    const { uploadUrl } = await res.json();

    setMessage("Uploading...");

    // Upload the file to Azure Blob Storage
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "x-ms-blob-type": "BlockBlob" },
      body: file,
    });

    if (uploadRes.ok) {
      setMessage("Upload successful!");
    } else {
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="upload-root">
      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="upload-label">
          <span>Select an image to upload:</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="upload-input"
          />
        </label>
        <button className="upload-btn" type="submit">Upload</button>
        <p className="upload-message">{message}</p>
      </form>
    </div>
  );
}

export default UploadForm;
