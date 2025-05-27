import React from "react";
import "../pages/InvoiceDetails.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Swal from "sweetalert2";
import Base from "../components/Base";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

// Utility function to generate PDF
const handleDownloadPaymentReceipt = (receipt) => {
  const doc = new jsPDF();

  // Set background color for the header
  doc.setFillColor(57, 204, 113); // Green
  doc.rect(0, 0, 210, 30, "F"); // Fill the header area

  // Set font and size for the invoice heading
  doc.setFont("Arial, sans-serif", "bold");
  doc.setFontSize(24);
  doc.setTextColor(227, 39, 18); // Red text
  doc.text("RAJASREE TOWNSHIPS", 105, 20, { align: "center" });

  // Reset text color for other sections
  doc.setTextColor(0, 0, 0); // Black text

  // Define table data
  const tableData = [
    ["PAYMENT RECEIPT NUMBER", `PRN-${receipt.receiptNumber.toString().padStart(4, "0")}`],
    ["DATE", receipt.date],
    // ["Customer Name", "Customer Name"], 
    ["Property Name", receipt.propertyName],
    ["DESCRIPTION", "AMOUNT PAID"],
    [`EMI Payment`, `${receipt.paidAmount}`],
    ["PAYMENT METHOD", "Cash"], // Replace with dynamic data if available
  ];

  // Set table position and styling
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
  doc.text("TERMS & CONDITIONS", 20, startY + tableData.length * rowHeight + 10);
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

  // Save the PDF
  doc.save(`PaymentReceipt_${receipt.receiptNumber}.pdf`);
};

const Paymentreceipt = () => {
  const paymentReceiptData = [
    {
      Sno: 1,
      receiptNumber: "12345",
      propertyName: "Future Green City",
      price: 500000,
      paidAmount: 500000,
      date: "2024-11-01",
    },
    {
      Sno: 2,
      receiptNumber: "67890",
      propertyName: "Future Green City",
      price: 700000,
      paidAmount: 200000,
      date: "2024-10-15",
    },
  ];

  const handleView = (receipt) => {
    Swal.fire({
      title: `Payment Receipt Details: ${receipt.receiptNumber}`,
      html: `
        <p><strong>Property Name:</strong> ${receipt.propertyName}</p>
        <p><strong>Cost of the Property:</strong> ${receipt.price.toLocaleString()}</p>
        <p><strong>Paid Amount:</strong> ${receipt.paidAmount.toLocaleString()}</p>
        <p><strong>Date:</strong> ${receipt.date}</p>
        <button id="downloadReceipt" class="swal2-confirm swal2-styled" style="background-color:rgb(236, 129, 63); color: white;">
          Download Receipt
        </button>
        <button id="closeModal" class="swal2-cancel swal2-styled" style="background-color: rgb(244, 97, 80); color: white; margin-left: 10px;">
          Close
        </button>
      `,
      showConfirmButton: false,
      didOpen: () => {
        const downloadButton = document.getElementById("downloadReceipt");
        const closeButton = document.getElementById("closeModal");

        if (downloadButton) {
          downloadButton.addEventListener("click", () => {
            handleDownloadPaymentReceipt(receipt);
          });
        }

        if (closeButton) {
          closeButton.addEventListener("click", () => {
            Swal.close();
          });
        }
      },
    });
  };

  return (
    <Base>
      <div className="invoice_container">
        <Container>
          <Link to="/dashboard">
            <button className="back_btn">
              <span>
                <IoMdArrowRoundBack />
              </span>
              Back
            </button>
          </Link>
          <Row className="justify-content-center">
            <h3 className="table_heading text-center">Payment Receipt Details</h3>
            <Col xs={12} md={10} lg={11}>
              <Table className="custom-table">
                <Thead>
                  <Tr>
                    <Th>S.No</Th>
                    <Th>Receipt Number</Th>
                    <Th>Property Name</Th>
                    <Th>Cost of the Property </Th>
                    <Th>Paid Amount </Th>
                    <Th>Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paymentReceiptData.map((receipt, index) => (
                    <Tr key={receipt.Sno}>
                      <Td>{index + 1}</Td>
                      <Td>{receipt.receiptNumber}</Td>
                      <Td>{receipt.propertyName}</Td>
                      <Td>{receipt.price.toLocaleString()}</Td>
                      <Td>{receipt.paidAmount.toLocaleString()}</Td>
                      <Td>{receipt.date}</Td>
                      <Td>
                        <Button
                          className="table-view-btn"
                          onClick={() => handleView(receipt)}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </Base>
  );
};

export default Paymentreceipt;