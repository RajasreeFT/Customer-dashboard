import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../components/Api";
import Swal from "sweetalert2";

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
    employeeReferenceId: "", // <-- Add this line
  });

  const [profileImage, setProfileImage] = useState(null);
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [allEmployees, setAllEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Fetch all employees for selection
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/main/admin/list-employee`
        );
        setAllEmployees(response.data);
      } catch (error) {
        toast.error("Failed to fetch employees");
      }
    };
    fetchAllEmployees();
  }, []);

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: Object.values(newErrors)
          .map((msg) => `<div>${msg}</div>`)
          .join(""),
      });
      return;
    }

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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data,
      });
      onSignUpSuccess();
    } catch (error) {
      const msg =
        error.response && error.response.data
          ? error.response.data
          : "Registration failed. Please try again.";

      setResponse(msg);

      // Optionally, map backend messages to field errors
      if (msg.includes("Aadhar already exists")) {
        setErrors((prev) => ({ ...prev, aadharNumber: msg }));
      } else if (msg.includes("Mobile number already exists")) {
        setErrors((prev) => ({ ...prev, mobileNumber: msg }));
      } else if (msg.includes("Email already exists")) {
        setErrors((prev) => ({ ...prev, email: msg }));
      } else if (msg.includes("Employee not found")) {
        setErrors((prev) => ({ ...prev, employeeReferenceId: msg }));
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: msg,
      });
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

  // Add this function to handle employee selection
  const handleEmployeeSelect = (employeeId, employeeReferenceId) => {
    setFormData({
      ...formData,
      employeeId: employeeReferenceId, // <-- Send referenceId as employeeId
      employeeReferenceId,
    });
    setShowEmployeeModal(false);
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
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              name="employeeReferenceId"
              value={formData.employeeReferenceId}
              className={`form-control ${errors.employeeReferenceId ? "is-invalid" : ""}`}
              style={{ width: "100%", border: "1px solid gray" }}
              readOnly
              onClick={() => setShowEmployeeModal(true)}
              placeholder="Click to select employee"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEmployeeModal(true)}
            >
              Select
            </button>
          </div>
          {errors.employeeReferenceId && (
            <div className="invalid-feedback">{errors.employeeReferenceId}</div>
          )}
        </div>

        {/* Employee Modal */}
        {showEmployeeModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                maxHeight: "80vh",
                overflowY: "auto",
                minWidth: "350px",
              }}
            >
              <h5>Select Employee</h5>
              <button
                style={{ float: "right", marginBottom: "10px" }}
                onClick={() => setShowEmployeeModal(false)}
                className="btn btn-sm btn-danger"
              >
                Close
              </button>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Name</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmployees.map((emp) => (
                    <tr key={emp.employeeReferenceId}>
                      <td>{emp.employeeReferenceId}</td>
                      <td>{emp.fullName}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEmployeeSelect(emp.employeeId, emp.employeeReferenceId)}
                        >
                          Choose
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
