import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";

import { Button, IconButton, Modal, Box, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";

import styles from "./ModalWindowUserSettings.module.scss";

const patchUser = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  },
  credentials: "include",
  withCredentials: true,
});

patchUser.interceptors.request.use((config) => {
  config.headers.Authorization = Cookies.get("token");

  return config;
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  borderRadius: "20px",
  p: 4,
};

const ModalWindowUserSettings = ({ open, handleClose }) => {
  const [error, setError] = useState();
  const [data, setData] = useState();
  const inputFileRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
      passwordRepeat: "",
      fullname: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values) => {
    for (let el in values) {
      if (values[el] == "") {
        delete values[el];
      }
    }

    values.full_name = values.fullname;
    console.log(values);
    patchUser
      .patch("/api/users", values)
      .then((res) => {
        handleClose();
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleChangeFile = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await patchUser.post("/api/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
    } catch (err) {
      console.log(err);
      alert("Error while setting new profile picture!");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="User Settings Modal"
      aria-describedby="User Settings"
      className={styles.modal}
    >
      <Box sx={style} className={styles.modal}>
        <div className={styles.heading}>
          <IconButton
            onClick={handleClose}
            aria-label="go back"
            className={styles.backBtn}
          >
            <ArrowBackIcon />
          </IconButton>
          <h1>Profile</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!Object.keys(errors).length == 0 && (
            <Alert severity="warning" className={styles.errmsg}>
              {Object.values(errors)[0].message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" className={styles.errmsg}>
              {error}
            </Alert>
          )}
          {data && window.location.reload() && (
            <Alert severity="success" className={styles.errmsg}>
              {data}
            </Alert>
          )}

          <div className={styles.button}>
            <Button
              variant="outlined"
              onClick={() => inputFileRef.current.click()}
            >
              Change Avatar
            </Button>
            <input
              ref={inputFileRef}
              type="file"
              onChange={handleChangeFile}
              hidden
            ></input>
          </div>
          <div className={styles.inputs}>
            <div className={styles.form}>
              <label htmlFor="username">Username</label>
              <div className={styles.field}>
                <input type="text" id="username" {...register("login")} />
                <PersonIcon></PersonIcon>
              </div>
            </div>
            <div className={styles.form}>
              <label htmlFor="name">Full Name</label>
              <div className={styles.field}>
                <input
                  type="text"
                  id="name"
                  {...register("fullname", {
                    pattern: {
                      value: /^([\w]{2,})+\s+([\w\s]{2,})+$/i,
                      message: "Please, enter your real name",
                    },
                  })}
                />
                <BadgeIcon></BadgeIcon>
              </div>
            </div>
            <div className={styles.form}>
              <label htmlFor="password">Password</label>
              <div className={styles.field}>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    pattern: {
                      value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                      message: "Password is not strong enough",
                    },
                  })}
                />
                <LockIcon></LockIcon>
              </div>
            </div>
            <div className={styles.form}>
              <label htmlFor="confirm">Repeat Password</label>
              <div className={styles.field}>
                <input
                  type="password"
                  id="confirm"
                  {...register("passwordRepeat", {
                    validate: (value) => {
                      if (watch("password") != value) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                />
                <LockIcon></LockIcon>
              </div>
            </div>
          </div>
          <div className={styles.button}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalWindowUserSettings;
