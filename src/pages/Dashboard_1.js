import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { AiOutlineClose } from "react-icons/ai";
import { Sidebar } from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import "../pages/Dashboard_1.css";
function Dashboard_1() {
  const [sidebarmenu, setSideBarMenu] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSideBarMenu(false);
      } else {
        setSideBarMenu(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebar = () => {
    setSideBarMenu(!sidebarmenu);
  };

  const handleActiveTab = (path) => {
    setActiveTab(path); // Update the active tab based on the clicked path
  };

  return (
    <div className="dash_cont_main">
      <nav className="navbar  container-fluid fixed-top">
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

      {/* Apply the center or full-width class based on the sidebar state */}
      <div
        className={
          sidebarmenu
            ? "dashboard-container centered"
            : "dashboard-container full-width"
        }
      >
        <Dashboard />
      </div>
    </div>
  );
}
export default Dashboard_1;
