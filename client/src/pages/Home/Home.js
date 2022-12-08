import React from "react";
import axios from "../../redux/axios";
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  SwipeableDrawer,
  Link,
  Avatar,
} from "@mui/material";

import SideBarMenu from "../../components/SideBarMenu/index";
import TasksCalendar from "../../components/TasksCalendar";
import CalendarPicker from "../../components/CalendarPicker";
import ModalWindowCalendar from "../../components/ModalWindowCalendar";
import { useOpenModal } from "../../hooks/useOpenModal";

import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import styles from "./Home.module.scss";
import MenuIcon from "@mui/icons-material/Menu";

import {
  fetchCalendars,
  setCurrentCalendar,
} from "../../redux/slices/calendarSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const { calendars } = useSelector((state) => state.calendars);
  const isCalendarsLoading = calendars.status === "loading";
  const { userInfo } = useSelector((state) => state.auth);
  const modalInfoCalendar = useOpenModal(false);

  const [state, setState] = React.useState(false);
  const [selected, setSelected] = React.useState(2);

  // const isCalendarsLoading = calendars.status === 'loading';
  // console.log("main", calendars);
  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      await axios.post("/api/users/location", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const _setCurrentCalendar = (id) => {
    dispatch(
      setCurrentCalendar(
        calendars?.items?.find((calendar) => calendar.id == id)
      )
    );
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    dispatch(fetchCalendars());
    getGeolocation();
  }, []);

  useEffect(() => {
    // console.log("bebra", calendars?.items?.calendars)
    if (calendars?.items?.calendars)
      dispatch(setCurrentCalendar(calendars?.items?.calendars[0]));
  }, [calendars]);

  useEffect(() => {
    if (calendars.items && calendars.items.length && userInfo) {
      dispatch(
        setCurrentCalendar(
          calendars.items.find(
            (calendar) => calendar.id == userInfo.default_calendar_id
          )
        )
      );
    }
  }, [calendars.status, userInfo]);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 500 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className={styles.sidebar_container}
    >
      <ModalWindowCalendar
        open={modalInfoCalendar.isOpen}
        handleClose={modalInfoCalendar.handleClose}
      />
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
        <Link href="/account">
          <PersonIcon />
          Account
        </Link>
        <Link href="/settings">
          <SettingsIcon />
          Settings
        </Link>
      </div>
      <div className={styles.user}>
        <Avatar
          alt="User Name"
          src="img"
          sx={{ width: "50px", height: "50px" }}
        ></Avatar>
      </div>
    </Box>
  );

  return (
    <main>
      <AppBar
        position="static"
        sx={{
          display: { md: "block", lg: "none" },
          backgroundColor: "transparent",
        }}
        elevation={0}
        className={styles.navBar}
      >
        <Toolbar>
          <React.Fragment>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon
                sx={{ color: "#3D405B", fontSize: "30px", mt: "12px" }}
              />
            </IconButton>
            <SwipeableDrawer
              anchor="left"
              open={state["left"]}
              onClose={toggleDrawer("left", false)}
              onOpen={toggleDrawer("left", true)}
            >
              {list("left")}
            </SwipeableDrawer>
          </React.Fragment>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className={styles.logo}
          >
            weekly.
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <div className={styles.gridContainer}>
          <SideBarMenu className={styles.sideBar} />
          <TasksCalendar />
          <CalendarPicker />
        </div>
      </Container>
    </main>
  );
};

export default Home;
