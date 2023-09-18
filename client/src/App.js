import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import AdverticementList from "./pages/AdverticementList/AdverticementList";
import Adverticement from "./pages/adverticement/Adverticement";
import Requests from "./pages/requests/Requests";
import { Users } from "./pages/users/Users";
import MyAds from "./pages/myads/MyAds";
import NewAdverticement from "./pages/newadverticement/NewAdverticement";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={currentUser ? <Home /> : <Login></Login>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<Users />} />

          <Route path="/users/:userId" element={<Single />} />
          <Route
            path="/users/new"
            element={<New inputs={userInputs} title="Add New User" />}
          />
          <Route path="/adverticement" element={<AdverticementList />} />
          <Route
            path="/adverticement/newads"
            element={<NewAdverticement title="Add New Ads" />}
          />

          <Route
            path="/adverticement/:adverticementId"
            element={<Adverticement />}
          />
          <Route path="/requests" element={<Requests />} />
          {/* <Route path="users" element={<YourComponentHere />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
