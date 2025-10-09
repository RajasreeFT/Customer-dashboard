import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ManualPaymentPage from "./components/ManualPaymentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AvailableProperties from "./pages/AvailableProperties";
import BillingDetails from "./pages/BillingDetails";
import CancellationProcess from "./pages/CancellationProcess";
import Customerqueries from "./pages/Customerqueries";
import Dashboard_1 from "./pages/Dashboard_1";
import HyderabadProperties from "./pages/HyderabadProperties";
import MyProperties from "./pages/MyProperties";
import OTPVerification from "./pages/OtpVerification";
import Paymentreceipt from "./pages/Paymentreceipt";
import SaiKeshavaProperties from "./pages/SaiKeshavaProperties";
import UserLogin from "./pages/UserLogin";

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
