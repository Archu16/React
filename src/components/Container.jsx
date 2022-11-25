import { useState, useEffect } from "react";
import style from "./Container.module.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./Navbar";
import Tabs from "./Tabs";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

import Chatbot from "./Chatbot";

import Feed from "./Feed";
import Inbox from "./Inbox";
import Complaints from "./Complaints";
import ServicesHist from "./ServicesHist";

import config from "../config/config.json";

import axios from "axios";

function isLoggedIn() {
  return localStorage.getItem("userId") ? true : false;
}

function Container() {
  const location = useLocation();

  const [showTabs, setShowTabs] = useState(true);
  const [showBot, setShowBot] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [services, setServices] = useState({});

  const [rows, setRows] = useState([]);

  function fetchAllServices() {
    axios
      .get(`${config.apiBaseUrl}/all_services`)

      .then((respAll) => {
        axios
          .get(
            `${config.apiBaseUrl}/services/${localStorage.getItem("userId")}`
          )

          .then((resp) => {
            const obj = {};
            respAll.data.forEach((item) => {
              obj[item.id] = item;
            });

            let slNo = 1;

            const rowss = resp.data.map((item) => ({
              id: item.service_id,
              slNo: slNo++,
              service: obj[item.service_id].service_name,
              status: 0 ? "Requested" : 1 ? "Pending" : "Completed",
            }));

            const userSerById = {};
            rowss.forEach((item) => {
              userSerById[item.id] = { ...item };
            });

            console.log(userSerById);

            window.userService = userSerById;

            setRows(rowss);
            setServices(resp.data);
          });
      });
  }

  useEffect(() => {
    fetchAllServices();
  }, []);

  function fetchAccount() {
    axios
      .get(`${config.apiBaseUrl}/get_account/${localStorage.getItem("userId")}`)
      .then((resp) => {
        window.balance = resp.data.balance;
        window.creditLimit = resp.data.limit;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (location.pathname === "/shopping") {
      setActiveTabIndex(1);
    } else setActiveTabIndex(0);

    const pathname = location.pathname;
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/services"
    )
      setShowTabs(false);
  }, [location.pathname]);

  useEffect(fetchAccount, []);

  return (
    <div className={style.wrapper}>
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {
        <Chatbot
          isOpen={showBot}
          toggle={() => {
            setShowBot((prev) => !prev);
          }}
        />
      }

      {showTabs && <Tabs activeIndex={activeTabIndex} />}

      <Routes>
        <Route
          path="/login"
          element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route path="/" element={<Landing />} />

        <Route
          path="/dashboard"
          element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/feed"
          element={isLoggedIn() ? <Feed /> : <Navigate to="/login" />}
        />

        <Route path="/inbox" element={<Inbox />} />
        <Route
          path="/complaints"
          element={isLoggedIn() ? <Complaints /> : <Navigate to="/login" />}
        />
        <Route
          path="/services"
          element={isLoggedIn() ? <ServicesHist /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default function RouterWrapper() {
  return (
    <BrowserRouter>
      <Container />
    </BrowserRouter>
  );
}
