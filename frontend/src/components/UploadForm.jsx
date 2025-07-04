import { useState } from 'react';
import API_BASE from UploadForm

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setMessage('Getting upload URL...');

    // Step 1: Request a SAS upload URL from your backend
    const res = await fetch(`${API_BASE}/UploadMedia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name }),
    });

    const { uploadUrl } = await res.json();

    setMessage('Uploading...');

    // Step 2: Upload the file directly to Azure Blob Storage
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'x-ms-blob-type': 'BlockBlob' },
      body: file,
    });

    if (uploadRes.ok) {
      setMessage('Upload successful!');
    } else {
      setMessage('Upload failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      <p>{message}</p>
    </form>
  );
}

export default UploadForm;
