import { useState } from "react";
import { API_BASE } from "../api/config.js";
import "./UploadForm.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CameraAltTwoToneIcon from '@mui/icons-material/CameraAltTwoTone';

function UploadForm({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return;

    setMessage("Getting upload URLs...");

    for (const file of files) {
      // Request a SAS upload URL from backend
      const res = await fetch(`${API_BASE}/UploadMedia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });

      const { uploadUrl } = await res.json();

      setMessage(`Uploading ${file.name}...`);

      // Upload the file to Azure Blob Storage
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "x-ms-blob-type": "BlockBlob" },
        body: file,
      });

      if (!uploadRes.ok) {
        setMessage(`Upload failed for ${file.name}.`);
        return;
      }
    }

    setMessage("All uploads successful!");
    setFiles([]);
    if (onUploadComplete) onUploadComplete();
  };

  const handleFileChange = (e) => {
    setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-root">
      <h2 className="slideshow-title">
        <CameraAltTwoToneIcon fontSize="inherit" /> Upload Images
      </h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className={`upload-label-row${files.length ? " has-file" : ""}`}>
          <label className="upload-label" style={{ flex: 1 }}>
            <span>Select images to upload below:</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="upload-input"
            />
          </label>
        </div>
        {files.length > 0 && (
          <div className="upload-preview">
            {files.map((file, idx) => (
              <div className="upload-preview-img-wrapper" key={idx}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="upload-preview-img"
                />
                <div className="upload-preview-name">{file.name}</div>
                <button
                  type="button"
                  className="upload-remove-btn"
                  onClick={() => handleRemoveFile(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <button className="upload-btn" type="submit" disabled={!files.length}>
          Upload <br />
          <FileUploadIcon />
        </button>
        <p className="upload-message">{message}</p>
      </form>
    </div>
  );
}

export default UploadForm;
