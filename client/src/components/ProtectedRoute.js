import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ showRoute, ...props }) => {
  console.log(showRoute);
  if (showRoute) {
    return <Route {...props} />;
  } else {
    return null;
  }
};

export default ProtectedRoute;
