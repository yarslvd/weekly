import React from "react";
import Cookies from "js-cookie";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuthMe } from "./redux/slices/authSlice";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import ConfirmCalendarInvite from "./pages/ConformCalendarInvite/ConfirmCalendarInvite";
import Profile from "./pages/Profile/Profile";
import Info from "./pages/Info/Info";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3D405B",
    },
  },
});

const router = createBrowserRouter([
  {
      path: "/home",
      element: <Home />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/confirm/:token",
    element: <ConfirmEmail />,
  },
  {
    path: "/reset-password/:token",
    element: <ChangePassword />,
  },
  {
    path: "/confirm-calendar/:token",
    element: <ConfirmCalendarInvite />,
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
      path: '/',
      element: <Info />
  },
  // {
  //     path: '/new-question',
  //     element: <NewQuestion />
  // },
  // {
  //     path: '/profile',
  //     element: <Profile />
  // },
  // {
  //     path: '/users/:id',
  //     element: <UserPage />
  // },
  // {
  //     path: '/questions/:id/edit',
  //     element: <NewQuestion />
  // },
  // {
  //     path: '/notes',
  //     element: <Notes />
  // }
]);

const userToken = Cookies.get("token") ? Cookies.get("token") : null;

function App() {
  const dispatch = useDispatch();
  let path = router.state.location.pathname;
  const arr = ["/login", "/signup", "/reset-password"];

  const isAuth = useSelector(selectIsAuthMe);
  console.log("isAuth", isAuth);
  React.useEffect(() => {
    // if(!isAuth && !arr.includes(window.location.pathname)) {
    //   // console.log(window.location);
    //   window.location = '/login';
    // }
  }, [isAuth]);
  React.useEffect(() => {
    if (userToken) {
      dispatch(fetchAuthMe(userToken));
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
