import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import styles from "./ConfirmCalendarInvite.module.scss";
import background from "../../assets/images/ConfirmEmailBG.png";
import IllustrationSuccess from "../../assets/images/IllustrationSuccess.png";
import IllustrationError from "../../assets/images/IllustrationError.png";

import axios from "../../redux/axios";

const ConfirmCalendarInvite = () => {
  const { userInfo, error } = useSelector((state) => state.auth);
  const { token } = useParams();
  const [message, setMessage] = useState();

  (async () => {
    await axios
      .get(`/api/calendars/confirm/${token}`)
      .then((res) => setMessage(res.data))
      .catch((err) => setMessage(err.response.data));
  })();

  return (
    <main>
      <section id={styles.bg}>
        <div className={styles.content_box}>
          {error && (
            <>
              <img src={IllustrationError} alt="Illustration" />
              <p>{error}</p>
            </>
          )}
          {userInfo && (
            <>
              <img src={IllustrationSuccess} alt="Illustration" />
              <p>{userInfo.full_name}</p>
            </>
          )}
          {message && <p>{message}</p>}
          <Link to="/">Home</Link>
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

export default ConfirmCalendarInvite;
