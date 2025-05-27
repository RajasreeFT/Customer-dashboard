import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../components/Api";
import "../pages/BillsTable.css";

const BillsTable = () => {
  const [selectedEMI, setSelectedEMI] = useState(null);
  const [emiDetails, setEmiDetails] = useState([]);
  const [filteredEmiDetails, setFilteredEmiDetails] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillingSummary, setShowBillingSummary] = useState(false);
  const [showPaymentDescription, setShowPaymentDescription] = useState(false);
  const [filters, setFilters] = useState({
    passbook: "",
    plotNo: "",
    emiMonth: "",
    emiDate: "",
  });

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
        setEmiDetails(data);
        setFilteredEmiDetails(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching EMI details:", error);
      }
    };
    fetchEmiDetails();
  }, []);

  const uniqueValues = (key) => {
    return [
      ...new Set(
        emiDetails.map((emi) => {
          if (key === "emiMonth") {
            return (
              new Date(emi.emiDate).toLocaleString("en-US", {
                month: "short",
              }) +
              "-" +
              new Date(emi.emiDate).getFullYear()
            );
          }
          if (key === "emiDate") {
            return new Date(emi.emiDate).toLocaleDateString("en-GB");
          }
          return emi[key];
        })
      ),
    ];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const filtered = emiDetails.filter(
      (emi) =>
        (filters.passbook === "" || emi.passbook === filters.passbook) &&
        (filters.plotNo === "" || emi.purchaseDate === filters.plotNo) &&
        (filters.emiMonth === "" ||
          new Date(emi.emiDate).toLocaleString("en-US", { month: "short" }) +
            "-" +
            new Date(emi.emiDate).getFullYear() ===
            filters.emiMonth) &&
        (filters.emiDate === "" ||
          new Date(emi.emiDate).toLocaleDateString("en-GB") === filters.emiDate)
    );
    setFilteredEmiDetails(filtered);
  }, [filters, emiDetails]);

  const handlePayEMI = async (emi) => {
    // First confirm payment with user
    const result = await Swal.fire({
      title: 'Confirm Payment',
      text: `Are you sure you want to pay ₹${Math.round(emi.emiAmount).toLocaleString('hi-IN')} for ${emi.groupName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Pay Now'
    });
  
    if (!result.isConfirmed) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "Your session has expired. Please login again.", "error");
      // Optionally redirect to login
      // window.location.href = '/login';
      return;
    }
  
    try {
      // Show loading indicator
      Swal.fire({
        title: 'Processing Payment',
        html: 'Please wait while we connect to payment gateway...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const response = await fetch(
        `${API_BASE_URL}/customer/payEmi/${emi.emiId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.replace(/^"|"$/g, "")}`,
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
      console.error('Payment Error:', error);
    }
  };

  const generatePDF = (emi) => {
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
      [`PAYMENT RECEIPT NUMBER: ${emi.emiId}`, `DATE: ${formattedDate}`], // Combined into one row
      // ["PAYMENT RECEIPT TO", ""],
      ["Customer Name", emi.customer],
      ["Property Name", emi.groupName],
      ["DESCRIPTION", "AMOUNT PAID"],
      [`EMI Payment (${emi.emiMonth})`, `${Math.round(emi.emiAmount)}`],
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

  const handleViewPaymentReceipt = (emi) => {
    const doc = generatePDF(emi);

    // Open the PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <>
    <div className="text-center mt-3">
      <div className="d-flex justify-content-center gap-3 mb-3">
        <Form.Select
          name="passbook"
          value={filters.passbook}
          onChange={handleFilterChange}
        >
          <option value="">Select Passbook</option>
          {uniqueValues("passbook").map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          name="plotNumber"
          value={filters.plotNumber}
          onChange={handleFilterChange}
        >
          <option value="">Select Plot No</option>
          {uniqueValues("plotNumber").map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          name="emiMonth"
          value={filters.emiMonth}
          onChange={handleFilterChange}
        >
          <option value="">Select EMI Month</option>
          {uniqueValues("emiMonth").map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          name="emiDate"
          value={filters.emiDate}
          onChange={handleFilterChange}
        >
          <option value="">Select EMI Date</option>
          {uniqueValues("emiDate").map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className="d-flex justify-content-center">
        <Table className="table text-center">
          <Thead>
            <Tr>
              <Th>S.No</Th>
              <Th>Property Name</Th>
              <Th>Plot NO:</Th>
              <Th>Passbook Number</Th>
              <Th>EMI Date</Th>
              <Th>EMI Month</Th>
              <Th>EMI Amount</Th>
              <Th>Status</Th>
              <Th>Action</Th>
              <Th>Payment Receipt</Th>
              <Th>Billing Summary</Th>
              <Th>Payment Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEmiDetails.map((emi, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{emi.groupName}</Td>
                <Td>{emi.plotNumber}</Td>
                <Td>{emi.passbook}</Td>
                <Td>
                  {new Date(emi.emiDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Td>
                <Td>
                  {new Date(emi.emiDate).toLocaleString("en-US", {
                    month: "short",
                  }) +
                    "-" +
                    new Date(emi.emiDate).getFullYear()}
                </Td>
                <Td>{Math.round(emi.emiAmount).toLocaleString('hi-IN')}</Td>
                <Td className="emi-status">
                  <span
                    className={`status-text ${
                      emi.isPaid ? "paid" : "not-paid"
                    }`}
                  >
                    {emi.isPaid ? "Paid" : "Not Paid"}
                  </span>
                </Td>

                <Td>
                  {emi.isPaid ? (
                    <Button className="table_done_btn">Done</Button>
                  ) : (
                    <Button
                      className="pay_now"
                      onClick={() => handlePayEMI(emi)}
                    >
                      Pay
                    </Button>
                  )}
                </Td>
                <Td>
                  {emi.isPaid ? (
                    <Button
                      className="table-view-btn"
                      onClick={() => handleViewPaymentReceipt(emi)}
                    >
                      View
                    </Button>
                  ) : (
                    "N/A"
                  )}
                </Td>
                <Td>
                  <Button
                    className="billing-summary-btn"
                    onClick={() => {
                      setSelectedEMI(emi);
                      setShowBillingSummary(true);
                    }}
                  >
                    Billing Summary
                  </Button>
                </Td>
                <Td>
                  {new Date(emi.emiDate).toLocaleString("en-US", {
                    month: "short",
                  }) +
                    "-" +
                    new Date(emi.emiDate).getFullYear()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <Modal
        show={showBillingSummary}
        onHide={() => setShowBillingSummary(false)}
        className="bill-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Billing Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEMI && (
            <Table className="table table-bordered">
              <Tbody>
                <Tr>
                  <Th>Property Name:</Th>
                  <Td>{selectedEMI.groupName}</Td>
                </Tr>
                <Tr>
                  <Th>Plot No:</Th>
                  <Td>{selectedEMI.plotNumber}</Td>
                </Tr>
                <Tr>
                  <Th>Plot Area:</Th>
                  <Td>{selectedEMI.phase || "N/A"}</Td>
                </Tr>
                <Tr>
                  <Th>Plot Amount:</Th>
                  <Td>₹{selectedEMI.plotAmount.toLocaleString('hi-IN') || "N/A"}</Td>
                </Tr>
                <Tr>
                  <Th>Passbook Number:</Th>
                  <Td>{selectedEMI.passbook}</Td>
                </Tr>
                <Tr>
                  <Th>Total EMI's:</Th>
                  <Td>{selectedEMI.totalEmis || "N/A"}</Td>
                </Tr>
                <Tr>
                  <Th>EMI's Paid:</Th>
                  <Td>{selectedEMI.paidEmis || "N/A"}</Td>
                </Tr>
                <Tr>
                  <Th>Remaining EMI's:</Th>
                  <Td>
                    {selectedEMI.totalEmis && selectedEMI.paidEmis !== undefined
                      ? selectedEMI.totalEmis - selectedEMI.paidEmis
                      : "N/A"}
                  </Td>
                </Tr>
                <Tr>
                  <Th>EMI Date:</Th>
                  <Td>
                    {new Date(selectedEMI.emiDate).toLocaleDateString("en-GB")}
                  </Td>
                </Tr>
                <Tr>
                  <Th>EMI Month:</Th>
                  <Td>
                    {new Date(selectedEMI.emiDate).toLocaleString("en-US", {
                      month: "short",
                    }) +
                      "-" +
                      new Date(selectedEMI.emiDate).getFullYear()}
                  </Td>
                </Tr>
                <Tr>
                  <Th>EMI Amount:</Th>
                  <Td>₹{Math.round(selectedEMI.emiAmount).toLocaleString('hi-IN')}</Td>
                </Tr>
                <Tr>
                  <Th>Remaining EMI Amount:</Th>
                  <Td>₹{Math.round(selectedEMI.remainingAmount).toLocaleString('hi-IN') || "N/A"}</Td>
                </Tr>
              </Tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </div>
    </>
  );
};

export default BillsTable;
