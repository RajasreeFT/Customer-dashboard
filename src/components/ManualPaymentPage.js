import React, { useState } from "react";
import { FaCamera, FaUpload, FaCopy, FaChevronDown } from "react-icons/fa";
import Base from "./Base";
import axios from "axios";
import image from "../images/qrcode.jpg";
import { API_BASE_URL } from "./Api";

const ManualPaymentPage = () => {
  const [activeTab, setActiveTab] = useState("bank");
  const [copySuccess, setCopySuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const paymentDescriptions = [
    { label: "Select payment description...", value: "" },
    { label: "Application fee", value: "Application fee" },
    { label: "Thirty Percent Amount", value: "Thirty Percent Amount" },
    { label: "Full Payment", value: "Full Payment" },
    { label: "Other", value: "Other" },
  ];

  const bankDetails = {
    accountName: "RAJASREE TOWNSHIPS",
    accountNumber: "1234567890",
    bankName: "HDFC",
    branch: "Krishna Nagar, Vijayawada",
    ifsc: "HDFC0002413",
  };

  const upiId = "vyapar.172720837789@hdfcbank";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionSelect = (description) => {
    setSelectedDescription(description);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setError("Please upload a payment receipt");
      return;
    }

    if (!selectedDescription) {
      setError("Please select a payment description");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData();
      formData.append("paymentDescription", selectedDescription);
      formData.append("imageFile", imageFile);

      const response = await fetch(
        `${API_BASE_URL}/customer/post-manual-receipt`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload receipt");
      }

      setSubmitSuccess(
        result.message || "Payment receipt uploaded successfully"
      );
      setImageFile(null);
      setPreviewImage(null);
      setSelectedDescription("");

      setTimeout(() => setSubmitSuccess(""), 5000);
    } catch (error) {
      setError(error.message || "Failed to submit payment. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Manual Payment</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Payment Method Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "bank"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("bank")}
          >
            Bank Transfer
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "upi"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("upi")}
          >
            QR CODE
          </button>
        </div>

        {/* Bank Transfer Details */}
        {activeTab === "bank" && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Bank Account Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">{bankDetails.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">
                    {bankDetails.accountNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium">{bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch:</span>
                <span className="font-medium">{bankDetails.branch}</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">UPI ID:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{upiId}</span>
                    <button
                      onClick={() => copyToClipboard(upiId)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Copy to clipboard"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Use this UPI ID to make payment through any UPI app.
                </p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC Code:</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{bankDetails.ifsc}</span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.ifsc)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            </div>
            {copySuccess && (
              <p className="text-green-500 text-sm mt-2">{copySuccess}</p>
            )}
          </div>
        )}

        {/* UPI Payment Details */}
        {activeTab === "upi" && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">UPI Payment Details</h2>
            {copySuccess && (
              <p className="text-green-500 text-sm mt-2">{copySuccess}</p>
            )}
          </div>
        )}

        {/* QR Code Scanner Button */}
        <div className="mb-6">
          <img
            src={image}
            alt="qrcode"
            style={{ width: "25%", height: "auto", margin: " auto" }}
          />
         
        </div>

        {/* Payment Receipt Upload */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Upload Payment Receipt</h2>
          <form onSubmit={handleSubmit}>
            {/* Payment Description Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Description
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {selectedDescription || "Select payment description..."}
                    </span>
                    <FaChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {paymentDescriptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          selectedDescription === option.value
                            ? "bg-blue-100"
                            : ""
                        }`}
                        onClick={() => handleDescriptionSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Receipt (Screenshot/Image)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Receipt preview"
                        className="max-h-48 mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreviewImage(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status messages */}
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {submitSuccess && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                Payment receipt submitted successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={!imageFile || isSubmitting || !selectedDescription}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                imageFile && selectedDescription && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <FaUpload className="inline mr-2" />
                  Submit Payment Receipt
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentPage;
