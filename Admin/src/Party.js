import { useState } from "react";
import SideBar from "./SideBar";

function Party({type}) {
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(""); // New state for file name
  const endpointMap = {
    party: "PartyModal",
    Subparty: "SubParty",
    Sales: "sales",
    Stock: "stock",
    Payment: "payment",
    Purchase: "purchase",
  };
  
  // Handle file change event
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
    setFileName(file ? file.name : ""); // Update file name state
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setUploadStatus("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("csvFile", csvFile);
  
    setLoading(true);
    setUploadStatus("");
  
    try {
      const endpoint = `http://localhost:8080/api/${endpointMap[type]}`;
      const token = localStorage.getItem('token'); // Replace 'token' with your actual token key
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Bearer token
        },
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        setUploadStatus(result.message);
      } else {
        setUploadStatus(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
      <SideBar>
        <div className="container-fluid text-center">
          <h2>Upload Your {type} Data</h2>
          <hr />
          <div className="row">
            <div className="form-group col-md-12">
              <div className="formbold-main-wrapper">
                <div className="formbold-form-wrapper">
                  <div className="mb-6 pt-4">
                    <div className="formbold-mb-5 formbold-file-input">
                      <input
                        type="file"
                        name="file"
                        id="file"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file">
                        <div>
                          <span className="formbold-drop-file">
                            Upload files here
                          </span>
                          <span className="formbold-browse"> Browse </span>
                          
                          {fileName && <p style={{marginTop:"10px"}}>({fileName})</p>} {/* Display selected file name */}

                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      className="formbold-btn w-full"
                      onClick={handleUpload}
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </div>
              </div>
              {uploadStatus && <p>{uploadStatus}</p>}
            </div>
          </div>
        </div>
      </SideBar>
    </>
  );
}

export default Party;
