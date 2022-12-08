import React, { useEffect, useRef, useState } from "react";
import { Typography, Button, Link, Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./SideBarMenu.module.scss";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from "@mui/icons-material/Person";
import ModalWindowCalendar from "../ModalWindowCalendar";
import { useOpenModal } from "../../hooks/useOpenModal";
import { setCurrentCalendar } from "../../redux/slices/calendarSlice";
import axios from "../../redux/axios";

const SideBarMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const calendars = useSelector((state) => state.calendars.calendars);
  const modalInfoCalendar = useOpenModal(false);
  const fullnameRef = useRef();

  const [selected, setSelected] = useState(2);

  const _setCurrentCalendar = (id) => {
    console.log("set calendar", id);
    let calendar = calendars?.items?.find((calendar) => calendar.id == id);
    let isAdmin =
      calendar?.members?.find((val) => val.id == userInfo.id)?.user_role ==
      "assignee";
    dispatch(setCurrentCalendar({ ...calendar, isAdmin }));
  };

  const handleLogOut = () => {
    console.log('log out');
    axios.post('/api/auth/logout');
    window.location.reload();
    navigate('/');
  }

  useEffect(() => {
    if (userInfo && fullnameRef)
      fullnameRef.current.innerHTML = userInfo?.full_name
        ?.split(" ")
        ?.join("<br/>");
  }, [userInfo, fullnameRef]);

  
  let yourAvatarUrl;
  {userInfo && (yourAvatarUrl = `http://localhost:8000/api/files/${userInfo.profile_picture}`)}

  return (
    <section className={styles.sidebar_container}>
      <ModalWindowCalendar
        open={modalInfoCalendar.isOpen}
        handleClose={modalInfoCalendar.handleClose}
      />
      <div className={styles.logo_container}>
        <Typography variant="h1" className={styles.logo}>
          weekly.
        </Typography>
      </div>
      <div className={styles.calendars_container}>
        <div className={styles.title}>
          <CalendarMonthIcon />
          <span>Calendars</span>
        </div>
        <div className={styles.calendars_list}>
          <table>
            <tbody>
              <tr>
                <td>
                  <input
                    type="radio"
                    id="General"
                    name="calendar"
                    value="General"
                    checked={selected === userInfo?.default_calendar_id}
                    onChange={() => {
                      setSelected(userInfo?.default_calendar_id);
                      _setCurrentCalendar(userInfo?.default_calendar_id);
                    }}
                  />
                  <label htmlFor="General">General</label>
                </td>
              </tr>
              {calendars.items &&
                userInfo &&
                calendars.items.map((calendar) => {
                  if (calendar.id != userInfo.default_calendar_id) {
                    return (
                      <tr key={calendar.id + "-key"}>
                        <td>
                          <input
                            type="radio"
                            id={calendar.id}
                            name="calendar"
                            value={calendar.id}
                            checked={selected === calendar.id}
                            onChange={() => {
                              setSelected(calendar.id);
                              _setCurrentCalendar(calendar.id);
                            }}
                          />
                          <label htmlFor={calendar.id}>{calendar.title}</label>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
          <Button onClick={() => modalInfoCalendar.handleOpen()}>
            <AddIcon />
            Add new
          </Button>
        </div>
      </div>
      <div className={styles.links}>
        <Link href="/profile">
          <PersonIcon />
          Account
        </Link>
        {/* <Link href="/settings">
          <SettingsIcon />
          Settings
        </Link> */}
      </div>
      <div className={styles.user_container}>
        <div className={styles.user}>
          <Avatar
            alt={userInfo && userInfo.full_name}
            src={yourAvatarUrl}
            sx={{ width: "50px", height: "50px" }}
          ></Avatar>
          <span ref={fullnameRef}></span>
        </div>
        <IconButton onClick={handleLogOut}><LogoutIcon/></IconButton>
      </div>
    </section>
  );
};

export default SideBarMenu;
