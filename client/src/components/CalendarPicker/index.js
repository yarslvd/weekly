import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from "@mui/material";
import { Calendar } from "react-modern-calendar-datepicker";

import styles from "../CalendarPicker/CalendarPicker.module.scss";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

import SettingsIcon from "@mui/icons-material/Settings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ModalWindowSettings from "../ModalWindowSettings/index";
import { useOpenModal } from "../../hooks/useOpenModal";
import {
  selectCurrentCalendar,
  setCurrentCalendar,
} from "../../redux/slices/calendarSlice";
import axios from "../../redux/axios";

const myCustomLocale = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  weekDays: [
    {
      name: "Monday",
      short: "M",
    },
    {
      name: "Tuesday",
      short: "T",
    },
    {
      name: "Wednesday",
      short: "W",
    },
    {
      name: "Thursday",
      short: "T",
    },
    {
      name: "Friday",
      short: "F",
    },
    {
      name: "Saturday",
      short: "S",
      isWeekend: true,
    },
    {
      name: "Sunday",
      short: "S",
      isWeekend: true,
    },
  ],

  weekStartingIndex: 6,

  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },

  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },

  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },

  transformDigit(digit) {
    return digit;
  },
};

const getTime = (date) => {
  const dateObj = new Date(date);
  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();
  if (minute < 10) {
    minute += "0";
  }
  return `${hour}:${minute}`;
};

const CalendarPicker = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const currentCalendar = useSelector(selectCurrentCalendar);
  const date = new Date();

  const [isGeneral, setIsGeneral] = useState(false);
  const [closeEvents, setCloseEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const modalInfoCalendar = useOpenModal(false);

  const defaultValue = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  const [selectedDay, setSelectedDay] = useState(defaultValue);

  const onChange = async (e) => {
    setSelectedDay(e);
    const date = new Date(Date.parse(`${e.year}-${e.month}-${e.day}`));

    // REQUEST TO GET EVENTS FROM CERTAIN DAY
    let res = await axios
      .get(
        `/api/calendars/${currentCalendar.id}/events?date=${date.toISOString()}`
      )
      .catch((err) => {
        console.error(err);
        alert("Error");
      });

    dispatch(
      setCurrentCalendar({ ...currentCalendar, events: res.data, day: date })
    );
  };

  useEffect(() => {
    if (currentCalendar.id) {
      const date = new Date();
      axios
        .get(
          `/api/calendars/${
            currentCalendar.id
          }/events?date=${date.toISOString()}&limit=5`
        )
        .then((res) => {
          setCloseEvents(
            res.data.sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
          );
        })
        .catch((err) => {
          console.error(err);
          alert("Error");
        });
    }
  }, [currentCalendar.id, currentCalendar.events]);

  useEffect(() => {
    if (currentCalendar.id) {
      setIsGeneral(userInfo.default_calendar_id == currentCalendar.id);
      axios
        .get(`/api/calendars/${currentCalendar.id}/events`)
        .then((res) => {
          let eventsArr = [];
          res.data.map((el, index) => {
            let date = new Date(res.data[index].start_at);
            let obj = {
              year: date.getUTCFullYear(),
              month: date.getUTCMonth() + 1,
              day: date.getUTCDate(),
              className: styles.orangeDay,
            };
            eventsArr.push(obj);
          });
          setEvents(eventsArr);
          console.log(eventsArr);
        })
        .catch((err) => {
          console.error(err);
          alert("Error");
        });
    }
  }, [currentCalendar.id]);

  return (
    <section className={styles.calendarPicker}>
      <ModalWindowSettings
        open={modalInfoCalendar.isOpen}
        handleClose={modalInfoCalendar.handleClose}
      />

      <Box sx={{ mb: "10px" }}>
        <Calendar
          value={selectedDay}
          onChange={onChange}
          locale={myCustomLocale}
          colorPrimary="#E07A5F"
          calendarClassName={styles.customCalendar}
          customDaysClassName={events}
        />
      </Box>

      <Accordion
        sx={{
          display: { sm: "block", md: "none" },
          mb: "20px",
          borderRadius: "10px",
          border: "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="events"
        >
          <Typography>Upcoming Events</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.closeEvents}>
            {closeEvents.map((event) => (
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
        </AccordionDetails>
      </Accordion>
      <Box
        className={styles.closeEvents}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        {closeEvents.map((event) => (
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
      </Box>

      {!isGeneral && (
        <Button
          variant="contained"
          className={styles.addBtn}
          onClick={() => modalInfoCalendar.handleOpen()}
        >
          <SettingsIcon />
          Settings
        </Button>
      )}
    </section>
  );
};

export default CalendarPicker;
