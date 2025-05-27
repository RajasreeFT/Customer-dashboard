import React from "react";
import Navbar from "./Navbar";

const Base = ({ children }) => {
  return (
    <div className="dashboard">
      <Navbar />

      <div>{children}</div>
    </div>
  );
};

export default Base;
