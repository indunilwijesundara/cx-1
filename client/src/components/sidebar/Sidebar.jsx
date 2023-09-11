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

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Retrieve user role from local storage
    const storedUserRole = JSON.parse(localStorage.getItem("currentUser"));
    console.log(storedUserRole);

    if (storedUserRole) {
      setUserRole(storedUserRole);
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
          <div className="top">
            <Link to="/" style={{ textDecoration: "none" }}>
              <li>
                <span>Users</span>
              </li>
            </Link>
          </div>
          <hr />{" "}
          <div className="center">
            <ul>
              <p className="title">MAIN</p>
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
              <p className="title">LISTS</p>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>My Adverticemnet</span>
                </li>
              </Link>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Products</span>
                </li>
              </Link>
              <li>
                <CreditCardIcon className="icon" />
                <span>Orders</span>
              </li>
              <li>
                <LocalShippingIcon className="icon" />
                <span>Delivery</span>
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
              <p className="title">SERVICE</p>
              <li>
                <SettingsSystemDaydreamOutlinedIcon className="icon" />
                <span>System Health</span>
              </li>
              <li>
                <PsychologyOutlinedIcon className="icon" />
                <span>Logs</span>
              </li>
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
              <li>
                <span>Admin</span>
              </li>
            </Link>
          </div>
          <hr />{" "}
          <div className="center">
            <ul>
              <p className="title">MAIN</p>
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
              <p className="title">LISTS</p>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Products</span>
                </li>
              </Link>
              <li>
                <CreditCardIcon className="icon" />
                <span>Orders</span>
              </li>
              <li>
                <LocalShippingIcon className="icon" />
                <span>Delivery</span>
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
              <p className="title">SERVICE</p>
              <li>
                <SettingsSystemDaydreamOutlinedIcon className="icon" />
                <span>System Health</span>
              </li>
              <li>
                <PsychologyOutlinedIcon className="icon" />
                <span>Logs</span>
              </li>
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
