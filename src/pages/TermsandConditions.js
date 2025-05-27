import React, { useEffect, useRef, useState } from "react";
import "../pages/TermsandCondition.css";
import SignatureCanvas from "react-signature-canvas";
import Swal from "sweetalert2";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import Modal from "react-modal";
import axios from "axios";
import toast from "react-hot-toast";

const TermsandConditions = ({ onAgreementSigned }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState("");
  const [uploadedSignature, setUploadedSignature] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [displaysignature, setDisplaySignature] = useState("");
  // const [refresh, setRefresh] = useState(false);

  const sigCanvas = useRef(null);
  const modalSigCanvas = useRef(null);
  const fileInputRef = useRef(null);
  const proceedbrn = useRef(null);

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleClearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setUploadedSignature("");
    setSignatureData("");
    setIsAgreed(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const signedAgreement = localStorage.getItem("signedAgreement");
    if (signedAgreement === "true") {
      setIsChecked(true);
    }
  }, []);

  useEffect(() => {
    const fetchSignatureData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("⚠️ No authentication token found!");
          return;
        }

        const response = await axios.get(
          "https://backend.rajasreetownships.in/customer/get-signature",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setDisplaySignature(response.data || "");
      } catch (error) {
        console.error("❌ Error fetching signature:", error);
      }
    };

    fetchSignatureData();
  }, []);

  const handleSaveSignature = async (event) => {
    let signatureFile =
      event?.target?.files?.[0] || selectedFile || signatureData || null;

    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];

      setUploadedSignature(URL.createObjectURL(file));
      setSignatureData(URL.createObjectURL(file));
      setSelectedFile(file);

      setTimeout(() => {
        if (sigCanvas.current) {
          sigCanvas.current.fromDataURL(URL.createObjectURL(file));
        }
      }, 100);

      signatureFile = file;
    }

    if (!signatureFile && sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL("image/png");

      const blob = await fetch(dataURL).then((res) => res.blob());
      signatureFile = new File([blob], "signature.png", { type: "image/png" });

      setSelectedFile(signatureFile);
    }

    if (!signatureFile) {
      Swal.fire({
        icon: "error",
        title: "File Missing",
        text: "Please upload a file or draw a signature before saving.",
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
        title: "Authentication Error",
        text: "User not authenticated. Please log in again.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://backend.rajasreetownships.in/customer/upload-signature",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSignatureData(URL.createObjectURL(signatureFile));
        setIsAgreed(true);
        setDisplaySignature(URL.createObjectURL(signatureFile));
        setIsChecked(true);
        // setRefresh((prev) => !prev);
        localStorage.setItem("signedAgreement", "true");

        console.log("✅ Checkbox should now be checked:", isChecked);
        Swal.fire({
          icon: "success",
          title: "Signature Uploaded",
          text: response.data,
          confirmButtonText: "OK",
        });
      } else {
        setDisplaySignature(URL.createObjectURL(signatureFile));

        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: response.data || "Something went wrong. Try again.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(" API Upload Error:", error);

      let errorMessage =
        "There was an issue uploading your signature. Please try again.";
      if (error.response) {
        setDisplaySignature(URL.createObjectURL(signatureFile));

        console.error("🔴 Server Error Response:", error.response);
        errorMessage = error.response.data || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  const uploadSignatureToAPI = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("❌ No file selected");
      return;
    }

    setUploadedSignature(URL.createObjectURL(file));
    setSignatureData(URL.createObjectURL(file));

    setSelectedFile(file);

    setTimeout(() => {
      if (sigCanvas.current) {
        sigCanvas.current.fromDataURL(URL.createObjectURL(file));
      }
    }, 100);
  };

  const handleModalSaveSignature = () => {
    if (modalSigCanvas.current && !modalSigCanvas.current.isEmpty()) {
      const dataURL = modalSigCanvas.current.toDataURL();
      setSignatureData(dataURL);
      setUploadedSignature("");
      setIsModalOpen(false);
      setIsAgreed(true);
      Swal.fire({
        icon: "success",
        title: "Signature Saved",
        text: "Your signature has been successfully saved!",
        confirmButtonText: "OK",
      }).then(() => {
        const proceedButton = document.querySelector(".proceed_btn");
        if (proceedButton) {
          proceedButton.focus();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Signature Missing",
        text: "Please sign before saving.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleModalClear = () => {
    if (modalSigCanvas.current) {
      modalSigCanvas.current.clear();
    }
  };

  const handleProceed = () => {
    if (!isChecked) {
      Swal.fire({
        icon: "warning",
        title: "Terms Not Accepted",
        text: "You need to accept the terms and conditions to proceed.",
        confirmButtonText: "OK",
      });
      return;
    }

    // if (!isAgreed) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Signature Missing",
    //     text: "Please provide your signature before proceeding.",
    //     confirmButtonText: "OK",
    //   });
    //   return;
    // }
    // localStorage.setItem("customerSigned", "true");
    //setShowTerms(false);
    onAgreementSigned();
  };

  if (!showTerms) {
    return null;
  }
  return (
    <div className="terms_and_Condition ">
      <div className="terms_and_con_property_text justify-content-center">
        <h4 className="top_heading">Terms And Conditions</h4>
        <ul className="terms_con_list text-start">
          <h6 className="termss_heading">Acceptance of Terms</h6>
          <li>
            By accessing and using the Rajasree Townships app, I agree to be
            bound by the Terms and Conditions or If you don’t agree please
            refrain from using the website/app.
          </li>
          <li>
            The area of the plot in Guntas is approximately 605 Sq.yards (5
            Guntas), 1210 Sq.yards. (10 Guntas). Per Gunta without EMI, it Costs
            Rs 3,00,000/- & With EMI per Gunta it Costs Rs 3,50,000/-.
          </li>
          <li>
            Farm Land per Acre Costs Rs 45,00,000/-. For booking Rs.5,00,000/-
            per acre should be paid.
          </li>
          <li>For each agreement 30% of the property value is to be paid.</li>
          <li className="check_list">
            <input
              type="checkbox"
              id="acceptTerms"
              className="terms_check"
              checked={isChecked}
              // onChange={(e) => setIsChecked(e.target.checked)}
              onChange={(e) => {
                setIsChecked(e.target.checked);
                localStorage.setItem(
                  "signedAgreement",
                  e.target.checked ? "true" : "false"
                );
              }}
            />
            I declare my consent to the above terms and conditions, and I am
            satisfied that I have inspected the land in the above survey
            numbers.
          </li>
        </ul>

        <div className="conditions_signature col-md-10 mt-2">
          <p>Signature of Member / Guardian (in case of Minor)</p>
          <p>Provide Digital Signature</p>
          <div className="d-flex justify-content-center">
            {displaysignature.customerSignature ? (
              <div>
                <img
                  src={displaysignature.customerSignature}
                  alt="Uploaded Signature"
                  style={{
                    width: "300px",
                    height: "80px",
                    background: "white",
                    border: "1px solid",
                  }}
                />
              </div>
            ) : (
              <div className="signature_cont position-relative">
                {signatureData ? (
                  <img
                    src={signatureData}
                    alt="Saved Signature"
                    className="sigCanvas uploaded-signature"
                  />
                ) : (
                  <div className="signature_cont position-relative">
                    <FaPencilAlt
                      className={`pencil_icon position-absolute ${
                        uploadedSignature ? "disabled-icon" : ""
                      }`}
                      onClick={() => {
                        if (!uploadedSignature) {
                          setIsModalOpen(true);
                        }
                      }}
                    />

                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 300,
                        height: 50,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                )}
                <div className="icon_buttons mt-3">
                  <p>OR Upload Signature</p>
                  <div>
                    <FaCamera
                      className="icon camera_icon"
                      onClick={() => fileInputRef.current.click()}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={uploadSignatureToAPI}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {!displaysignature?.customerSignature && (
          <div className="singature_btns row">
            <div className="col">
              <button
                onClick={handleClearSignature}
                className="clear btn btn-danger"
              >
                Clear
              </button>
            </div>
            <div className="col">
              <button
                onClick={handleSaveSignature}
                className="save btn btn-success"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* {isAgreed && ( */}
        <div className="confirm_sig_cont">
          <p className="terms_text">
            You have successfully signed the agreement.
          </p>
          <button onClick={handleProceed} className="proceed_btn ">
            Proceed
          </button>
        </div>
        {/* )} */}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="modal-signature"
            overlayClassName="modal-overlay"
          >
            <h4>Sign Below</h4>
            <SignatureCanvas
              ref={modalSigCanvas}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "modal-sigCanvas",
              }}
            />
            <div className="modal-buttons">
              <button
                onClick={handleModalClear}
                className="clear btn btn-danger"
              >
                Clear
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSaveSignature}
                className="save btn btn-success"
              >
                Save
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TermsandConditions;
