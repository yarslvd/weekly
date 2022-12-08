import React, { useState } from "react";
import { Modal, TextField, Box, Button, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "../../redux/axios";

import styles from "./ModalWindowCalendar.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { setCalendars } from "../../redux/slices/calendarSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

const ModalWindowCalendar = ({ open, handleClose, isEdit }) => {
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);
  const calendars = useSelector((state) => state.calendars.calendars);

  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    addCalendar(data);
  };

  const addCalendar = async (data) => {
    try {
      setTitle("");

      const resData = {
        title: data.title,
        members: [{ id: userInfo?.id }, ...members],
      };
      console.log("new calendar", resData);

      const res = await axios.post(`/api/calendars/`, resData);
      console.log("new calendar", res.data);
      dispatch(setCalendars([...calendars.items, res.data]));

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const loadOptions = async (inputValue, callback) => {
    if (!inputValue) {
      return;
    }
    const res = await axios.get(
      `/api/users?unique-key=${inputValue}&without=${encodeURIComponent(
        JSON.stringify(members)
      )}`
    );
    const options = [];
    res.data.forEach((user) => {
      if (userInfo.id != user.id) {
        options.push({
          value: user,
          label: user.full_name,
        });
      }
    });

    callback(options);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.container}>
        <h1 className={styles.heading}>New Calendar</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label={"Add title"}
            value={title}
            className={styles.textfield}
            {...register("title", {
              onChange: (e) => {
                setTitle(e.target.value);
              },
            })}
            required
          />

          <AsyncSelect
            options={[]}
            loadOptions={loadOptions}
            defaultOptions
            isMulti
            onChange={(newMembers) =>
              setMembers(
                newMembers.map((val) => {
                  return { id: val.value.id, email: val.value.email };
                })
              )
            }
            required
          />

          <div className={styles.bottom}>
            {isEdit && (
              <IconButton>
                <DeleteIcon sx={{ color: "#ff674f" }} />
              </IconButton>
            )}
            <Button
              variant="contained"
              className={styles.saveBtn}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalWindowCalendar;
