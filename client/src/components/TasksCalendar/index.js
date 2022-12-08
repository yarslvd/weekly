import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "../../redux/axios";

import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import styles from "./TasksCalendar.module.scss";

import ModalWindowEvent from "../ModalWindowEvent/index";
import { useOpenModal } from "../../hooks/useOpenModal";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCurrentCalendar,
  setCurrentCalendar,
} from "../../redux/slices/calendarSlice";

const TasksCalendar = () => {
  const [selectInfo, setSelectInfo] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [weekday, setWeekday] = useState("");
  const [holidays, setHolidays] = useState("");

  const [eventsData, setEventsData] = useState();
  const [isLoadingEvents, setLoadingEvents] = useState(true);

  const modalInfoEvent = useOpenModal(false);
  const currentCalendar = useSelector(selectCurrentCalendar);

  const dispatch = useDispatch();
  const calendarRef = React.createRef();
  const date = new Date();

  const defaultValue = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  useEffect(() => {
    if (!currentCalendar.day) {
      setWeekday(
        `${date.toLocaleString("en-us", {
          weekday: "long",
        })}, ${date.getDate()}`
      );
    } else {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentCalendar.day.toISOString());
      setWeekday(
        `${currentCalendar.day.toLocaleString("en-us", {
          weekday: "long",
        })}, ${currentCalendar.day.getDate()}`
      );
    }
    getHoliday();
  }, [currentCalendar.id, currentCalendar.day]);
  useEffect(() => {
    if (currentCalendar.id) {
      // setLoadingEvents(true);
      axios
        .get(
          `api/calendars/${currentCalendar.id}/events?date=${new Date(
            `${defaultValue.year}-${defaultValue.month}-${defaultValue.day}`
          ).toISOString()}`
        )
        .then((res) => {
          // setEventsData(res.data);
          // setLoadingEvents(false);
          dispatch(
            setCurrentCalendar({ ...currentCalendar, events: res.data })
          );
        })
        .catch((err) => {
          console.error(err);
          alert("Error");
        });
    }
  }, [currentCalendar.id]);

  useEffect(() => {
    if (currentCalendar.events) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.removeAllEvents();

      currentCalendar.events.forEach((event) => {
        calendarApi.addEvent({
          id: event.id,
          title: event.title,
          description: event.description,
          start: event.start_at,
          end: event.end_at,
          backgroundColor: event.color,
          event: event.type,
          eventDurationEditable: currentCalendar.isAdmin,
          eventStartEditable: currentCalendar.isAdmin,
        });
      });
    }
  }, [currentCalendar.id, currentCalendar.events]);

  const getHoliday = async () => {
    try {
      if (!currentCalendar.day) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const res = await axios.get(
          `/api/users/holiday?year=${year}&month=${month}&day=${day}`
        );
        if (res.data) {
          setHolidays(res.data.name);
        }
      } else {
        const year = currentCalendar.day.getFullYear();
        const month = currentCalendar.day.getMonth();
        const day = currentCalendar.day.getDate();

        const res = await axios.get(
          `/api/users/holiday?year=${year}&month=${month}&day=${day}`
        );
        if (res.data) {
          setHolidays(res.data.name);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectHandle = (selectInfo) => {
    if (!currentCalendar.isAdmin) {
      return;
    }
    setIsEdit(false);
    setSelectInfo(selectInfo);
    modalInfoEvent.handleOpen();
  };

  const editHandle = (selectInfo) => {
    setIsEdit(true);
    setSelectInfo(selectInfo);
    //console.log(selectInfo);
    modalInfoEvent.handleOpen();
  };

  const resizeHandle = async (selectInfo) => {
    if (!currentCalendar.isAdmin) {
      return;
    }
    await axios.patch(`/api/events/${selectInfo.event.id}`, {
      end_at: selectInfo.event.endStr,
    });
  };

  const moveHandle = async (selectInfo) => {
    if (!currentCalendar.isAdmin) {
      return;
    }

    await axios.patch(`/api/events/${selectInfo.event.id}`, {
      start_at: selectInfo.event.startStr,
      end_at: selectInfo.event.endStr,
    });
  };

  return (
    <section className={styles.events_container}>
      <ModalWindowEvent
        open={modalInfoEvent.isOpen}
        handleClose={modalInfoEvent.handleClose}
        selectInfo={selectInfo}
        isEdit={isEdit}
      />

      <div className={styles.heading}>
        <span className={styles.date}>{weekday}</span>
        {holidays && <span className={styles.holiday}>{holidays}</span>}
      </div>

      <FullCalendar
        editable={currentCalendar.isAdmin}
        selectable={true}
        allDaySlot={false}
        dayMaxEvents={true}
        nowIndicator={true}
        slotEventOverlap={false}
        headerToolbar={{
          start: "",
          end: "",
        }}
        plugins={[daygridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="timeGridDay"
        slotDuration={"00:15"}
        slotLabelInterval={"01:00"}
        height={"90%"}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }}
        scrollTime={moment().subtract("200", "minutes").format("HH:mm:ss")}
        select={selectHandle}
        eventClick={editHandle}
        eventResize={resizeHandle}
        eventDrop={moveHandle}
        ref={calendarRef}
      />
    </section>
  );
};

export default TasksCalendar;
