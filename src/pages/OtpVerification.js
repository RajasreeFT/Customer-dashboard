import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../components/Api";
import "../pages/SignInForm.css";
 
function OTPVerification({ mobileNumber, onVerify, onBack }) {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
 
 
  const navigate = useNavigate();
 
  // Function to validate mobile number
  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
 
  // Handle OTP input changes
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only digits, max 6
    setOtp(value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/customer/verify?mobileNumber=${mobileNumber}&otp=${otp}`
      );
 
      // const { token } = response.data;
 
      const { token, customer } = response.data;
      localStorage.setItem("token", token);
      // localStorage.setItem("loggedIn", true);
 
      localStorage.setItem("loggedIn", true);
 
      console.log(
        "Token saved to localStorage:",
        localStorage.getItem("token")
      );
      navigate("/dashboard");
      localStorage.setItem("customer", JSON.stringify(response.data.customer));
    } catch (err) {
      console.error("Error during OTP verification:", err);
      toast.error(
        err.response?.data?.message || "Failed to verify OTP. Try again."
      );
    }
  };
 
  // Resend OTP logic
  const resendOTP = async () => {
    if (!validateMobile(mobileNumber)) {
      toast.error("Invalid mobile number.");
      return;
    }
    try {
      setResendDisabled(true);
      setTimer(30); 
      await axios.post(
        `${API_BASE_URL}/customer/login?mobileNumber=${mobileNumber}`
      );
      toast.success("OTP resent successfully!");

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend OTP. Try again."
      );
    }
  };
 
  return (
    <div className="container mt-5">
      {/* <button onClick={onBack} className="btn btn-link text-primary mb-3">
        Back
      </button> */}
      <button onClick={onBack} className=" signinbackbtn text-success text-success d-flex justify-content-center border border-success badge badge-pill badge-warning align-items-center ">
            <span>
              <IoMdArrowRoundBack/>
            </span>
            Back
          </button>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Verify OTP</h2>
        <p className="text-muted">We've sent a code to {mobileNumber}</p>
      </div>
      <form onSubmit={handleSubmit} className="text-center">
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          className="form-control form-control-lg text-center mx-auto"
          style={{ maxWidth: "180px" }}
          placeholder="Enter OTP"
        />
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Verify OTP
        </button>
      </form>
      <p className="text-center text-muted mt-3">
        Didn't receive the code?{" "}
        <button
          className="btn btn-link text-primary p-0"
          onClick={resendOTP}
          disabled={resendDisabled}
        >
          {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
        </button>
      </p>
    </div>
  );
}
 
export default OTPVerification;
 
 