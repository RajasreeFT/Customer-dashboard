import React from "react";
import "../pages/AvailableProperties.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Base from "../components/Base";
import Text from "./Text";
import Footer from "./Footer";
import { FaHandPointUp } from "react-icons/fa";
// import ProjectCards from "./ProjectCards";
import availableProperty from "../images/av_pr.jpg";
import hydProperty from "../images/vij_pr.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";

const AvailableProperties = () => {
  const navigate = useNavigate();

  return (
    <Base>
      <div className="available_pro_cont">
        <Link to="/dashboard">
          <button className="back_btn">
            <span>
              <IoMdArrowRoundBack />
            </span>
            Back
          </button>
        </Link>

        <div className="gallery ">
          <img
            src={availableProperty}
            className="app_gallery  w-100 animated-image"
          ></img>
        </div>

        <div className="property_container container">
          <div className="row mt-5">
            <Text />
          </div>
          <p className="Available_property_text  row  ">
            Future Green City Project We have successfully completed 9 years of
            glorious services by climbing steps day by day, month after month
            introducing new projects near the upcoming and blooming Hyderabad
            and Vijayawada. Your investments in our projects are bound to give
            profits up to 200%. We are committed to understanding the unique
            needs and tailoring our services to exceed the expectations of the
            investors.
          </p>
        </div>

     
        <div className="properties-container container m-auto ">
          <div className="row gap-2">
            <div className="property-card col-sm-12 col-md-5 col-lg-5 m-auto ">
              <div className="property-image-container ">
                <a href="/property/hyderabad">
                  <img src={availableProperty} className="property-image" />
                  <div class="centered-text-hyd">
                    <h3>Future Green City</h3>
                    <p>Hyderabad</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="property-card col-sm-12 col-md-5 col-lg-5 m-auto ">
              <div className="property-image-container ">
                <a href="/property/saikeshava">
                  <img src={hydProperty} className="property-image" />
                  <div class="centered-text-vij">
                    <h3>Sai Kesava</h3>
                    <p>Vijayawada</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="avilable_note   mt-4">
          <p className="row text-center ">
            Click On the Each Project Above To Know More Details{" "}
          </p>
          <span>
            <FaHandPointUp />
          </span>
        </div>

        <div className="footer_con ">
          <Footer />
        </div>
      </div>
    </Base>
  );
};

export default AvailableProperties;
