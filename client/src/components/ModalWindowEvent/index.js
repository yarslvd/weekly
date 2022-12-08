import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Autocomplete,
  createFilterOptions
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "../../redux/axios";

import styles from "./ModalWindowEvent.module.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectCurrentCalendar } from "../../redux/slices/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

const colors = [
  "#54A3FF",
  "#FFF172",
  "#FF7373",
  "#7EFF84",
  "#FF89FA",
  "#A864FF",
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ModalWindowEvent = ({ open, handleClose, selectInfo, isEdit }) => {
  const [eventType, setEventType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#54A3FF");
  
  const [inviteUsers, setInviteUsers] = useState([]);
  const [invitedMember, setInvitedMember] = useState({full_name: ''});

  const { register, handleSubmit } = useForm();

  const currentCalendar = useSelector(selectCurrentCalendar);
  const {userInfo} = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setTitle(selectInfo?.event?.title);
      setInvitedMember({full_name: ''});
      setDescription(selectInfo?.event?._def.extendedProps.description);
      setEventType(selectInfo?.event?._def.extendedProps.event);
      setColor(selectInfo.event?.backgroundColor);
    } else {
      setTitle("");
      setDescription("");
      setColor("#54A3FF");
    }
  }, [selectInfo, isEdit]);

  const onSubmit = (data) => {
    if (!currentCalendar.isAdmin) {
      handleClose();
      return;
    }

    if (!isEdit) {
      addEvent(data);
    } else {
      editEvent(data);
    }
  };

  const addEvent = async (data) => {
    try {
      setTitle("");
      setEventType("");
      const calendarApi = selectInfo.view.calendar;

      const resData = {
        title: data.title,
        description: data.description,
        start_at: selectInfo.startStr,
        end_at: selectInfo.endStr,
        color: data.color,
        type: data.event,
      };
      console.log("current calendar", currentCalendar);
      console.log(resData);
      //Add here axios to db
      const res = await axios.post(
        `/api/calendars/${currentCalendar.id}/events`,
        resData
      );

      calendarApi.addEvent({
        id: res.data.id,
        title: data.title,
        description: data.description,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: data.color,
        event: data.event,
      });

      // dispatch(setCurrentCalendar({...(currentCalendar), events: [...currentCalendar.events, res.data]}));
      handleClose();
      setEventType("");
    } catch (err) {
      console.log(err);
    }
  };

  const editEvent = async (data) => {
    try {
      setTitle(selectInfo?.event?.title);
      setEventType(selectInfo?.event?._def.extendedProps.event);

      const calendarApi = selectInfo.view.calendar;
      //Update db with axios
      const resData = {
        title: data.title === "" ? title : data.title,
        description: data.description === "" ? description : data.description,
        color: color,
        type: data.event === "" ? eventType : data.event,
      };

      await axios.patch(`/api/events/${selectInfo.event.id}`, resData);

      const currentEvent = calendarApi.getEventById(selectInfo.event.id);

      if (currentEvent) {
        console.log(currentEvent._def.title);
        currentEvent.setProp("title", resData.title);
        currentEvent.setExtendedProp("description", resData.description);
        currentEvent.setExtendedProp("eventType", resData.event);
        currentEvent.setProp("backgroundColor", resData.color);
      }

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEvent = async () => {
    try {
      //delete from db
      await axios.delete(`/api/events/${selectInfo.event.id}`);
      selectInfo.event.remove();
      setTitle("");
      setDescription("");

      handleClose();
    } catch (err) {
      console.log(err);
    }
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


  const loadOptions = async (event) => {
    if (!event.target.value) {
      return;
    }

    const res = await axios.get(
      `/api/users?unique-key=${event.target.value}`
    );

    const data = res.data.filter((val) => val.id != userInfo.id);
    console.log("options", data);
    setInviteUsers(data);
  };

  const filterInviteUsers = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.email,
  });

  const inviteMembers = () => {
    const member = invitedMember;
    console.log("Members", member);
    setInvitedMember({});

    axios
      .post(`/api/events/${selectInfo.event.id}`, member )
      .then(() => {
        //setUsers(member);
        console.log("invited", member);
      })
      .catch();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label={currentCalendar.isAdmin ? "Add title" : "Title"}
            value={title}
            className={
              currentCalendar.isAdmin
                ? styles.textfield
                : `${styles.textfield} ${styles.readOnlyInput}`
            }
            InputProps={{
              readOnly: !currentCalendar.isAdmin,
            }}
            {...register("title", {
              onChange: (e) => {
                setTitle(e.target.value);
              },
            })}
          />
          <TextField
            label={currentCalendar.isAdmin ? "Add description" : "Description"}
            className={
              currentCalendar.isAdmin
                ? styles.textfield
                : `${styles.textfield} ${styles.readOnlyInput}`
            }
            multiline
            value={description}
            rows={6}
            InputProps={{
              readOnly: !currentCalendar.isAdmin,
            }}
            {...register("description", {
              onChange: (e) => {
                setDescription(e.target.value);
              },
            })}
          />
          {currentCalendar.isAdmin ? (
            <>
            <FormControl fullWidth>
              <InputLabel id="type">Event type</InputLabel>
              <Select
                labelId="type"
                id="type"
                value={eventType}
                label="Event type"
                {...register("event", {
                  onChange: (e) => {
                    setEventType(e.target.value);
                  },
                })}
                required
              >
                <MenuItem value={"task"}>Task</MenuItem>
                <MenuItem value={"meeting"}>Meeting</MenuItem>
                <MenuItem value={"reminder"}>Reminder</MenuItem>
              </Select>
            </FormControl>
            {currentCalendar.id != userInfo.default_calendar_id 
            && 
            <div className={styles.inviteUser}>
              <Autocomplete
                className={styles.userInput}
                value={invitedMember}
                id="tags-outlined"
                options={inviteUsers}
                getOptionLabel={(option) => option.full_name}
                filterOptions={filterInviteUsers}
                onChange={(event, val) => {
                  setInvitedMember(val);
                  setInviteUsers([]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={loadOptions}
                    label="Invite user"
                  />
                )}
              />
              <IconButton aria-label="Add user" onClick={inviteMembers}>
                <PersonAddAlt1Icon />
              </IconButton>
            </div>}
            </>
          ) : (
            <TextField
              label="Event type"
              id="type"
              value={capitalizeFirstLetter(eventType)}
              className={styles.readOnlyInput}
              InputProps={{
                readOnly: !currentCalendar.isAdmin,
              }}
            />
          )}
          {currentCalendar.isAdmin && (
            <div className={styles.colors}>
              {colors.map((el, index) => (
                <div
                  className={styles.inputColor}
                  key={index}
                  selected={false}
                  style={{ backgroundColor: el }}
                  onClick={() => {
                    setColor(el);
                  }}
                >
                  <input
                    type="radio"
                    name="cardColor"
                    value={el}
                    {...register("color")}
                    required
                    checked={el === color}
                  />
                </div>
              ))}
            </div>
          )}
          <div className={styles.bottom}>
            <div className={styles.timeSlot}>
              <AccessTimeIcon />
              {selectInfo && (
                <span>
                  {getTime(
                    isEdit ? selectInfo.event.startStr : selectInfo.startStr
                  )}{" "}
                  -{" "}
                  {getTime(
                    isEdit ? selectInfo.event.endStr : selectInfo.endStr
                  )}
                </span>
              )}
            </div>
            {isEdit && currentCalendar.isAdmin && (
              <IconButton onClick={deleteEvent}>
                <DeleteIcon sx={{ color: "#ff674f" }} />
              </IconButton>
            )}
            <Button
              variant="contained"
              className={styles.saveBtn}
              type="submit"
            >
              {currentCalendar.isAdmin ? "Save" : "Close"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalWindowEvent;
