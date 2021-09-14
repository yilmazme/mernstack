import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const [user, setUser] = useState({ username: "", password: "" });

  let axiosInst = axios.create();
  useEffect(() => {}, []);

  const handleToken = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.href = "/users";
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
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact>
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
              <input type="submit" value="login" />
            </form>
          </Route>
          <Route path="/users" exact>
            <Home />
          </Route>
          <Route path="*">No such path</Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
