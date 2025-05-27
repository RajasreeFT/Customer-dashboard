import React, { useEffect, useRef, useState } from "react";
import "./UserProfile.css";
import CountryCodePicker from "./countrypicker";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaUserCircle, FaFileContract, FaShieldAlt, FaUsers } from "react-icons/fa";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    customerName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    groupName: "",
    fatherName: "",
    primaryAddress: "",
    profileImagePath: null,
    nomineeName: "",
    occupation: "",
    employeeId: "",
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewNomineeInput, setShowNewNomineeInput] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [showProfileInput, setShowProfileInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isNomineeChanged, setIsNomineeChanged] = useState(false);
  const [isMobileChanged, setIsMobileChanged] = useState(false);
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const otpInputRef = useRef(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (customer) {
      setProfile({
        customerName: customer.customerName || "",
        email: customer.email || "",
        mobileNumber: customer.mobileNumber || "",
        dateOfBirth: customer.dateOfBirth || "",
        groupName: customer.groupName || "",
        fatherName: customer.fatherName || "",
        primaryAddress: customer.primaryAddress || "",
        profileImagePath: customer.profileImagePath || null,
        nomineeName: customer.nomineeName || "",
        occupation: customer.occupation || "",
        employeeId: customer.employeeId || "",
      });
    }

  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "NewnomineeName" && value !== profile.nomineeName) {
      setIsNomineeChanged(true);
    } else if (name !== "NewnomineeName") {
      setIsNomineeChanged(false);
    }

    if (name === "mobileNumber" && value !== profile.mobileNumber) {
      setIsMobileChanged(true);
    } else if (name !== "mobileNumber") {
      setIsMobileChanged(false);
    }

    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleShowAccountModal = () => {
    setShowAccountModal(true);
    setShowTermsModal(false);
    setShowPrivacyModal(false);
    setShowDropdown(false);
  };


  const handleShowTermsModal = () => {
    setShowTermsModal(true);
    setShowAccountModal(false);
    setShowPrivacyModal(false);
    setShowDropdown(false);
  };

  const handleShowPrivacyModal = () => {
    setShowPrivacyModal(true);
    setShowAccountModal(false);
    setShowTermsModal(false);
    setShowDropdown(false);
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProfileChanged(true);
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImagePath: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setIsProfileChanged(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    navigate("/SignInForm");
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
      setShowAccountModal(false);
      setShowTermsModal(false);
      setShowPrivacyModal(false);
    }
  };

  useEffect(() => {
    setShowMobileInput(false);
    setShowNewNomineeInput(false);
    setShowProfileInput(false);
    if (showDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDropdown]);

  const getRandomColor = () => {
    const colors = ["#FF5733"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const handleUpdateDetails = () => {
    setOtpSent(true);
    setMessage("");
  };

  const handleSubmitOtp = () => {
    const correctOtp = "1234"; // dummy OTP for validation
    if (enteredOtp === correctOtp) {
      setModalType("success");
      setMessage("Profile details updated successfully!");
    } else {
      setModalType("error");
      setMessage("OTP is wrong. Please try again.");
    }
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === "success") {
      setOtpSent(false);
      setEnteredOtp("");
    } else if (modalType === "error") {
      otpInputRef.current?.focus();
    }
  };
  return (
    <div className="user-profile-dropdown" ref={dropdownRef}>
      <div
        className="profile-header"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {profile.profileImagePath ? (
          <img
            src={profile.profileImagePath}
            alt="Profile"
            className="profile-photo"
          />
        ) : (
          <div
            className="profile-placeholder"
            style={{
              backgroundColor: getRandomColor(),
            }}
          >
            {profile.customerName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>
      {showDropdown && (
        <div className="dropdown-menu">
          <div className="dropdown-item-first_fields">
            <img
              src={profile.profileImagePath}
              alt="profile"
              className="profile-photo_dropdown"
            />
          </div>
          {/* need get in a model */}
          <div className="dropdown-item-first_fields">
            <h4 className="text-start name_field">{profile.customerName}</h4>
          </div>
          <div className="settings-container">
            {/* Account Details Button */}
            <button className="settings-btn" onClick={handleShowAccountModal}>
              <FaUserCircle className="settings-icon" />
              <span className="settings-text">Account Details</span>
            </button>

            {/* Terms & Conditions Button */}
            <button className="settings-btn" onClick={handleShowTermsModal}>
              <FaFileContract className="settings-icon" />
              <span className="settings-text">Terms & Conditions</span>
            </button>

            {/* Privacy Policy Button */}
            <button className="settings-btn" onClick={handleShowPrivacyModal}>
              <FaShieldAlt className="settings-icon" />
              <span className="settings-text">Privacy Policy</span>
            </button>

            <button className="settings-btn" >
              <FaUsers className="settings-icon" />
              <span className="settings-text">About Us</span>
            </button>
          </div>
          <div className="logout-btn mt-3">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}

      {showAccountModal && (
        <div className={`account-details-modal ${showAccountModal ? "" : "hidden"}`}>

          <h3 style={{ textAlign: "center" }}>Account Details</h3>

          <div className="dropdown-item">
            <label>
              Customer Name: <span>{profile.customerName}</span>
            </label>
          </div>
          <div className="dropdown-item">
            <label>
              Email ID: <span>{profile.email}</span>
            </label>
          </div>

          <div className="dropdown-item">
            <label>
              Date of Birth: <span>{profile.dateOfBirth}</span>
            </label>
          </div>

          <div className="dropdown-item">
            <label>
              Group Name: <span>{profile.groupName}</span>
            </label>
          </div>
          <div className="dropdown-item">
            <label>
              Father/Husband Name: <span>{profile.fatherName}</span>
            </label>
          </div>
          <div className="dropdown-item">
            <label>
              Residence Address: <span>{profile.primaryAddress}</span>
            </label>
          </div>
          <div className="dropdown-item">
            <label>
              Occupation: <span>{profile.occupation}</span>
            </label>
          </div>
          <div className="dropdown-item">
            <label>
              Mobile Number: <span>{profile.mobileNumber}</span>
            </label>
          </div>
          <div className="dropdown-item">
            <label>
              Nominee Name: <span>{profile.nomineeName}</span>
            </label>
          </div>
          <div>
            <button
              className="update_btn"
              onClick={handleUpdateDetails}
              disabled={
                !isNomineeChanged && !isMobileChanged && !isProfileChanged
              }
            >
              Update Details
            </button>
            <button className="cancel-btn" onClick={() => setShowAccountModal(false)}>Close</button>
          </div>
        </div>
      )}


      {showTermsModal && (
        <div className={`account-details-modal ${showTermsModal ? "" : "hidden"}`}>
          <div
            className="modal-body"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <h3 style={{ textAlign: "center" }}>Terms & Conditions</h3>

            <div className="para_heading">
              <p>
                Acceptance of Terms: By accessing and using the Rajasree
                Townships app, I agree to be bound to the Terms and
                Conditions. If you don’t agree, please refrain from using
                the website/app.
              </p>
              <p>
                1. Hyderabad-Nagarjunasagar National Highway from
                Ibrahimpatnam to Nalgonda Highway under Khudabhakshapalli
                Panchayat. Survey no. 38,39,40,41,44 etc.
              </p>
              <p>
                2. The area of the plot in Square Yards is approximately 150
                sq. Yards & 200 sq. Yards. Additional charges apply.
              </p>
              <p>
                3. The area of the plot in Guntas is approximately 605 Sq.
                yards (5 Guntas), 1210 Sq. yards (10 Guntas).
              </p>
              <p>4. Farm Land per Acre Costs Rs 45,00,000/-.</p>
              <p>
                5. For each agreement, 30% of the property value is to be
                paid.
              </p>
              <p>6. Registration expenses are to be borne by the Party.</p>
              <p>
                7. Management shall not be liable for unauthorized payments.
              </p>
              <p>8. Employees are not authorized to modify terms.</p>
              <p>
                9. Legal transactions are subject to Hyderabad jurisdiction.
              </p>
              <p>10. Prices may change before enrollment.</p>
              <p>11. Payments made under this scheme are non-refundable.</p>
              <p>
                12. Payment should be made only to the company’s HDFC Bank
                account.
              </p>
              <p>13. Members agree that they have inspected the land.</p>
            </div>
          </div>
          <button className="cancel-btn" onClick={() => setShowTermsModal(false)}>Close</button>
        </div>
      )}


      {showPrivacyModal && (
        <div className={`account-details-modal ${showPrivacyModal ? "" : "hidden"}`}>
          <h3 style={{ textAlign: "center" }}>Privacy Policy</h3>
          <div class="privacy-policy">
            <p>We collect personal data to improve your experience.</p>
            <p>Your data will not be shared with third parties without consent.</p>
            <p>Cookies are used to personalize content and ads.</p>
            <p>You have the right to request deletion of your personal data.</p>
            <p>For security reasons, we may track IP addresses.</p>
          </div>
          <button className="cancel-btn mt-1" onClick={() => setShowPrivacyModal(false)}>Close</button>
        </div>
      )}

      <div className="model_cont">
        {modalVisible && (
          <div className="modal-overlay ">
            <div className="customer-modal">
              <h3
                style={{
                  color: modalType === "success" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {modalType === "success" ? "Success" : "Error"}
              </h3>
              <p
                style={{
                  color: modalType === "success" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {message}
              </p>
              <div className="modal-buttons">
                <button
                  className="btn btn-success"
                  onClick={handleModalClose}
                  style={{
                    backgroundColor:
                      modalType === "success" ? "green" : "green",
                  }}
                >
                  OK
                </button>
                {modalType === "error" && (
                  <button className="btn" onClick={handleModalClose}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
