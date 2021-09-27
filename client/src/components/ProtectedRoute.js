import React from "react";
import { Route } from "react-router-dom";
import ShouldLogin from "./ShouldLogin";

const ProtectedRoute = ({ showRoute, ...props }) => {
  if (showRoute) {
    return <Route {...props} />;
  } else {
    return <ShouldLogin />;
  }
};

export default ProtectedRoute;
