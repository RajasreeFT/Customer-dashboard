import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import axios from "axios";
import { FiDownload, FiUpload } from "react-icons/fi";
import "./TermsandCondition.css";
import { API_BASE_URL } from "../components/Api";

const TermsandConditions = ({ onAgreementSigned }) => {
  const [signatureData, setSignatureData] = useState("");
  const [customerSignature, setCustomerSignature] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const sigCanvas = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSignatureData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/customer/get-signature`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setCustomerSignature(response.data);
          localStorage.setItem("signedAgreement", "true");
        }
      } catch (error) {
        console.error("Error fetching signature:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignatureData();
  }, []);

  const handleClearSignature = () => {
    if (sigCanvas.current) sigCanvas.current.clear();
    setSignatureData("");
    setCustomerSignature("");
    localStorage.removeItem("signedAgreement");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveSignature = async () => {
    let signatureFile = null;

    if (signatureData) {
      const blob = await fetch(signatureData).then((res) => res.blob());
      signatureFile = new File([blob], "signature.png", { type: "image/png" });
    }

    if (!signatureFile) {
      Swal.fire({
        icon: "error",
        title: "Signature Required",
        text: "Please provide a signature before saving",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("signatureFile", signatureFile);

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please login again",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/customer/upload-signature`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCustomerSignature(URL.createObjectURL(signatureFile));
        localStorage.setItem("signedAgreement", "true");

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Signature saved successfully",
          confirmButtonText: "OK",
        });
        setSignatureData(""); // Clear the preview after saving
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data || "Failed to save signature",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSignatureData(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrawSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL();
      setSignatureData(dataURL);
    } else {
      Swal.fire({
        icon: "error",
        title: "Signature Required",
        text: "Please draw your signature before saving",
        confirmButtonText: "OK",
      });
    }
  };

  const handleProceed = () => {
    if (!customerSignature) {
      Swal.fire({
        icon: "warning",
        title: "Signature Required",
        text: "Please provide and save your signature to proceed",
        confirmButtonText: "OK",
      });
      return;
    }
    onAgreementSigned();
  };

  if (isLoading) {
    return (
      <div className="tnc-loading-container">
        <div className="tnc-spinner"></div>
        <p>Loading terms and conditions...</p>
      </div>
    );
  }

  return (
    <div className="tnc-container">
      <div className="tnc-header">
        <h2>Terms and Conditions</h2>
        <p className="tnc-subtitle">Please read and accept the terms below</p>
      </div>

      <div className="tnc-content">
        <div className="tnc-terms-list">
          <h5>Acceptance of Terms</h5>
          <ul>
            <li>
              By accessing and using the Rajasree Townships app, I agree to be
              bound by these Terms and Conditions.
            </li>
            <li>
              The area of the plot in Guntas is approximately 605 Sq.yards (5
              Guntas), 1210 Sq.yards. (10 Guntas). Per Gunta without EMI, it
              Costs Rs 3,00,000/- & With EMI per Gunta it Costs Rs 3,50,000/-.
            </li>
            <li>
              Farm Land per Acre Costs Rs 45,00,000/-. For booking Rs.5,00,000/-
              per acre should be paid.
            </li>
            <li>For each agreement 30% of the property value is to be paid.</li>
          </ul>
        </div>

        <div className="tnc-signature-section">
          <h5>Digital Signature</h5>
          <p>Signature of Member / Guardian (in case of Minor)</p>

          {customerSignature ? (
            <div className="tnc-signature-preview">
              <div className="tnc-signature-image-container">
                <img
                  src={customerSignature}
                  alt="Customer Signature"
                  className="tnc-signature-image"
                />
                <div className="tnc-signature-status">
                  <FaCheckCircle className="tnc-status-icon tnc-verified" />
                  <span>Signature Verified</span>
                </div>
              </div>
              <button
                onClick={handleClearSignature}
                className="tnc-btn tnc-btn-clear"
              >
                <FaTimes /> Clear Signature
              </button>
            </div>
          ) : (
            <div>
              {/* Signature Pad */}
              <div className="tnc-signature-canvas-container">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    width: 400,
                    height: 150,
                    className: "tnc-signature-canvas",
                  }}
                />
              </div>
              <div className="tnc-signature-actions">
                <button
                  onClick={() => {
                    if (sigCanvas.current) sigCanvas.current.clear();
                    setSignatureData("");
                  }}
                  className="tnc-btn tnc-btn-clear"
                  type="button"
                >
                  <FaTimes /> Clear
                </button>
                <button
                  onClick={handleDrawSignature}
                  className="tnc-btn tnc-btn-save"
                  type="button"
                >
                  <FiDownload /> Preview
                </button>
                <button
                  className="tnc-btn tnc-btn-upload"
                  onClick={() => fileInputRef.current.click()}
                  type="button"
                >
                  <FiUpload /> Upload Signature
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>
              {/* Show preview and submit if signatureData is available */}
              {signatureData && (
                <div>
                  <div className="tnc-signature-preview">
                    <img
                      src={signatureData}
                      alt="Preview Signature"
                      className="tnc-signature-image"
                    />
                  </div>
                  <div className="tnc-signature-actions">
                    <button
                      onClick={() => setSignatureData("")}
                      className="tnc-btn tnc-btn-clear"
                      type="button"
                    >
                      <FaTimes /> Clear Preview
                    </button>
                    <button
                      onClick={handleSaveSignature}
                      className="tnc-btn tnc-btn-save"
                      type="button"
                    >
                      <FiDownload /> Save Signature
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="proceed-section"
          style={{ textAlign: "center", marginTop: "2rem" }}
        >
          <button
            onClick={handleProceed}
            className="tnc-btn tnc-btn-proceed"
            disabled={!customerSignature}
            type="button"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsandConditions;
