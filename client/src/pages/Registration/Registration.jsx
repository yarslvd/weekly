import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { fetchSignup } from "../../redux/slices/authSlice";

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, error } = useSelector((state) => state.auth);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      login: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    dispatch(fetchSignup(values));
  };

  React.useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [userInfo]);

  return (
    <main>
      <h1>Registration</h1>
      {error && <Alert severity="error">{error}</Alert>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "min-content",
        }}
      >
        <label htmlFor="">Username</label>
        <input
          type="text"
          {...register("login", { required: "Input username" })}
        />
        <label htmlFor="">E-mail</label>
        <input
          type="email"
          {...register("email", { required: "Input e-mail" })}
        />
        <label htmlFor="">Password</label>
        <input
          type="password"
          {...register("password", { required: "Input password" })}
        />
        <button type="submit">Sign up</button>
        <Link href="/login">Sign in</Link>
      </form>
    </main>
  );
};

export default Registration;
