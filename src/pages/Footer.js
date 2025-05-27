import React from "react";
import "../pages/Footer.css"; // Add your custom styles here for specific customizations

const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background ">
      <div className="container footer-top py-4">
        <div className="row  text-center justify-content-around footer_row">
          {/* Footer About Section */}
          <div className="col-lg-4 col-md-6 footer-about">
            <a
              href="index.html"
              className="logo d-flex align-items-center justify-content-center justify-content-lg-start"
            >
              <span className="sitename fw-bold">RAJASREE TOWNSHIPS</span>
            </a>
            <p className="mt-3">
              Future Green City Project We have successfully completed 9 years
              of glorious services by climbing steps day by day, month after
              month introducing new projects near the upcoming and blooming
              Hyderabad and Vijayawada.
              
            </p>
           
          </div>

          {/* Contact Section */}
          <div className="col-lg-4 col-md-12 footer-contact">
            <h4 className="contact_text_message">Contact Us</h4>
            <p>
              Hyderabad corporate office, Address Corp Off: Plot number 130, 1st
              Floor, GSK Arcade, Beside Shilparamam, Bhagayath Phase 2, Uppal,
              Hyderabad, Telangana 500039.
            </p>
            <p className="mt-2 g-2">
              <strong>Phone:</strong> <span>+91 6262666999</span>
            </p>
            <p>
              <strong>Email:</strong> <span>Info@rajasreetownships.in</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="container copyright text-center">
        <p>
          © <span>Copyright</span>{" "}
          <strong className="px-1 sitename footer_com_heading" >Rajasree Township</strong>{" "}
          <span>All Rights Reserved</span>
        </p>
        <div className="credits">
          Designed and Developed by{" "}
          <span className="fw-bold footer_com_heading">
            RAJASREE FUTURE TECH
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
