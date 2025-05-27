import React, { useState } from "react";
import "../pages/CancellationProcess.css";
import Swal from "sweetalert2";
import Base from "../components/Base";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Cancelprocess = () => {
  const [propertyName, setPropertyName] = useState("");
  const [plotPurchased, setPlotPurchased] = useState("");
  const [costOfProperty, setCostOfProperty] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [totalEMIPaid, setTotalEMIPaid] = useState("");
  const [totalAmountPaid, setTotalAmountPaid] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const properties = {
    "future green city": {
      plotPurchased: "Plot 101",
      costOfProperty: "5000000",
      advanceAmount: "100000",
      totalEMIPaid: "200000",
      totalAmountPaid: "2000000",
    },
    "sai kesava": {
      plotPurchased: "Plot 202",
      costOfProperty: "3000000",
      advanceAmount: "50000",
      totalEMIPaid: "100000",
      totalAmountPaid: "1000000",
    },
  };

  const handlePropertyChange = (e) => {
    const selectedProperty = e.target.value;
    setPropertyName(selectedProperty);

    if (properties[selectedProperty]) {
      const propertyDetails = properties[selectedProperty];
      setPlotPurchased(propertyDetails.plotPurchased);
      setCostOfProperty(propertyDetails.costOfProperty);
      setAdvanceAmount(propertyDetails.advanceAmount);
      setTotalEMIPaid(propertyDetails.totalEMIPaid);
      setTotalAmountPaid(propertyDetails.totalAmountPaid);
    } else {
      // Reset all fields if "Select the Property Name" is chosen
      setPlotPurchased("");
      setCostOfProperty("");
      setAdvanceAmount("");
      setTotalEMIPaid("");
      setTotalAmountPaid("");
    }
  };

  const calculateRefund = () => {
    const totalPaid = parseFloat(totalAmountPaid);
    if (!isNaN(totalPaid)) {
      return totalPaid - totalPaid * 0.3;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    Swal.fire({
      title: "Details are received!",
      text: "Refund will be processed soon!",
      icon: "success",
    });
  };

  return (
    <Base>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 cancel_form ">
        <Link to="/dashboard">
          <button className="back_btn">
            <span>
              <IoMdArrowRoundBack />
            </span>
            Back
          </button>
        </Link>
        <div
          className="card w-100 cancel_form_card"
          style={{ maxWidth: "600px" }}
        >
          <div className="card-body">
            <h2 className="text-center table_heading mb-4">
              Cancellation Process
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="form-group cancel_form_body ">
                  <label className="text-left">Property Name:</label>
                  <select
                    className="form-control"
                    value={propertyName}
                    onChange={handlePropertyChange}
                  >
                    <option value="">Select the property name</option>
                    <option value="future green city">Future Green City</option>
                    <option value="sai kesava">Sai Kesava</option>
                  </select>
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Plot Purchased:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plotPurchased}
                    onChange={(e) => setPlotPurchased(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Cost of Property:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={costOfProperty}
                    onChange={(e) => setCostOfProperty(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Advance Amount Paid:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Total EMI's Paid:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={totalEMIPaid}
                    onChange={(e) => setTotalEMIPaid(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Total Amount Paid:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={totalAmountPaid}
                    onChange={(e) => setTotalAmountPaid(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">
                    Amount Returnable (after 40% reduction):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={calculateRefund()}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-center table_heading">
                  Bank Account Details
                </h4>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Account Holder Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Account Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Re-enter Account Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={reEnterAccountNumber}
                    onChange={(e) => setReEnterAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">IFSC Code:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group cancel_form_body">
                  <label className="text-left">Branch Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn cancel_sub_btn ">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Cancelprocess;
