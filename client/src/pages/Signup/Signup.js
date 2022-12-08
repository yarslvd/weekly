import React from "react";
import { Link, Button, Alert, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Signup.module.scss";
import background from "../../assets/images/SignUpBG.png";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { fetchSignup } from "../../redux/slices/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, error } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

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
      email: "",
      full_name: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    console.log(values);
    dispatch(fetchSignup(values));
    navigate("/login");
  };

  return (
    <main>
      <section id={styles.bg}>
        <div className={styles.content_box}>
          <IconButton
            onClick={() => navigate(-1)}
            aria-label="go back"
            className={styles.backBtn}
          >
            <ArrowBackIcon />
          </IconButton>
          <div className={styles.heading}>
            <h1>GET STARTED</h1>
            <span>Register your account</span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputs}>
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
              <div className={styles.form}>
                <label htmlFor="username">Username</label>
                <div className={styles.field}>
                  <input
                    type="text"
                    id="username"
                    required
                    minLength={3}
                    {...register("login")}
                  />
                  <PersonIcon></PersonIcon>
                </div>
              </div>
              <div className={styles.form}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.field}>
                  <input
                    type="text"
                    id="name"
                    required
                    {...register("full_name", {
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
                <label htmlFor="email">Email</label>
                <div className={styles.field}>
                  <input
                    type="email"
                    id="email"
                    required
                    {...register("email", {
                      pattern: {
                        value:
                          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                        message: "Please, enter a valid email",
                      },
                    })}
                  />
                  <EmailIcon></EmailIcon>
                </div>
              </div>
              <div className={styles.form}>
                <label htmlFor="password">Password</label>
                <div className={styles.field}>
                  <input
                    type="password"
                    id="password"
                    required
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
                    required
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
              <Button type="submit" variant="contained">
                Sign up
              </Button>
              <span>Already have an account?</span>
              <Link href="/login">Log in</Link>
            </div>
          </form>
        </div>
        <div className={styles.image_box}>
          <div className={styles.text}>
            <h2>weekly.</h2>
          </div>
          <img src={background} alt="" />
        </div>
      </section>
    </main>
  );
};

export default Signup;
