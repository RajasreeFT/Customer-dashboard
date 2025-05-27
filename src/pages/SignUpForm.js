import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../components/Api";

export default function SignUpForm({ onSignUpSuccess }) {
  const [formData, setFormData] = useState({
    customerName: "",
    fatherName: "",
    dateOfBirth: "",
    age: "",
    aadharNumber: "",
    mobileNumber: "",
    email: "",
    city: "",
    pincode: "",
    groupName: "",
    panNumber: "",
    primaryAddress: "",
    nomineeName: "",
    occupation: "",
    employeeId: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobileNumber = (mobile) => /^\d{10}$/.test(mobile); // 10-digit mobile number
  const validatePanNumber = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan); // PAN format: ABCDE1234F
  const validateAadharNumber = (aadhar) => /^\d{12}$/.test(aadhar); // 12-digit Aadhar number

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate mobile number
    if (!validateMobileNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    // Validate PAN number
    if (!validatePanNumber(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN number format";
    }

    // Validate Aadhar number
    if (!validateAadharNumber(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar number must be 12 digits";
    }

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with form submission if no errors
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    if (profileImage) {
      form.append("profileImage", profileImage);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/customer/register`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(response.data);
      toast.success("Customer registered successfully!");
      onSignUpSuccess();
    } catch (error) {
      setResponse(error.response ? error.response.data : "An error occurred");
      toast.error(
        error.response
          ? error.response.data
          : "Registration failed. Please try again."
      );
      console.log(error.response);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error when re-typing
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Create Account</h2>
        <p className="text-muted">Welcome to Rajasree Townships!</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-1">
          <label className="form-label">Customer Full Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* Father/Spouse Name */}
        <div className="mb-1">
          <label className="">Father/ Spouse Name</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-1">
          <label className="form-label">Date of Birth*</label>
          <input
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            value={formData.dateOfBirth}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* Age */}
        <div className="mb-1">
          <label className="form-label">Age</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-1">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        {/* Mobile Number */}
        <div className="mb-1">
          <label className="form-label">Mobile Number*</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={`form-control ${
              errors.mobileNumber ? "is-invalid" : ""
            }`}
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
          {errors.mobileNumber && (
            <div className="invalid-feedback">{errors.mobileNumber}</div>
          )}
        </div>

        {/* Primary Address */}
        <div className="mb-1">
          <label className="form-label">Primary Address</label>
          <input
            type="text"
            name="primaryAddress"
            value={formData.primaryAddress}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* City */}
        <div className="mb-1">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
          />
        </div>

        {/* Pincode */}
        <div className="mb-1">
          <label className="form-label">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
          />
        </div>

        {/* Aadhar Number */}
        <div className="mb-1">
          <label className="form-label">Aadhar Number</label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            className={`form-control ${
              errors.aadharNumber ? "is-invalid" : ""
            }`}
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
          {errors.aadharNumber && (
            <div className="invalid-feedback">{errors.aadharNumber}</div>
          )}
        </div>

        {/* Pan Number */}
        <div className="mb-1">
          <label className="form-label">Pan Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            className={`form-control ${errors.panNumber ? "is-invalid" : ""}`}
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
          {errors.panNumber && (
            <div className="invalid-feedback">{errors.panNumber}</div>
          )}
        </div>

        {/* Group Name */}
        <div className="mb-1">
          <label className="form-label">Group Name*</label>
          <select
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          >
            <option value="">Select a group</option>
            <option value="FUTURE_GREEN_CITY">FUTURE_GREEN_CITY</option>
            <option value="SAI_KESHAVA">SAI_KESHAVA</option>
          </select>
        </div>

        {/* Occupation */}
        <div className="mb-1">
          <label className="form-label">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
          />
        </div>

        {/* Profile Image */}
        <div className="mb-1">
          <label className="form-label">Upload Photo</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* Nominee Name */}
        <div className="mb-1">
          <label className="form-label">NomineeName</label>
          <input
            type="text"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
            required
          />
        </div>

        {/* Employee Ref Id */}
        <div className="mb-1">
          <label className="form-label">Employee Ref Id</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", border: "1px solid gray" }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            style={{
              width: "100px",
              backgroundColor: "#55883B",
              padding: "15px",
              border: "5px  white",
              borderRadius: "25px",
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
