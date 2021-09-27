import React, { useState } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import axios from "axios";
import styles from "./app.module.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("logged"))
  );
  const [user, setUser] = useState({
    email: "",
    password: "",
    errorMessage: "",
  });
  const [logModal, setLogModal] = useState(true);

  //toggle between login and sign in form
  const getLogOrSign = (c) => {
    setLogModal(c);
  };
  //

  const handleToken = (accessToken, refreshToken, userId) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        handleToken(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.id
        );
        localStorage.setItem("logged", JSON.stringify(true));
        setTimeout(() => {
          window.location.href = `/home`;
        }, 300);
      })
      .catch((error) => {
        console.log(error.response.data);
        setUser({ ...user, errorMessage: error.response.data.error });
      });
  };

  ////

  return (
    <div className={styles.app}>
      <Router>
        <Switch>
          <Route exact path="/">
            {logModal ? (
              <Login
                handleSubmit={handleSubmit}
                user={user}
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
            exact
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
