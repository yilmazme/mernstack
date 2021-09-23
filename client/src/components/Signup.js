import React, { useState } from "react";
import styles from "../styles/sign.module.css";
import axios from "axios";

export default function Signin({ passLogOrSign }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordAgain: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const loginModal = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.passwordAgain) {
      setErrorMessage("password shuld be same");
      return;
    }
    await axios
      .post("/register", {
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        console.log(response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      });
  };

  return (
    <div className={styles.signMain}>
      <div className={styles.banner1}>
        <p>Let's paint it black</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          autoFocus
        />
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="passwordAgain"
          value={user.passwordAgain}
          onChange={(e) => setUser({ ...user, passwordAgain: e.target.value })}
        />
        <button type="submit">Sign</button>
        <span onClick={() => passLogOrSign(loginModal)}>{"<< Login"}</span>
        <p className={styles.errorMessage}>{errorMessage}</p>
      </form>
      <div className={styles.banner2}>
        <p>Or maybe not, i don't know</p>
      </div>
    </div>
  );
}
