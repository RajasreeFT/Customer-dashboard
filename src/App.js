import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AvailableProperties from "./pages/AvailableProperties";
import HyderabadProperties from "./pages/HyderabadProperties";
import BillingDetails from "./pages/BillingDetails";
import Paymentreceipt from "./pages/Paymentreceipt";
import MyProperties from "./pages/MyProperties";
import CancellationProcess from "./pages/CancellationProcess";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import SignUpForm from "./pages/SignUpForm";
import UserLogin from "./pages/UserLogin";
import OTPVerification from "./pages/OtpVerification";
import Dashboard_1 from "./pages/Dashboard_1";
import ProtectedRoute from "./components/ProtectedRoute";
import SaiKeshavaProperties from "./pages/SaiKeshavaProperties";
import Customerqueries from "./pages/Customerqueries";
import ManualPaymentPage from "./components/ManualPaymentPage";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const token = window.localStorage.getItem("token");

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          {!token ? ( 
            <>
              <Route path="/SignInForm" element={<UserLogin />} />
              <Route path="/otp_verification" element={<OTPVerification />} />
            </>
          ):(<></>)}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard_1 />} />
            <Route
              path="/Available_properties"
              element={<AvailableProperties />}
            />
            <Route
              path="/property/hyderabad"
              element={<HyderabadProperties />}
            />
            <Route
              path="/property/saikeshava"
              element={<SaiKeshavaProperties />}
            />
            <Route path="/manual-payment" element={<ManualPaymentPage/>} />

            <Route path="/billing_details" element={<BillingDetails />} />
            <Route path="/payment_receipt" element={<Paymentreceipt />} />
            <Route path="/my_properties" element={<MyProperties />} />
            <Route path="/cancellation_process"element={<CancellationProcess />}  />
            <Route path="/customer_quires"element={<Customerqueries />}  />
          </Route>
          

          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/SignInForm"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
