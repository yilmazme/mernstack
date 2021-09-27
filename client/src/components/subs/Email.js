import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import validator from "validator";
import styles from "./email.module.css";
import Close from "@material-ui/icons/Close";

function Mail({ close }) {
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");

  const myText = useRef();
  const myName = useRef();
  const myMail = useRef();
  const myPhone = useRef();

  const validateEmail = (e) => {
    var validEmail = e.target.value;

    if (validator.isEmail(validEmail)) {
      setValid(true);
      setEmail("");
    } else {
      setValid(false);
      setEmail(e.target.value);
    }
  };
  function sendEmail(e) {
    e.preventDefault();
    if (valid) {
      try {
        emailjs
          .sendForm(
            process.env.REACT_APP_SERVICE_ID,
            process.env.REACT_APP_TEMPLETE_ID,
            e.target,
            process.env.REACT_APP_USER_ID
          )
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );

        setTimeout(() => {
          alert("Your email delivered successfully!");
          onClear();
        }, 400);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          alert("Sorry, we couldn't deliver your mail :(");
        }, 1000);
      }
    } else {
      setEmail("enter a valid email");
    }
  }
  function onClear() {
    setEmail("");
    myText.current.value = "";
    myName.current.value = "";
    myMail.current.value = "";
    myPhone.current.value = "";
  }
  let flag = false;

  return (
    <div className={styles.mailMain}>
      <Close className={styles.Close} onClick={() => close(flag)} />

      <form onSubmit={sendEmail}>
        <div>
          <textarea
            ref={myText}
            className="p-2"
            name="message"
            placeholder="Massage"
            rows="8"
            cols="36"
            required
            autoComplete="false"
            maxLength="500"
            autoFocus={true}
          />
        </div>
        <div className={styles.inputDiv}>
          <input
            ref={myName}
            placeholder="Name"
            type="text"
            name="user_name"
            required
            autoComplete="false"
            maxLength="20"
          />
        </div>
        <div className={styles.inputDiv}>
          <input
            ref={myMail}
            placeholder="Email"
            type="email"
            name="user_email"
            onChange={(e) => validateEmail(e)}
            maxLength="30"
          />
          {email && <p className="text-danger">Please enter a valid email !</p>}
        </div>
        <div className={styles.inputDiv}>
          <input
            ref={myPhone}
            placeholder="Contact No"
            type="text"
            name="user_phone"
            required
            autoComplete="false"
            maxLength="20"
          />
        </div>
        <div className={styles.btnsDiv}>
          <button onClick={onClear}>Clear</button>
          <button type="submit" className={styles.submitBtn}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
export default React.memo(Mail);
