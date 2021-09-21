import React, { useState } from "react";
import styles from "../styles/sign.module.css";
import axios from "axios";

export default function Signin({ passLogOrSign }) {
  const [user, setUser] = useState({
    name: "",
    username: "",
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
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        console.log(response);
        window.location.href = "/welcome";
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      });
  };
  return (
    <div className={styles.signMain}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
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
        <span onClick={() => passLogOrSign(loginModal)}>Login</span>
      </form>

      <p>{errorMessage}</p>
    </div>
  );
}
