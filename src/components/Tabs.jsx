import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import style from "./Tabs.module.css";

import ReportIcon from "@mui/icons-material/Report";
import { Button } from "@mui/material";

import config from "../config/config.json";
import axios from "axios";

const _Tabs = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Feedback", link: "/feed" },
  { name: "Inbox", link: "/inbox" },
  { name: "Complaints", link: "/complaints" },
];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Tabs() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});

  function toggleModal() {
    setIsOpen((prev) => !prev);
  }

  function handleChangeForm(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      userId: localStorage.getItem("userId"),
      complaint: formData.complaint,
      status: 0,
    };

    axios
      .post(`${config.apiBaseUrl}/add_complaint`, payload)
      .then((resp) => {
        console.log(resp.data);
        window.location.href = "/complaints";
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch(`${config.apiBaseUrl}/add_complaint`, {
    //   method: "POST",
    //   mode: "cors",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then((resp) => {
    //     // window.location.href = "/complaints";
    //     resp.json();
    //   })
    //   .then((resp) => {
    //     console.log(resp);
    //     // window.location.href = "/complaints";
    //   });
  }

  return (
    <div className={style.wrapper}>
      <section>
        {_Tabs.map((tab) => (
          <article onClick={navigate.bind(this, tab.link)}>{tab.name}</article>
        ))}

        <button onClick={toggleModal}>
          Report
          <ReportIcon />
        </button>
      </section>

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onChange={handleChangeForm}>
          <div>Report</div>
          <textarea
            name="complaint"
            placeholder="Enter complaint here"
          ></textarea>
        </form>
        <button onClick={handleSubmit}>Submit</button>
        {/* <Button onClick={handleSubmit}>Submit</Button */}
      </Modal>
    </div>
  );
}
