import React from "react";
import "../components/Dashboard.css";
import { Container, Row, Col, Badge } from "react-bootstrap";

import { PiBuildingsFill } from "react-icons/pi";
import { GiHouse } from "react-icons/gi";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { TbInvoice } from "react-icons/tb";
import { Link } from "react-router-dom";

function Dashboard() {
  // Example: You can fetch user info and stats from context or props
  const userName = ""; // Replace with actual user name from context/auth
  const totalProperties = 0; // Example static value
  const unpaidBills = 0;     // Example static value

  return (
    <div className="main_dashboard pt-5">
      <Container className="dash_container">
        {/* Welcome Message */}
        <Row className="mb-4">
          <Col xs={12} className="text-center">
            <h2 style={{ fontWeight: 700, color: "#6366f1" }}>
              Welcome, to your Dashboard!
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#64748b" }}>
              Here’s your customer dashboard. Manage your properties and billing with ease.
            </p>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mb-4 justify-content-center">
          <Col xs={12} sm={6} md={4} className="mb-2 text-center">
            <div style={{
              background: "#f0f4ff",
              borderRadius: "12px",
              padding: "18px 0",
              boxShadow: "0 2px 8px rgba(80,80,180,0.07)",
              fontWeight: 600,
              color: "#1d3853"
            }}>
              Total Properties: <Badge bg="primary" style={{ fontSize: "1rem" }}>{totalProperties}</Badge>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-2 text-center">
            <div style={{
              background: "#fff7ed",
              borderRadius: "12px",
              padding: "18px 0",
              boxShadow: "0 2px 8px rgba(255,165,0,0.07)",
              fontWeight: 600,
              color: "#b45309"
            }}>
              Unpaid Bills: <Badge bg="warning" text="dark" style={{ fontSize: "1rem" }}>{unpaidBills}</Badge>
            </div>
          </Col>
        </Row>

        {/* First Row */}
        <Row className="text-center justify-content-center">
          <Col xs={12} sm={6} lg={4} className="mb-3 dash_col">
            <Link to="/Available_properties" className="dscard">
              <div className="ds_text">
                <p className="dscard__description">Available Properties</p>
              </div>
              <div className="ds_icon">
                <PiBuildingsFill size={48} />
              </div>
              <button className="view-more-btn">View More</button>
            </Link>
          </Col>
          <Col xs={12} sm={6} lg={4} className="mb-3 dash_col">
            <Link to="/my_properties" className="dscard">
              <div className="ds_text">
                <p className="dscard__description">My Properties</p>
              </div>
              <div className="ds_icon">
                <GiHouse size={48} />
              </div>
              <button className="view-more-btn">View More</button>
            </Link>
          </Col>
        </Row>

        {/* Second Row */}
        <Row className="text-center justify-content-center ds_second_row">
          <Col xs={12} sm={6} lg={4} className="mb-3 dash_col">
            <Link to="/billing_details" className="dscard">
              <div className="ds_text">
                <p className="dscard__description">Paid Billing</p>
              </div>
              <div className="ds_icon">
                <FaFileInvoiceDollar size={48} />
              </div>
              <button className="view-more-btn">View More</button>
            </Link>
          </Col>
          <Col xs={12} sm={6} lg={4} className="mb-3 dash_col">
            <Link to="/payment_receipt" className="dscard">
              <div className="ds_text">
                <p className="dscard__description">Unpaid Billings</p>
              </div>
              <div className="ds_icon">
                <TbInvoice size={48} />
              </div>
              <button className="view-more-btn">View More</button>
            </Link>
          </Col>
        </Row>

        {/* Motivational Quote */}
        <Row className="mt-4">
          <Col xs={12} className="text-center">
            <em style={{ color: "#64748b", fontSize: "1rem" }}>
              "The best investment on Earth is earth." – Louis Glickman
            </em>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
