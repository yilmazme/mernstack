import React, { useState } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import axios from "axios";
import styles from "./app.module.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("logged"))
  );
  const [user, setUser] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [logModal, setLogModal] = useState(true);

  //toggle between login and sign in form
  const getLogOrSign = (c) => {
    setLogModal(c);
  };
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
        localStorage.setItem("logged", JSON.stringify(true));
        console.log(response.data);
        //setIsLoggedIn(JSON.parse(localStorage.getItem("logged")));
        setTimeout(() => {
          window.location.href = `/home`;
        }, 300);
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
            {logModal ? (
              <Login
                handleSubmit={handleSubmit}
                user={user}
                errorMessage={errorMessage}
                setUser={setUser}
                passLogOrSign={getLogOrSign}
              />
            ) : (
              <Signup passLogOrSign={getLogOrSign} />
            )}
          </Route>
          <ProtectedRoute
            showRoute={isLoggedIn}
            path="/home"
            component={Home}
          />
          <ProtectedRoute
            showRoute={isLoggedIn}
            path="/user/:id"
            component={Profile}
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
