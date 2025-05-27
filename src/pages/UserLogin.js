import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

import OTPVerification from "./OtpVerification";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
// import api from "./api";
// import  toast  from "react-hot-toast";

function UserLogin() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    setIsSignIn(true);
    setShowOTP(false);
    setMobileNumber("");
  }, []);

  const handleOTPSend = (userMobile) => {
    setMobileNumber(userMobile);
    setShowOTP(true);
    // toast.success("OTP sent successfully!");
  };

  const handleVerifyOTP = (otp) => {
    toast.success("OTP verified successfully!");
    setShowOTP(false);
  };

  console.log("signin",isSignIn);
  return (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <Toaster position="top-center" />
      <div
        className="bg-white rounded-2xl shadow-xl w-100 d-flex align-items-stretch"
        style={{ maxWidth: "800px", minHeight: "600px" }}
      >
        <div className="row g-0 w-100">
          <motion.div
            className="col-md-6 p-4 d-flex flex-column justify-content-center"
            initial={{ x: isSignIn ? 0 : "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ overflowY: "auto" }}
          >
            <AnimatePresence mode="wait">
              {showOTP ? (
                <OTPVerification
                  key="otp"
                  mobileNumber={mobileNumber}
                  onVerify={handleVerifyOTP}
                  onBack={() => setShowOTP(false)}
                />
              ) : isSignIn ? (
                <SignInForm key="signin" onOTPRequest={handleOTPSend} />
              ) : (
                <SignUpForm
                  key="signup"
                  onSignUpSuccess={() => setIsSignIn(true)}
                />
              )}
            </AnimatePresence>
          </motion.div>

          <div
            className="col-md-6 d-flex flex-column align-items-center justify-content-center text-white"
            style={{
              background: "linear-gradient(to bottom right, #72BF78, #C0EBA6)",
              borderRadius: "20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center p-4"
            >
              <h2 className="text-white mb-3">
                {isSignIn ? "Welcome Back!" : "Join Us!"}
              </h2>
              <p className="mb-4">
                {isSignIn
                  ? "Don't have an account yet? Join us now!"
                  : "Already have an account? Sign in here!"}
              </p>
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="btn"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#72BF78",
                  padding: "10px 30px",
                  border: "none",
                  borderRadius: "50px 20px",
                }}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
