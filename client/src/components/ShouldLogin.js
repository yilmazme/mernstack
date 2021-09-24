import React, { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

export default function ShouldLogin() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "4rem",
      }}
    >
      <div>
        You should login to see the page. <br></br>
        You are redirected to login page...
      </div>
      <br></br>
      <div>
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="secondary" />
        <Spinner animation="grow" variant="success" />
        <Spinner animation="grow" variant="danger" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="info" />
        <Spinner animation="grow" variant="dark" />
      </div>
    </div>
  );
}
