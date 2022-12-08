import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Avatar, Button, Container, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import styles from "./Profile.module.scss";

import { selectIsAuth } from "../../redux/slices/authSlice";
import ModalWindowUserSettings from "../../components/ModalWindowUserSettings/index";
import { useOpenModal } from "../../hooks/useOpenModal";
import axios from "../../redux/axios";
import SideBarMenu from "../../components/SideBarMenu";

const getTime = (date) => {
  const dateObj = new Date(date);
  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();
  if (minute < 10) {
    minute += "0";
  }
  return `${hour}:${minute}`;
};

const Profile = () => {
  const navigate = useNavigate();

  const auth = useSelector(selectIsAuth);
  const { userInfo } = useSelector((state) => state.auth);
  const modalInfoUser = useOpenModal(false);

  const [calendars, setCalendars] = useState([]);
  const [upcommingEvents, setUpcommingEvents] = useState([]);
  const [avatarURL, setAvatar] = useState("");

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`/api/calendars`)
      .then((res) => {
        setCalendars(res.data.calendars);
      })
      .catch((err) => {
        console.error(err);
        alert("Error");
      });
  }, []);

  // useEffect(() => {
  //     if(calendars) {
  //         const date = new Date();
  //         let arrEvents = [];
  //         calendars.map((el) => {
  //             axios.get(`/api/calendars/${el.id}/events?date=${date.toISOString()}&limit=5`)
  //             .then((res) => {
  //                 res.data.map((el) => {
  //                     arrEvents.push(el);
  //                 })
  //             })
  //             .catch((err) => {
  //                 console.error(err);
  //                 alert("Error");
  //             });
  //         });
  //         console.log(arrEvents);
  //         console.log(arrEvents.sort((a, b) =>  new Date(a.start_at) - new Date(b.start_at)));
  //         setUpcommingEvents(arrEvents.sort((a, b) =>  new Date(a.start_at) - new Date(b.start_at)));
  //     }
  // }, [calendars])

  useEffect(() => {
    if (calendars[0]) {
      const date = new Date();
      axios
        .get(
          `/api/calendars/${
            calendars[0].id
          }/events?date=${date.toISOString()}&limit=5`
        )
        .then((res) => {
          setUpcommingEvents(
            res.data.sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
          );
        })
        .catch((err) => {
          console.error(err);
          alert("Error");
        });
    }
  }, [calendars]);

  useEffect(() => {
    if (userInfo) {
      let avatarUrl = `http://localhost:8000/api/files/${userInfo.profile_picture}`;
      setAvatar(avatarUrl);
    }
  }, [userInfo]);

  return (
    <main>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: "20px",
        }}
      >
        <ModalWindowUserSettings
          open={modalInfoUser.isOpen}
          handleClose={modalInfoUser.handleClose}
        />
        <div className={styles.user}>
          <div className={styles.heading}>
            <IconButton
              onClick={() => navigate("/home")}
              aria-label="go back"
              className={styles.backBtn}
            >
              <ArrowBackIcon />
            </IconButton>
            <h1>Profile</h1>
          </div>
          {userInfo && (
            <div className={styles.user_container}>
              <Avatar
                src={avatarURL}
                alt={userInfo.full_name}
                className={styles.avatar}
              />
              <h3>{userInfo.full_name}</h3>
              <span>@{userInfo.login}</span>
              <Button
                variant="contained"
                onClick={() => modalInfoUser.handleOpen()}
              >
                Settings
              </Button>
            </div>
          )}
        </div>
        <div className={styles.upcommingEvents_container}>
          <div className={styles.title}>
            <h2>Upcomming Events</h2>
            <span>General</span>
          </div>
          <div className={styles.upcommingEvents}>
            {upcommingEvents.map((event) => (
              <div
                key={"key -" + event.id}
                className={styles.event}
                style={{ backgroundColor: event.color }}
              >
                <span className={styles.taskTitle}>{event.title}</span>
                <div className={styles.time}>
                  <AccessTimeIcon></AccessTimeIcon>
                  <span>
                    {getTime(event.start_at)} - {getTime(event.end_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Profile;
