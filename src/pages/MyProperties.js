import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Link } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { API_BASE_URL } from "../components/Api";
import Base from "../components/Base";
import "../pages/MyProperties.css";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [openemimodal, setOpenEMIModal] = useState(false);
  const [openAgreementModal, setOpenAgreementModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [selectedEMI, setSelectedEMI] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
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
    panNumber: "",
    adharNumber: "",
    passbook: "",
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred this year yet
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    console.log("customer ",customer);
    if (customer) {
      setProfile({
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
        panNumber: customer.panNumber || "",
        adharNumber: customer.aadharNumber || "",
        passbook: customer.passbook || "",
        signature:customer.customerSignatures?.customerSignature || "",
      });
    }
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT token not found");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/customer/customer-properties`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
        console.log("Fetched Properties:", data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
        setSelectedEMI(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching EMI details:", error);
      }
    };
    fetchEmiDetails();
  }, []);

  const openEMIDetailsModal = () => {
    setOpenEMIModal(true);
  };

  const openAgreementModalHandler = (property) => {
    setSelectedDocument(property);
    setOpenAgreementModal(true);
  };

  const openTermsModalHandler = (termsUrl) => {
    setSelectedDocument(termsUrl);
    setOpenTermsModal(true);
  };

  const tableRows = [
    "Customer Name",
    "Property Name",
    "PassBook Number",
    "Phase",
    "Plot No",
    "Plot Area",
    "Booking Date",
    "Plot Total Amount",
    "Selected EMI'S",
    "EMI Amount",
    "Total EMI’s Paid",
    "Paid Amount",
    "Remaining EMI’s",
    "Remaining Amount",
    "EMI Details",
    "Agreement",
    "TermsAndConditions",
    "Status",
  ];

  return (
    <Base>
      <div className="my_properties_main_container">
        <Link to="/dashboard">
          <button className="back_btn">
            <IoMdArrowRoundBack /> Back
          </button>
        </Link>
        <h2 className="my_pr_table_heading text-center">My Properties</h2>
        <div className="table-container">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p className="loading-text">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="no-data-container">
              <p className="no-data-message">No properties available</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="styled-table">
                <Thead>
                  <Tr>
                    <Th>Details</Th>
                    {properties.map((_, index) => (
                      <Th key={index}>Property {index + 1}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {tableRows.map((rowTitle, rowIndex) => (
                    <Tr key={rowIndex}>
                      <Td className="row-title">{rowTitle}</Td>
                      {properties.map((property, colIndex) => (
                        <Td key={colIndex}>
                          {rowIndex === 0 ? (
                            property.customerName
                          ) : rowIndex === 1 ? (
                            property.groupName
                          ) : rowIndex === 2 ? (
                            property.passbook
                          ) : rowIndex === 3 ? (
                            property.facing
                          ) : rowIndex === 4 ? (
                            property.plotNumber
                          ) : rowIndex === 5 ? (
                            property.area
                          ) : rowIndex === 6 ? (
                            new Date(property.purchaseDate).toLocaleDateString('hi-IN')
                          ) : rowIndex === 7 ? (
                            property.price.toLocaleString('hi-IN')
                          ) : rowIndex === 8 ? (
                            Math.round(property.selectedEmis)
                          ) : rowIndex === 9 ? (
                            Math.round(property.emiAmount).toLocaleString('hi-IN')
                          ) : rowIndex === 10 ? (
                            property.emisPaid
                          ) : rowIndex === 11 ? (
                            Math.round(property.amountPaid).toLocaleString('hi-IN')
                          ) : rowIndex === 12 ? (
                            property.selectedEmis - property.emisPaid
                          ) : rowIndex === 13 ? (
                            Math.round(property.remainingAmount).toLocaleString('hi-IN')
                          ) : rowIndex === 14 ? (
                            <button
                              onClick={openEMIDetailsModal}
                              className="table-btn"
                            >
                              View EMI Details
                            </button>
                          ) : rowIndex === 15 ? (
                            <button
                              className="table-btn"
                              onClick={() =>
                                openAgreementModalHandler(property)
                              }
                            >
                              View Agreement
                            </button>
                          ) : rowIndex === 16 ? (
                            <button
                              className="table-btn"
                              onClick={() =>
                                openTermsModalHandler(
                                  property.TermsAndConditions
                                )
                              }
                            >
                              View Terms
                            </button>
                          ) : rowIndex === 17 ? (
                            property.status
                          ) : (
                            "N/A"
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>

        {/* EMI Details Modal */}
        <Modal
          open={openemimodal}
          onClose={() => setOpenEMIModal(false)}
          center
          showCloseIcon={false}
        >
          <div className="modal-content">
            <h2 className="emi_heading">EMI Details</h2>
            <div className="modal-body">
              <table className="emi-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>EMI Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEMI.length > 0 ? (
                    selectedEMI.map((emi, index) => (
                      <tr key={index}>
                        <td>
                          {new Date(emi.emiDate).toLocaleString("en-US", {
                            month: "short",
                          }) +
                            "-" +
                            new Date(emi.emiDate).getFullYear()}
                        </td>
                        <td>{new Date(emi.emiDate).toLocaleDateString()}</td>
                        <td>{Math.round(emi.emiAmount)}</td>
                        <td
                          style={{
                            color: emi.isPaid ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {emi.isPaid ? "Paid" : "Not Paid"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-emi-message">
                        No EMI details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer with Close Button */}
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setOpenEMIModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        {/* Agreement Modal */}
        <Modal
          open={openAgreementModal}
          onClose={() => setOpenAgreementModal(false)}
          center
          showCloseIcon={false}
        >
          <h2 className="terms_heading">Property Agreement</h2>
          <div
            style={{ maxHeight: "400px", overflowY: "auto", padding: "10px" }}
          >
            <p>
              This is the property agreement signed by you with the given
              details. This will act as the mutual agreement for selling and
              buying of the property. Please check the below details for more
              information about your property purchase.
            </p>

            <h2 className="agreement_heading">Customer Details</h2>
            <table className="emi-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Customer Name</strong>
                  </td>
                  <td>{profile.customerName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Father/Guardian Name</strong>
                  </td>
                  <td>{profile.fatherName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Age</strong>
                  </td>
                  <td>{calculateAge(profile.dateOfBirth)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Date Of Birth</strong>
                  </td>
                  <td>{profile.dateOfBirth}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Group Name</strong>
                  </td>
                  <td>Future Green City</td>
                </tr>
                <tr>
                  <td>
                    <strong>Aadhar Number</strong>
                  </td>
                  <td>{profile.adharNumber}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Pan Number</strong>
                  </td>
                  <td>{profile.panNumber}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Primary Address</strong>
                  </td>
                  <td>{profile.primaryAddress}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nominee</strong>
                  </td>
                  <td>{profile.nomineeName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Occupation</strong>
                  </td>
                  <td>{profile.occupation}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <h2 className="agreement_heading">Property Details</h2>
              <table className="emi-table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Property Name</strong>
                    </td>
                    <td>{selectedDocument?.groupName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Plot Number</strong>
                    </td>
                    <td>{selectedDocument?.plotNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Plot Facing</strong>
                    </td>
                    <td>{selectedDocument?.facing}</td>
                  </tr>
                  <tr>
                  <td>
                    <strong>Passbook Number</strong>
                  </td>
                  <td>{selectedDocument?.passbook}</td>
                </tr>
                  <tr>
                    <td>
                      <strong>Total Amount</strong>
                    </td>
                    <td>₹{selectedDocument?.price?.toLocaleString('hi-IN')}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total EMI’s</strong>
                    </td>
                    <td>{selectedDocument?.selectedEmis}</td>
                  </tr>
                  
                  <tr>
                    <td>
                      <strong>EMI Amount Per Month</strong>
                    </td>
                    <td>₹{selectedDocument?.emiAmount?.toLocaleString('hi-IN')}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Application Amount</strong>
                    </td>
                    <td>₹1000</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2" style={{marginLeft:"500px"}}>
                <img src={profile.signature} style={{height:"50px",width:"300px"}}></img>
                <p style={{color:"black"}}>Customer Signature</p>
              </div>
            </div>

            <p className="text_footer" style={{color:"black"}}>
              Thank you for purchasing property from RajaSree TownShips.
            </p>
          </div>
          <div className="modal-footer">
            <button
              className="cancel-btn"
              onClick={() => setOpenAgreementModal(false)}
            >
              Close
            </button>
          </div>
        </Modal>

        {/* Terms and Conditions Modal */}
        <Modal
          open={openTermsModal}
          onClose={() => setOpenTermsModal(false)}
          center
          showCloseIcon={false}
        >
          <div className="modal-content">
            <h2 className="terms_heading">Terms and Conditions</h2>
            <div
              className="modal-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {selectedDocument ? (
                <div className="para_heading">
                  <p>{selectedDocument}</p>{" "}
                </div>
              ) : (
                <div className="para_heading">
                  <p>
                    Acceptance of Terms: By accessing and using the Rajasree
                    Townships app, I agree to be bound to the Terms and
                    Conditions. If you don’t agree, please refrain from using
                    the website/app.
                  </p>
                  <p>
                    1. Hyderabad-Nagarjunasagar National Highway from
                    Ibrahimpatnam to Nalgonda Highway under Khudabhakshapalli
                    Panchayat. Survey no. 38,39,40,41,44 etc.
                  </p>
                  <p>
                    2. The area of the plot in Square Yards is approximately 150
                    sq. Yards & 200 sq. Yards. Additional charges apply.
                  </p>
                  <p>
                    3. The area of the plot in Guntas is approximately 605 Sq.
                    yards (5 Guntas), 1210 Sq. yards (10 Guntas).
                  </p>
                  <p>4. Farm Land per Acre Costs Rs 45,00,000/-.</p>
                  <p>
                    5. For each agreement, 30% of the property value is to be
                    paid.
                  </p>
                  <p>6. Registration expenses are to be borne by the Party.</p>
                  <p>
                    7. Management shall not be liable for unauthorized payments.
                  </p>
                  <p>8. Employees are not authorized to modify terms.</p>
                  <p>
                    9. Legal transactions are subject to Hyderabad jurisdiction.
                  </p>
                  <p>10. Prices may change before enrollment.</p>
                  <p>11. Payments made under this scheme are non-refundable.</p>
                  <p>
                    12. Payment should be made only to the company’s HDFC Bank
                    account.
                  </p>
                  <p>13. Members agree that they have inspected the land.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setOpenTermsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Base>
  );
};

export default MyProperties;
