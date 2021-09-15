import React, { useState, useCallback } from "react";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";

import "./App.css";

function App() {
  const [logged, setLogged] = useState(null);

  const setLogin = () => {
    setLogged(true);
    console.log(logged);
  };
  const setLogout = () => {
    setLogged(false);
    console.log(logged);
  };
  console.log(logged);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>
          <Route path="/welcome">
            <Login isLogged={logged} login={setLogin} />
          </Route>
          <Route path="/home">
            <Home isLogged={logged} logout={setLogout} />
          </Route>
          <Route path="*">No such path</Route>
        </Switch>
      </Router>
      <div> {logged}</div>
    </div>
  );
}

export default App;
