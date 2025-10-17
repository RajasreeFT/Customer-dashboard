import React, { useState, useEffect } from "react";
import "../pages/BillingDetails.css";
import image from "../images/qrcode.jpg"
import Base from "../components/Base";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import BillsTable from "./BillsTable";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import jsPDF from "jspdf";
import axios from "axios";
import { API_BASE_URL } from "../components/Api";

const BillingDetails = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEMI, setSelectedEMI] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [thirtyPercent, setThirtyPercent] = useState([]);
  const [customer, setCustomer] = useState({
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
  const [emiId, setEmiId] = useState('');
  const [imageFile, setImageFile] = useState(null);


  useEffect(() => {
    const fetchThirtyPercentetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT token not found");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/customer/thirty-percent-transactions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch EMI details");
        }
        setThirtyPercent(data);
        console.log("Thitypercent :", data);
      } catch (error) {
        console.error("Error fetching EMI details:", error);
      }
    };
    fetchThirtyPercentetails();
  }, []);

  const Bills = [
    {
      Sno: "1",
      month: "February 2024",
      emiAmount: "₹20,000",
      status: "Unpaid",
      invoiceNumber: 100002510011,
    },
    {
      Sno: "2",
      month: "March 2024",
      emiAmount: "₹20,000",
      status: "Unpaid",
      invoiceNumber: 100002510022,
    },
    {
      Sno: "3",
      month: "April 2024",
      emiAmount: "₹20,000",
      status: "Unpaid",
      invoiceNumber: null,
    },
  ];

  const handleUpload = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleSubmitReceipt = () => {
    setShowUploadModal(false);
    Swal.fire({
      title: "Receipt Submitted",
      text: `Transaction receipt for ${selectedEMI?.month} received. Invoice will be generated within 1 day.`,
      icon: "success",
      confirmButtonText: "OK",
      customClass: { popup: "text-center" },
    });
  };


  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (customer) {
      setCustomer({
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

  const generatePDF = (item) => {
    const doc = new jsPDF();

    // Set background color for the header
    doc.setFillColor(57, 204, 113); // Green
    doc.rect(0, 0, 210, 30, "F"); // Fill the header area

    // Set font and size for the payment receipt heading
    doc.setFont("Arial, sans-serif", "bold");
    doc.setFontSize(24);
    doc.setTextColor(227, 39, 18); // Red text
    doc.text("RAJASREE TOWNSHIPS", 105, 20, { align: "center" });

    // Reset text color for other sections
    doc.setTextColor(0, 0, 0); // Black text

    // Format the date to dd/mm/yyyy
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}/${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${currentDate.getFullYear()}`;

    // Define table content
    const tableData = [
      [`PAYMENT RECEIPT NUMBER: ${item.id}`, `DATE: ${formattedDate}`], // Combined into one row
      // ["PAYMENT RECEIPT TO", ""],
      ["Customer Name", customer.customerName],
      ["Property Name", customer.groupName],
      ["DESCRIPTION", "AMOUNT PAID"],
      [`ThirtyPercent Payment`, `${Math.round(item.amount)}`],
      ["PAYMENT METHOD", "Bank Account:"],
      // ["Bank Account:", "1234 5678 9101 1121"],
    ];

    const startX = 20;
    const startY = 40;
    const rowHeight = 10;
    const colWidth1 = 80; // Width of the first column
    const colWidth2 = 100; // Width of the second column

    // Draw table rows
    tableData.forEach((row, index) => {
      const y = startY + index * rowHeight;

      // Draw cell borders
      doc.rect(startX, y, colWidth1, rowHeight); // First column
      doc.rect(startX + colWidth1, y, colWidth2, rowHeight); // Second column

      // Add text to cells
      doc.setFont("helvetica", "bold"); // Bold for left content
      doc.setFontSize(12);
      doc.text(row[0], startX + 5, y + 7); // First column text
      doc.text(row[1], startX + colWidth1 + 5, y + 7); // Second column text
    });

    // Add terms and conditions
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 255); // Blue text
    doc.text(
      "TERMS & CONDITIONS",
      20,
      startY + tableData.length * rowHeight + 10
    );
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black text

    const terms = [
      "Management shall not be liable for any payments that have not been approved by the Management.",
      "The amount paid should be directly deposited into our company's HDFC bank account only and a proper receipt must be obtained.",
      "The amount paid in the scheme is non-refundable under any circumstances. Members have the option to switch to a different scheme in a different group with proper approval from the management.",
      "Your payment amount can be directly deposited to our company’s HDFC Bank account (A/C No: 50200009660286, IFSC No: HDFC0002413) through digital payments (Google Pay/Phone Pay/Paytm/NEFT/IMPS) or debit/credit cards via our company representative.Payment in cash is also available, and a proper receipt must be obtained from the management.",
    ];

    // Reduce font size for bullet points
    doc.setFontSize(10); // Smaller font size for bullet points

    let termY = startY + tableData.length * rowHeight + 25; // Adjust Y position for the first bullet point
    terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 20, termY, { maxWidth: 170 }); // Adjusted maxWidth
      termY += 14; // Reduced space between points
    });

    doc.setFontSize(12); // Reset to default font size

    // Add footer with colors (vertical layout)
    doc.setFontSize(10, "bold");
    doc.setTextColor(255, 34, 0); // Red text

    let footerY = doc.internal.pageSize.height - 15; // Position at the bottom of the page
    let footerX = 20; // Starting X position for the footer

    doc.text("Website: www.rajasreetownship.in", footerX, footerY);
    doc.text("| Email: Info@rajasreetownships.in", footerX + 60, footerY);
    doc.text(" | Customercare: +91 6262 666 999", footerX + 120, footerY);

    return doc;
  };

  const handleViewPaymentReceipt = (item) => {
    const doc = generatePDF(item);

    // Open the PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };


  useEffect(() => {
    const fetchEmiDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT token not found");
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/customer/customer/emi-list`,
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
          throw new Error("Failed to fetch EMI details");
        }
        const unpaidEmis = data.filter((emi) => emi.isPaid === false);

        setSelectedEMI(unpaidEmis);  // Update state with only unpaid EMIs

        console.log("Unpaid EMIs:", unpaidEmis);
      } catch (error) {
        console.error("Error fetching EMI details:", error);
      }
    };
    fetchEmiDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emiId || !imageFile) {
      alert('Please select an EMI ID and upload a file.');
      return;
    }

    
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not authenticated");
    return;
  }

    const formData = new FormData();
    formData.append('emiId', emiId);
    formData.append('imageFile', imageFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/customer/post-payment-receipt`, formData, {
        headers: {
           Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Success: ' + response.data);
    } catch (error) {
      alert('Error: ' + (error.response?.data || error.message));
    }
  };

  return (
    <Base>
      <div className="container-fluid text-center billing_con ">
        <Link to="/dashboard">
          <button className="back_btn">
            <span>
              <IoMdArrowRoundBack />
            </span>
            Back
          </button>
        </Link>

        <div>
          <div className="row justify-content-center">
            <div className="col-md-7">
              <h2 className="table_heading mb-2">30% Transcation Details</h2>
              <Table className="table table-bordered">
                <Thead>
                  <Tr>
                    <Th>S.No</Th>
                    <Th>Descrption</Th>
                    <Th>Transaction 30% Amount</Th>
                    <Th>30% Amount</Th>
                    <Th>Paid 30% Amount</Th>
                    <Th>Remaining 30% Amount</Th>
                    <Th>Payment Receipt</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {thirtyPercent.length > 0 ? (
                    [...thirtyPercent].reverse().map((item, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>Payment-{index + 1 || "N/A"}</Td>
                        <Td>{item.amount || "0"}</Td>
                        <Td>{item.thirtyPercentAmount || "0"}</Td>
                        <Td>{item.amountPaidTillNow || "0"}</Td>
                        <Td>{item.remainingThirtyPercentAmount || "0"}</Td>
                        <Td>
                          <Button
                            variant="contained"
                            color="primary"
                            className="table-view-btn"
                            onClick={() => handleViewPaymentReceipt(item)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="7" style={{ textAlign: "center" }}>No data available</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="">
            <h1 className="table_heading my-2">EMI Details</h1>

            <BillsTable />
          </div>
        </div>

        <div className="mt-3 ">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <h4 className="table_heading mb-2">Bank Account Details</h4>
              <Table className="table table-bordered">
                <Thead>
                  <Tr>
                    <Th>S.No</Th>
                    <Th>Account Number</Th>
                    <Th>IFSC Code</Th>
                    <Th>Account Name</Th>
                    <Th>Branch Name</Th>
                    <Th>UPI ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>1</Td>
                    <Td>50200009660286</Td>
                    <Td>HDFC0002413</Td>
                    <Td>RAJASREE TOWNSHIPS</Td>
                    <Td>Krishna Nagar, Vijayawada</Td>
                    <Td>vyapar.172720837789@hdfcbank</Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </div>

          <div className="mt-4">
            <p className="mt-4 text-center text-danger">
              <strong>
                Note: After payment, please ensure the receipt is uploaded
                promptly.
              </strong>
            </p>
            <h4 className="table_heading">Scan QR Code for Payment</h4>
            <img
              src={image}
              alt="qrcode"
              style={{ width: "25%", height: "auto", margin: " auto" }}
            />
            <p className="table_heading">
              Use the above methods and upload the receipt after payment./
            </p>

            <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
              <div className="mb-4">
                <label className="block text-gray-700">Select EMI ID</label>
                <select
                  value={emiId}
                  onChange={(e) => setEmiId(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">-- Select EMI --</option>
                  {selectedEMI.map((emi) => (
                    <option key={emi.id} value={emi.emiId}>
                      EMI  {new Date(emi.emiDate).toLocaleString("en-US", {
                        month: "short",
                      }) +
                        "-" +
                        new Date(emi.emiDate).getFullYear()} - ₹{Math.round(emi.emiAmount)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Upload Payment Receipt (Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full"
                  required
                />
              </div>

              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit Payment
              </button>
            </form>

            <div className="row justify-content-center">
              <div className="col-md-6">
                <h3 className="table_heading my-4">Billing Details</h3>

                <Table className="table table-bordered mt-2">
                  <Thead>
                    <Tr>
                      <Th>S.No</Th>
                      <Th>Month</Th>
                      <Th>EMI Amount</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Bills.map((bill, index) => (
                      <Tr key={index}>
                        <Td>{bill.Sno}</Td>
                        <Td>{bill.month}</Td>
                        <Td>{bill.emiAmount}</Td>
                        <Td>{bill.status}</Td>
                        <Td>
                          {bill.status === "Unpaid" && (
                            <Button
                              className="table-paymentdone-btn"
                              onClick={() => setShowUploadModal(true)}
                            >
                              Payment Done
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {showUploadModal && (
          <div className="modal-overlay d-flex justify-content-center align-items-center">
            <div className="photo-content bg-white p-4 rounded shadow">
              <p>
                Please capture and upload the payment screenshot or receipt.
              </p>
              <Form.Group>
                <Form.Label>Upload Screenshot / Receipt</Form.Label>
                <Form.Control type="file" onChange={handleUpload} />
              </Form.Group>
              <div className="mt-3 model_btns">
                <Button
                  variant="secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitReceipt}
                  disabled={!uploadedFile}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Base>
  );
};

export default BillingDetails;
