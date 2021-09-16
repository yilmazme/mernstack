import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import jwtDecode from "jwt-decode";
import axios from "axios";
import styles from "./app.module.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  ////

  const handleToken = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        handleToken(response.data.accessToken, response.data.refreshToken);
        setIsLoggedIn(true);

        window.location.href = "/home";
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      });
  };

  ////

  console.log("app rendered");
  console.log(isLoggedIn);
  return (
    <div className={styles.app}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>
          <Route path="/welcome">
            <Login
              handleSubmit={handleSubmit}
              user={user}
              errorMessage={errorMessage}
              setUser={setUser}
            />
          </Route>

          <ProtectedRoute
            showRoute={isLoggedIn}
            path="/home"
            component={Home}
          />
          <Route path="*">
            NO SUCH PATH: <code>{window.location.href}</code>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
