import React, { useState } from 'react';
import './App.css';
import SideBar from './SideBar';

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file change event
  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  // Handle file upload and migration
  const handleUpload = async () => {
    if (!csvFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    setLoading(true);
    setUploadStatus('');

    try {
      const response = await fetch('http://localhost:8080/api/uploadAndMigrate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus(result.message);
      } else {
        setUploadStatus(result.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* <SideBar /> */}
      <div className="upload-container">
        <h2>Upload CSV for Data Migration</h2>

        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload and Migrate'}
        </button>

        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
}

export default App;
