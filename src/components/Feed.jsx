import { useEffect, useState } from "react";
import style from "./Feed.module.css";

import { format } from "date-fns";
import config from "../config/config.json";

import axios from "axios";
import axiosRetry from "axios-retry";
axiosRetry(axios, { retries: 5, retryCondition: () => true });

export default function Feed({ noPost }) {
  const [formData, setFormData] = useState({});
  const [allComments, setAllComments] = useState([]);

  function handleChangeForm(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function postComment() {
    const payload = {
      userId: localStorage.getItem("userId"),
      comment: formData.comment,
    };

    axios
      .post(`${config.apiBaseUrl}/add_comment`, payload)
      .then((resp) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getComments() {
    axios
      .get(`${config.apiBaseUrl}/all_comments`)
      .then((resp) => {
        setAllComments(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(getComments, []);

  return (
    <div className={style.wrapper} style={{ padding: noPost ? "0em" : "6em" }}>
      {noPost && (
        <div
          style={{
            "padding-inline": "6em",
            paddingTop: "2em",
            marginBottom: "1em",
            fontWeight: "800",
            marginTop: "1em",
          }}
        >
          Feedback
        </div>
      )}
      {!noPost && (
        <>
          <form onChange={handleChangeForm}>
            <div className={style.row}>
              <textarea
                name="comment"
                type="text"
                placeholder="What's on your mind"
              />
            </div>
          </form>
          <button className={style.postBtn} onClick={postComment}>
            Post +
          </button>
        </>
      )}

      <section style={{ paddingTop: noPost ? "0em" : "6em" }}>
        {allComments.map((comment) => (
          <article style={{ width: noPost ? "100%" : "60%" }}>
            <div className={style.body}>
              <div className={style.user}>
                <span className={style.img}></span>
                <span className={style.name}>{comment.username}</span>
              </div>
              <div>{comment.comment}</div>
            </div>
            <div className={style.time}>
              {format(new Date(comment.date), "hh:mm a, dd MMM yyyy")}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
