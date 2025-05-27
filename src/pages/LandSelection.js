import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../components/Api";
import "../pages/LandSelection.css";
import Amenities from "./Amenities";
import Futuregreencitybrochure from "./Futuregreencitybrochure";
import PlotLayout from "./PlotLayout";
import TermsandConditions from "./TermsandConditions";

const LandSelection = () => {
  const [selectedLand, setSelectedLand] = useState("");
  const [amountDetails, setAmountDetails] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [paymentHistory, setPaymentHistory] = useState({});
  const [showLandDetails, setShowLandDetails] = useState(false);
  // const [showPlotDetails, setShowPlotDetails] = useState(false);
  const [applicationFeePaid, setApplicationFeePaid] = useState({});
  const [areas, setAreas] = useState([]);
  const [showEditInput, setShowEditInput] = useState(false);
  const [otherAmount, setOtherAmount] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [isthirtypercentpaid, setIsThirtyPercentPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreementSigned, setIsAgreementSigned] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(true);
  const [hasClickedProceed, setHasClickedProceed] = useState(false);
  const [lastPaymentAmount, setLastPaymentAmount] = useState(0);
  const [isGatewayActive, setIsGatewayActive] = useState(false);
  const [isLoadingGateway, setIsLoadingGateway] = useState(false);
  const [gatewayError, setGatewayError] = useState(null);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const customerData = JSON.parse(storedCustomer);
      setCustomerId(customerData?.customerId || null);
    } else {
      console.error("Customer data not found in localStorage.");
    }
  }, []);

  useEffect(
    useCallback(() => {
      fetchLastPayment();
    }, [])
  );

  const fetchGatewayStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customer/get-gateway-status`
      );

      setIsGatewayActive(response.data); // Assuming response returns { isActive: boolean }
    } catch (error) {
      console.error("Failed to fetch gateway status:", error);
      setGatewayError(
        error.response?.data?.message ||
          error.message ||
          "Failed to check gateway status"
      );
      setIsGatewayActive(false); // Default to false if there's an error
    } finally {
      setIsLoadingGateway(false);
    }
  };

  // Call this when component mounts or when you need to refresh status
  useEffect(() => {
    fetchGatewayStatus();
  }, []);

  const fetchLastPayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("JWT token not found");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/customer/last-payement`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setLastPaymentAmount(response.data.amountPaidTillNow || 0);

        setIsThirtyPercentPaid(response.data.eligibleForPlot);
      }
    } catch (error) {
      console.error("Error fetching last payment:", error);
      setLastPaymentAmount(0);
    }
  };

  useEffect(() => {
    const fetchAreas = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("JWT token not found");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/customer/get-area/FUTURE_GREEN_CITY`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch areas");
        }
        setAreas(data);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };

    fetchAreas();
  }, []);

  const landDetailsRef = useRef(null);
  const plotDetailsRef = useRef(null);

  const handleLandSelection = (land) => {
    setSelectedLand(land);
    setAmountDetails(areas.find((area) => area.area === land));
    setSelectedPaymentOption("");
  };

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const customerData = JSON.parse(storedCustomer);
      setCustomerId(customerData?.customerId || null);
    } else {
      console.error("Customer data not found in localStorage.");
    }

    const storedAgreementStatus = localStorage.getItem("isAgreementSigned");
    if (storedAgreementStatus === "true") {
      setIsAgreementSigned(true);
      setShowLandDetails(true);
    }
  }, []);

  const handleAgreementSigned = () => {
    setIsAgreementSigned(true);
    localStorage.setItem("isAgreementSigned", "true");

    setShowProceedButton(false);

    setShowLandDetails(true);
    setTimeout(() => {
      landDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleProceed = () => {
    setShowLandDetails(true);
    setHasClickedProceed(true);
    setTimeout(() => {
      landDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };
  useEffect(() => {}, [lastPaymentAmount, amountDetails]);

  const calculateRemainingAmounts = () => {
    const totalPaid = paymentHistory[selectedLand] || 0;

    const registrationFeePaid = applicationFeePaid[selectedLand] ? 1000 : 0;

    if (!amountDetails) return {};

    return {
      min: Math.max(0, amountDetails.minimumAmount - lastPaymentAmount),
      thirtyPercent: Math.max(
        0,
        amountDetails.thirtyPercentageAmount - lastPaymentAmount
      ),
      full: Math.max(0, amountDetails.fullAmount - lastPaymentAmount),
    };
  };

  const handlePaymentOptionChange = (option) => {
    setSelectedPaymentOption(option);
  };

  
  const handlePayment = async () => {
    const selectedArea = areas.find((area) => area.area === selectedLand);
    const areaId = selectedArea ? selectedArea.id : null;
    const token = localStorage.getItem("token");
    if (!customerId || !areaId) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Customer ID or Area ID is missing.",
        confirmButtonText: "OK",
      });
      return;
    }

    let paymentAmount =
      selectedPaymentOption === "otherAmount"
        ? Number(otherAmount)
        : Number(remainingAmounts[selectedPaymentOption]);

    const isFirstPayment =
      !applicationFeePaid[selectedLand] &&
      !localStorage.getItem(`registrationPaid_${selectedLand}`);

    if (isFirstPayment) {
      paymentAmount += 1000;
      localStorage.setItem(`registrationPaid_${selectedLand}`, "true");
    }

    setIsLoading(true);
    console.log(paymentAmount, areaId, customerId)

    try {
      const response = await fetch(
        `${API_BASE_URL}/customer/customer-payements?customerId=${customerId}&areaId=${areaId}&amount=${paymentAmount}`,
        
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data?.message || "Payment initiation failed");
            }
        
            if (!data.redirectUrl) {
              throw new Error("Payment gateway URL not received");
            }
        
            // Close the loading dialog
            Swal.close();
        
            // Extract parameters from redirect URL
            const url = new URL(data.redirectUrl);
            const reqData = url.searchParams.get("reqData");
            const merchantId = url.searchParams.get("merchantId");
            const actionUrl = url.origin + url.pathname;
        
            if (!reqData || !merchantId) {
              throw new Error("Required payment parameters missing");
            }
        
            // Create and submit payment form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = actionUrl;
            form.style.display = 'none';
        
            const reqDataInput = document.createElement('input');
            reqDataInput.type = 'hidden';
            reqDataInput.name = 'reqData';
            reqDataInput.value = reqData;
            form.appendChild(reqDataInput);
        
            const merchantIdInput = document.createElement('input');
            merchantIdInput.type = 'hidden';
            merchantIdInput.name = 'merchantId';
            merchantIdInput.value = merchantId;
            form.appendChild(merchantIdInput);
        
            document.body.appendChild(form);
            form.submit();
      
    } catch (error) {
      Swal.fire({
              icon: 'error',
              title: 'Payment Failed',
              text: error.message || 'Something went wrong. Please try again.',
              footer: '<a href="/contact">Need help?</a>'
            });
    } finally {
      setIsLoading(false);
    }
  };

  const remainingAmounts = calculateRemainingAmounts();

  const handleotheramount = (e) => {
    let value = e.target.value.trim();

    if (value === "") {
      setOtherAmount("");
      return;
    }

    value = Math.min(
      Math.max(0, Number(value)),
      remainingAmounts.thirtyPercent
    );

    setOtherAmount(value);
  };

  return (
    <div>
      <div className="amenities_container card">
        <Amenities />
      </div>

      <div className="amenities_container card">
        <Futuregreencitybrochure />
      </div>
      <div className="terms_con_container">
        <TermsandConditions onAgreementSigned={handleAgreementSigned} />
        {isAgreementSigned && !showLandDetails && (
          <button className="proceed_btn" onClick={handleProceed}>
            Proceed
          </button>
        )}
        {showLandDetails && (
          <div ref={landDetailsRef} className="land col">
            <div className="land_details">
              <label className="lands_label">Lands Available</label>
              <select
                onChange={(e) => handleLandSelection(e.target.value)}
                className="select"
              >
                <option value="">Select Area</option>
                {areas.map((land) => (
                  <option key={land.id} value={land.area}>
                    {land.area}
                  </option>
                ))}
              </select>

              {amountDetails && (
                <div className="amount_details card">
                  <h4 className="terms_pay_cont">Payment Options</h4>

                  {["thirtyPercent", "otherAmount", "full"].map(
                    (option) => (
                      <div key={option} className="amount_selection">
                        <label>
                          <input
                            type="radio"
                            name="paymentOption"
                            value={option}
                            checked={selectedPaymentOption === option}
                            onChange={() => handlePaymentOptionChange(option)}
                            disabled={
                              remainingAmounts[option] === 0 ||
                              (option === "full" &&
                                remainingAmounts.full === 0) ||
                              (option === "otherAmount" &&
                                remainingAmounts.thirtyPercent === 0)
                            }
                            className="radio-button"
                          />
                          Pay
                          {option === "min"
                            ? " Minimum Amount"
                            : option === "thirtyPercent"
                            ? " 30% Amount"
                            : option === "otherAmount"
                            ? " Other Amount"
                            : " Full Amount"}
                          ₹
                          {option === "thirtyPercent" && otherAmount > 0
                            ? remainingAmounts.thirtyPercent - otherAmount
                            : remainingAmounts[option]}
                        </label>

                        {option === "otherAmount" && (
                          <div>
                            <input
                              type="number"
                              value={otherAmount}
                              placeholder="Enter Other Amount"
                              className="otheramount_field"
                              onChange={(e) => handleotheramount(e)}
                              disabled={selectedPaymentOption !== "otherAmount"}
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}

                  <div className="amount-paid-container">
                    <h3 className="amount-paid-title">
                      Total Amount Paid : ₹{lastPaymentAmount || 0}
                    </h3>
                  </div>

                  <div className="note_container">
                    {remainingAmounts.thirtyPercent === 0 ? (
                      <div>
                        <p className="tp_success_note">
                          You have completed 30% payment.
                        </p>
                        <p className="tp_success_note_2">
                          Please select a plot from the "Select Phase" section
                          below.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="terms_con_note">
                          ₹1000 will be added as application charges
                        </p>
                        <p className="terms_con_note_2">
                          (only for the first payment).
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePayment}
                    className="pay_now_btn"
                    disabled={
                      isLoading ||
                      !isGatewayActive ||
                      !selectedPaymentOption ||
                      (selectedPaymentOption === "otherAmount" &&
                        (!otherAmount || otherAmount <= 0))
                    }
                  >
                    {isLoading
                      ? "Processing..."
                      : `Pay Now ₹ ${
                          selectedPaymentOption
                            ? selectedPaymentOption === "otherAmount"
                              ? otherAmount && otherAmount > 0
                                ? Number(otherAmount) +
                                  (lastPaymentAmount === 0 &&
                                  !applicationFeePaid[selectedLand]
                                    ? 1000
                                    : 0)
                                : 0
                              : Number(
                                  remainingAmounts[selectedPaymentOption]
                                ) +
                                (lastPaymentAmount === 0 &&
                                !applicationFeePaid[selectedLand]
                                  ? 1000
                                  : 0)
                            : 0
                        }`}
                  </button>
                  {isGatewayActive?(<>
                 
                  </>):(<>
                   <div className="bg-primary mt-3" style={{width: "70%", textAlign:"center", borderRadius:"20px"}}>
                    <p style={{color:"red"}}>Payment gateway is facing some issue please Opt in for manual payment</p>
                  </div>
                  </>)}
                  <button className="pay_now_btn mt-3"><a href="/manual-payment" style={{textDecoration:"none", color:"white"}}>Manual Payment</a></button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {lastPaymentAmount > 0 && (
        <div className="plot_container mt-4" ref={plotDetailsRef}>
          <PlotLayout
            selectedArea={selectedLand}
            isthirtypercentpaid={isthirtypercentpaid}
          />
        </div>
      )}
    </div>
  );
};

export default LandSelection;
