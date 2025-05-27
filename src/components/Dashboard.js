import React from "react";
import "../components/Dashboard.css";
import { Container, Row, Col } from "react-bootstrap";

import { PiBuildingsFill } from "react-icons/pi";
import { GiHouse } from "react-icons/gi";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { TbInvoice } from "react-icons/tb";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="main_dashboard">
      <Container className="dash_container">
        {/* First Row */}
        <Row className="text-center justify-content-center">
          <Col xs={12} sm={6} lg={4} className="mb-3 dash_col">
            <Link to="/Available_properties" className="dscard">
              {/* <div  */}
              <div className="ds_text">
                <p className="dscard__description">Available Properties</p>
              </div>
              <div className="ds_icon">
                <PiBuildingsFill size={48} />
              </div>
              <button className="view-more-btn">View More</button>
              {/* </div> */}
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
        <Row className="text-center justify-content-center ds_second_row  ">
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
      </Container>
    </div>
  );
}

export default Dashboard;
