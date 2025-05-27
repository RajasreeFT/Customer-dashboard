import { useState } from "react";
import { Phone } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import loadingAnimation from "../loading.json";

function SignInForm({ onOTPRequest }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const requestOTP = async (e) => {
    e.preventDefault();
    if (!validateMobile(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true); // Start loading animation

    try {
      const response = await axios.post(
        `https://backend.rajasreetownships.in/customer/login?mobileNumber=${mobileNumber}`
      );
      toast.success("OTP sent successfully!");
      onOTPRequest(mobileNumber);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="container mt-5 align-items-center">
      <div className="row justify-content-center">
        <div className="col">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Sign In</h2>
            <p className="text-muted">Welcome back!</p>
          </div>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Lottie
                animationData={loadingAnimation}
                style={{ width: 150, height: 150 }}
              />
            </div>
          ) : (
            <form onSubmit={requestOTP}>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Enter your mobile number"
                  className="form-control"
                  maxLength="10"
                  required
                />
                {error && <div className="text-danger">{error}</div>}
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{
                    width: "120px",
                    backgroundColor: "#9BCF53",
                    padding: "15px",
                    border: "5px solid white",
                    borderRadius: "25px",
                  }}
                >
                  Send OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
