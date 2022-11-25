import { useEffect, useState } from "react";

import style from "./Complaints.module.css";
import config from "../config/config.json";
import { format } from "date-fns";

import axios from "axios";
import axiosRetry from "axios-retry";
axiosRetry(axios, { retries: 5, retryCondition: () => true });

export default function Inbox() {
  const [complainst, setComplaints] = useState([]);

  function fetchComplaints() {
    axios
      .get(
        `${config.apiBaseUrl}/get_complaint/${localStorage.getItem("userId")}`
      )
      .then((resp) => {
        setComplaints(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className={style.wrapper}>
      {complainst.map((inbox) => (
        <article>
          <div className={style.body}>{inbox.complaint}</div>
          <div className={style.datetime}>
            {format(new Date(inbox.date), " HH:mm a, do MMM yyyy")}
          </div>
        </article>
      ))}
    </div>
  );
}
