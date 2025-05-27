import React, { useEffect } from "react";
import Base from "../components/Base";
import LandSelection from "./LandSelection";
import "../pages/HyderabadProperties.css";
import "aos/dist/aos.css";
import AOS from "aos";
import hydProperty from "../images/hyd_pr.jpg";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";


const HyderabadProperties = () => {
  useEffect(() => {
    AOS.init({
      duration: 3000, 
      easing: "ease-in-out", 
      once: true, 
    });
  }, []);

  return (
    <Base>
      <div className="container-fluid available_pro_cont ">
        <Link to="/dashboard">
          <button className="back_btn">
            <span>
              <IoMdArrowRoundBack />
            </span>
            Back
          </button>
        </Link>
        <div className="row">
          <div className="col-12 p-0">
            <div className="image-container">
              <img
                src={hydProperty}
                alt="Property Management"
                className="img-fluid w-100 animated-image"
              />
            </div>
          </div>
        </div>

        <div className="container hyd_main_con">
          <div className="row  hyd_container d-flex justify-content-center align-items-center ">
            <div className="col-lg-6   future_heading" data-aos="fade-right">
              <h1 className="future_text_design">Future</h1>
              <h1 className="future-text">
                <span className="green_text_design">Green City</span>
              </h1>
            </div>

            <div className="col-lg-6" data-aos="fade-left">
              <p className="hyd_property_text">
                Future Green City Project: We have successfully completed 9
                years of glorious services by climbing steps day by day, month
                after month introducing new projects near the upcoming and
                blooming Hyderabad and Vijayawada. Your investments in our
                projects are bound to give profits up to 200%. We are committed
                to understanding the unique needs and tailoring our services to
                exceed the expectations of the investors. Features Amenities
                Very Near to the proposed Regional Ring Road (RRR) Hyderabad.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <LandSelection />
      </div>
      
    </Base>
  );
};

export default HyderabadProperties;
