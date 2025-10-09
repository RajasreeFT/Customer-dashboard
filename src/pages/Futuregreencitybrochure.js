import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../pages/greencitybrochure.css";
import pdf from "../images/future_green.pdf"; // ✅ Local PDF import

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const Futuregreencitybrochure = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setIsLoading(false);
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    setIsLoading(false);
    setError("Failed to load the brochure. Please try again later.");
    console.error("PDF load error:", error);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div className="brochure-viewer-container">
      <header className="brochure-header">
        <h1>Future Green City - Project Brochure</h1>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            View Brochure
          </a>
        </div>
      )}

      {isLoading && !error && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading brochure...</p>
        </div>
      )}

      <div className={`pdf-viewer ${isLoading || error ? "hidden" : ""}`}>
        <div className="pdf-controls">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="nav-button"
          >
            &larr; Previous
          </button>

          <span className="page-info">
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="nav-button"
          >
            Next &rarr;
          </button>
        </div>

        <div className="pdf-document-container">
          <Document
            file="http://localhost:3000/static/media/future_green.4b0c5f8f93e8017a3b3b.pdf" // ✅ served from public/
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("PDF load error:", error); // 👀 log actual reason
              setError("Failed to load the brochure. Please try again later.");
              setIsLoading(false);
            }}
          >
            <Page
              pageNumber={pageNumber}
              width={window.innerWidth > 768 ? 800 : 300}
            />
          </Document>
        </div>
      </div>

      <div className="contact-info">
        <p>For more information, contact:</p>
        <p className="phone-number">
          <a href="tel:6262666999">+91 6262 666 999</a>
        </p>
      </div>
    </div>
  );
};

export default Futuregreencitybrochure;
