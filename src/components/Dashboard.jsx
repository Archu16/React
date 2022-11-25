import { useEffect, useState } from "react";
import style from "./Dashboard.module.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import config from "../config/config.json";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import axiosRetry from "axios-retry";
import offerImg from "../offer-img.jpg";
axiosRetry(axios, { retries: 5, retryCondition: () => true });

export default function Dashboard() {
  const [accountDetails, setAccountDetails] = useState({});
  const [services, setServices] = useState([]);

  const navigate = useNavigate();

  function fetchAccount() {
    axios
      .get(`${config.apiBaseUrl}/get_account/${localStorage.getItem("userId")}`)
      .then((resp) => {
        setAccountDetails(resp.data);
        window.balance = resp.data.balance;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchAllServices() {
    axios
      .get(`${config.apiBaseUrl}/all_services`)
      .then((resp) => {
        setServices(resp.data.filter((f) => f.id > 2));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleClickIncLimit() {
    const payload = {
      userId: localStorage.getItem("userId"),
      serviceId: "1",
      status: 0,
      typeId: "Increase Credit Limit",
    };

    axios
      .post(`${config.apiBaseUrl}/create_service`, payload)
      .then((resp) => {
        window.location.href = "/services";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleClickdDeactivate() {
    const payload = {
      userId: localStorage.getItem("userId"),
      serviceId: "2",
      status: 0,
    };

    axios
      .post(`${config.apiBaseUrl}/create_service`, payload)
      .then((resp) => {
        window.location.href = "/services";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleClickCard(service) {
    const payload = {
      userId: localStorage.getItem("userId"),
      serviceId: service.id,
      status: 0,
    };

    axios
      .post(`${config.apiBaseUrl}/create_service`, payload)
      .then((resp) => {
        toast.success("Success", {
          onClose: () => {
            navigate("/services");
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(fetchAccount, []);
  useEffect(fetchAllServices, []);

  return (
    <div className={style.wrapper}>
      <h1>Dashboard</h1>
      <div className={style.cardSection}>
        <div className={style.atmCard}>
          <div className={style.cardNo}>{accountDetails?.creditCard}</div>
          <div className={style.bottom}>
            <div>MONTH/YEAR</div>
            <div>{accountDetails.exp}</div>
          </div>
        </div>

        <div className={style.buttons}>
          <button onClick={handleClickIncLimit}>Increase Limit</button>
          <button onClick={handleClickdDeactivate}>Deactivate</button>
          <button
            onClick={() => {
              window.location.href = "/services";
            }}
          >
            View Services History
          </button>
        </div>
      </div>

      <h1>Offers</h1>
      <div className={style.offerSection}>
        {services &&
          services.map((offer) => (
            <Card
              sx={{ maxWidth: 345, marginRight: "2em", marginBottom: "2em" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={offerImg}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {offer.service_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {offer.desc}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={handleClickCard.bind(this, offer)}
                  variant="contained"
                  size="large"
                >
                  Request
                </Button>
              </CardActions>
            </Card>
          ))}
      </div>
    </div>
  );
}
