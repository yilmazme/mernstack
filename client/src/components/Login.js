import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

function Login({ login, isLogged }) {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {}, []);

  const handleToken = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.href = "/home";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        login();
        handleToken(response.data.accessToken, response.data.refreshToken);
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <Button className="btn btn-success" type="submit">
          Login
        </Button>
      </form>
      <p>{errorMessage}</p>
    </div>
  );
}

export default Login;
