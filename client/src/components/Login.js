import React from "react";
import styles from "../styles/login.module.css";

function Login({ handleSubmit, user, setUser, errorMessage }) {
  console.log("login rendered");
  return (
    <div className={styles.loginMain}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p>{errorMessage}</p>
    </div>
  );
}

export default React.memo(Login);
