import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Retrieve user role from local storage
    const storedUserRole = JSON.parse(localStorage.getItem("currentUser"));
    console.log(storedUserRole.role);

    if (storedUserRole) {
      setUserRole(storedUserRole.role);
    }
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="sidebar">
      {userRole === "user" ? (
        <div>
          <div className="top"> <Link to="/" style={{ textDecoration: "none" }}>
              <img src="http://localhost:3000/assets/logo.png" alt="" />
            </Link>

          
          </div>
          <hr />{" "}
          <div className="center">
              <Link to="/" style={{ textDecoration: "none" }}>
              
                <span>Users</span>
             
            </Link>
            <ul>
              <p className="title">MAIN</p>

              <Link to="/" style={{ textDecoration: "none" }}>
                <li>
                  <DashboardIcon className="icon" />
                  <span>Dashboard</span>
                </li>
              </Link>
              <p className="title">LISTS</p>
              {/* <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Adverticemnets</span>
                </li>
              </Link> */}
             
            
             
           
             
             
            
              <li>
                <SettingsApplicationsIcon className="icon" />
                <span>Settings</span>
              </li>
              <p className="title">USER</p>
              <li>
                <AccountCircleOutlinedIcon className="icon" />
                <span>Profile</span>
              </li>
              <Link to={"/login"} onClick={handleLogout}>
                <li>
                  <ExitToAppIcon className="icon" />
                  <span>Logout</span>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="top">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src="http://localhost:3000/assets/logo.png" alt="" />
            </Link>
          </div>
          <hr />{" "}
          <div className="center">
            <ul>
              <span>Admin</span>

              <p className="title">MAIN</p>
              <Link to="/" style={{ textDecoration: "none" }}>
                <li>
                  <DashboardIcon className="icon" />
                  <span>Dashboard</span>
                </li>
              </Link>
              <p className="title">LISTS</p>
              <Link to="/adverticement" style={{ textDecoration: "none" }}>
                <li>
                  <SettingsSystemDaydreamOutlinedIcon className="icon" />
                  <span>Adverticements</span>
                </li>
              </Link>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>

              <Link to="/requests" style={{ textDecoration: "none" }}>
                <li>
                  <ScheduleSendIcon className="icon" />
                  <span>Request</span>
                </li>
              </Link>
              <li>
                <CalendarMonthIcon className="icon" />
                <span>Schedule</span>
              </li>
              <p className="title">USEFUL</p>
              <li>
                <InsertChartIcon className="icon" />
                <span>Stats</span>
              </li>
              <li>
                <NotificationsNoneIcon className="icon" />
                <span>Notifications</span>
              </li>

              <p className="title">USER</p>
              <li>
                <AccountCircleOutlinedIcon className="icon" />
                <span>Profile</span>
              </li>
              <Link to={"/login"} onClick={handleLogout}>
                <li>
                  <ExitToAppIcon className="icon" />
                  <span>Logout</span>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      )}

      {/* <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
