import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%",
        backgroundColor: "#9ff",
      }}
    >
      <NavLink activeStyle={{ color: "rgb(187, 98, 223)" }} to="/" exact>
        Home
      </NavLink>

      <NavLink activeStyle={{ color: "rgb(187, 98, 223)" }} to="/users">
        Users
      </NavLink>
    </div>
  );
}
