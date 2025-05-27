import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosContact } from "react-icons/io";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "./Navbar.css";
import UserProfile from "./UserProfile";
function Navbar() {
  const [sidebarmenu, setSideBarMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const handleSidebar = () => {
    setSideBarMenu(!sidebarmenu);
  };

  const handleActiveTab = (path) => {
    setActiveTab(path); // Update the active tab based on the clicked path
  };
  return (
    <>
      <nav class="navbar  container-fluid fixed-top">
        <Link to="#" className="menu_bars">
          <FaBars onClick={handleSidebar} fontSize="30px" />
        </Link>
        <div className="navbar_heading">
          <p>RAjASREE TOWNSHiPS</p>
        </div>
        <div>
          <UserProfile />
        </div>
      </nav>
      <nav className={sidebarmenu ? "nav_menu active" : "nav_menu"}>
        <ul className="nav_menu_items" onClick={handleSidebar}>
          {/* <li className="navbar_toggle">
            <Link to="#" className="menu_bars">
              <AiOutlineClose />
            </Link>
          </li> */}
          {Sidebar.map((item, index) => {
            return (
              <li
                key={index}
                className={`${item.cName} ${
                  activeTab === item.path ? "active_tab" : ""
                }`}
                onClick={() => handleActiveTab(item.path)}
              >
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
export default Navbar;
