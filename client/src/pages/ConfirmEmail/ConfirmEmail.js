import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ConfirmEmail.module.scss";
import background from "../../assets/images/ConfirmEmailBG.png";
import IllustrationSuccess from "../../assets/images/IllustrationSuccess.png";
import IllustrationError from "../../assets/images/IllustrationError.png";

import { fetchConfirmEmail } from "../../redux/slices/authSlice";

const ConfirmEmail = () => {
  const dispatch = useDispatch();

  const { userInfo, error } = useSelector((state) => state.auth);
  const { token } = useParams();

  React.useEffect(() => {
    console.log(token);
    dispatch(fetchConfirmEmail(token));
  }, []);

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
              <p>Email has been successfully confirmed</p>
            </>
          )}
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

export default ConfirmEmail;
