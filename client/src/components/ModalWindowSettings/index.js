import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  TextField,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Button,
  IconButton,
  Avatar,
  Radio,
  Popover,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";

import styles from "./ModalWindowSettings.module.scss";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { selectCurrentCalendar } from "../../redux/slices/calendarSlice";
import axios from "../../redux/axios";
import { setCalendars } from "../../redux/slices/calendarSlice";

const ModalWindowSettings = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([]);
  const [inviteUsers, setInviteUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const currentCalendar = useSelector(selectCurrentCalendar);
  console.log("currentCalendar", currentCalendar);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const calendars = useSelector((state) => state.calendars.calendars);

  const [anchorEl, setAnchorEl] = useState(null);

  const { register, handleSubmit, control } = useForm();

  useEffect(() => {
    setTitle(currentCalendar.title);
  }, [open]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (values, user) => {
    let role = values.target.defaultValue;
    role = role == "admin" ? "assignee" : "watcher";
    console.log("role", role);
    axios
      .patch(`/api/calendars/${currentCalendar.id}/members/${user.id}`, {
        role,
      })
      .then((res) => {
        let _users = users;
        const index = _users.findIndex((val) => val.id == user.id);
        _users[index].user_role = role;
        setUsers(_users);
      });
  };

  const handleRemoveUser = (user) => {
    axios
      .delete(`/api/calendars/${currentCalendar.id}/members/${user.id}`)
      .then((res) => {
        setUsers(users.filter((val) => val.id != user.id));
      });
  };

  const openMore = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onSubmit = (data) => {
    if (!currentCalendar.isAdmin) {
      handleClose();
      return;
    }
    axios
      .patch(`/api/calendars/${currentCalendar.id}`, { title: data.title })
      .then((res) => {
        let _calendars = calendars.items.map((val) => {
          return { ...val };
        });
        const index = _calendars.findIndex(
          (val) => val.id == currentCalendar.id
        );
        _calendars[index].title = data.title;
        dispatch(setCalendars(_calendars));
        handleClose();
      });
  };

  const handleDelete = () => {
    axios.delete(`/api/calendars/${currentCalendar.id}`).then((res) => {
      let _calendars = calendars.items.filter(
        (val) => val.id != currentCalendar.id
      );
      dispatch(setCalendars(_calendars));
      handleClose();
    });
  };

  const fetchMembers = async () => {
    if (currentCalendar.id) {
      axios
        .get(`/api/calendars/${currentCalendar.id}/members`)
        .then((res) => {
          const members = res.data.members.filter(
            (val) => val.id != userInfo.id
          );
          console.log(members);
          setUsers(members);
        })
        .catch((err) => {});
    }
  };
  useEffect(() => {
    if (currentCalendar?.id) {
      fetchMembers();
    }
  }, [open]);

  const loadOptions = async (event) => {
    if (!event.target.value) {
      return;
    }
    const without = `&without=${encodeURIComponent(
      JSON.stringify([...users, ...invitedUsers])
    )}`;
    console.log(
      `/api/users?unique-key=${event.target.value}${without}`,
      users
    );
    const res = await axios.get(
      `/api/users?unique-key=${event.target.value}${without}`
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
    const members = [
      { ...userInfo, role: "assignee" },
      ...users,
      ...invitedUsers.map((val) => {
        val.role = "watcher";
        val.user_role = "watcher";
        return val;
      }),
    ];
    console.log("Members", members);
    setInvitedUsers([]);

    axios
      .post(`/api/calendars/${currentCalendar.id}/members`, { members })
      .then(() => {
        setUsers(members.filter((val) => val.id != userInfo.id));
        console.log("invited");
      })
      .catch();
  };

  let yourAvatarUrl;
  {userInfo && (yourAvatarUrl = `http://localhost:8000/api/files/${userInfo.profile_picture}`)}

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.container}>
        <h1 className={styles.heading}>Calendar Settings</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.mainForm}>
          <TextField
            label={currentCalendar.isAdmin ? "Add title" : "Title"}
            value={title}
            className={
              currentCalendar.isAdmin
                ? styles.calendarTitle
                : `${styles.calendarTitle} ${styles.readOnlyInput}`
            }
            InputProps={{
              readOnly: !currentCalendar.isAdmin,
            }}
            {...register("title", {
              onChange: (e) => {
                setTitle(e.target.value);
              },
            })}
            required
          />
          <div className={styles.users}>
            <div className={`${styles.userInfo} ${styles.yourInfo}`}>
              <Avatar src={yourAvatarUrl} alt="Your Avatar" />
              <span>You</span>
            </div>
            {users &&
              users.map((el, index) => {
                const avatarUrl = `http://localhost:8000/api/files/${el.profile_picture}`;
                return (
                  <div className={styles.user} key={index}>
                    <div className={styles.userInfo}>
                      <Avatar src={avatarUrl} alt="Unknown User" />
                      <span>{el.full_name}</span>
                    </div>
                    {currentCalendar.isAdmin ? (
                      <>
                        <IconButton aria-label="More" onClick={handleClick}>
                          <MoreVertIcon />
                        </IconButton>
                        <Popover
                          id={id}
                          open={openMore}
                          anchorEl={anchorEl}
                          onClose={handleCloseMore}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          style={{ boxShadow: "0" }}
                          className={styles.popOver}
                        >
                          <FormControl>
                            <Controller
                              rules={{ required: true }}
                              control={control}
                              name={el.full_name}
                              render={({ field }) => {
                                return (
                                  <RadioGroup
                                    aria-labelledby="radiobuttons-permissions"
                                    defaultValue={
                                      el.user_role == "watcher"
                                        ? "user"
                                        : "admin"
                                    }
                                    name={el.full_name}
                                    sx={{ padding: "10px" }}
                                  >
                                    <FormControlLabel
                                      value="admin"
                                      control={
                                        <Radio
                                          size="small"
                                          onChange={(values) =>
                                            handleRoleChange(values, el)
                                          }
                                        />
                                      }
                                      label="Admin"
                                    />
                                    <FormControlLabel
                                      value="user"
                                      control={
                                        <Radio
                                          size="small"
                                          onChange={(values) =>
                                            handleRoleChange(values, el)
                                          }
                                        />
                                      }
                                      label="User"
                                    />

                                    <Button
                                      variant="contained"
                                      onClick={() => handleRemoveUser(el)}
                                    >
                                      Remove
                                    </Button>
                                  </RadioGroup>
                                );
                              }}
                            />
                          </FormControl>
                        </Popover>
                      </>
                    ) : (
                      <Button variant="contained">
                        {el.user_role == "watcher" ? "User" : "Admin"}
                      </Button>
                    )}
                    {/* <FormControl>
                                <RadioGroup
                                    aria-labelledby="radiobuttons-permissions"
                                    defaultValue="user"
                                    name="radio-buttons-group"
                                    sx={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <FormControlLabel value="admin" control={<Radio size="small" />} label="Admin" className={styles.label}/>
                                    <FormControlLabel value="user" control={<Radio size="small" />} label="User" />
                                </RadioGroup>
                                </FormControl> */}
                  </div>
                );
              })}
          </div>
          {currentCalendar.isAdmin && (
            <div className={styles.inviteUser}>
              <Autocomplete
                multiple
                className={styles.userInput}
                value={invitedUsers}
                id="tags-outlined"
                options={inviteUsers}
                getOptionLabel={(option) => option.full_name}
                filterOptions={filterInviteUsers}
                onChange={(event, val) => {
                  setInvitedUsers(val);
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
            </div>
          )}
          <div className={styles.buttons}>
            <Button variant="outlined" onClick={handleDelete}>
              Delete Calendar
            </Button>
            <Button variant="contained" type="submit">
              {currentCalendar.isAdmin ? "Save" : "Close"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalWindowSettings;
