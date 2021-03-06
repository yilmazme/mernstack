import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/profile.module.css";
import camera from "../themes/camera.png";
import jwtDecode from "jwt-decode";
import frame from "../themes/frame.png";
import Door from "./Door";
import TemporaryDrawer from "./subs/Drawer";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Home from "@material-ui/icons/Home";
import Spinner from "react-bootstrap/Spinner";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [changing, setChanging] = useState(false);
  const [fileText, setFileText] = useState("no file choosen");
  const [uploading, setUploading] = useState(false);



  let { id } = useParams();
  useEffect(() => {
    axiosInst({
      url: `/api/user/${id}`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => setUser({ ...res.data }))
      //.then((res) => console.log(res.data))
      .catch((err) => console.log(err.response.data));
  }, []);

  //this is for getting door from child comp and store in state
  const getDoor = (el) => setUser({ ...user, doorimage: el });

  // refresh stuff
  async function refreshToken() {
    try {
      let reftoken = localStorage.getItem("refreshToken");

      let res = await axios({
        url: "/api/login/refresh",
        method: "POST",
        data: { token: reftoken },
      });

      localStorage.setItem("accessToken", res.data.newAccessToken);
      return res.data.newAccessToken;
    } catch (error) {
      console.log(error);
    }
  }

  let axiosInst = axios.create();
  axiosInst.interceptors.request.use(
    async (config) => {
      let oldToken = localStorage.getItem("accessToken");
      let dateNow = new Date();
      let decodeToken = await jwtDecode(oldToken);
      if (decodeToken.exp * 1000 < dateNow.getTime()) {
        const newToken = await refreshToken();
        config.headers["Authorization"] = "Bearer " + newToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleLogout = () => {
    axiosInst({
      url: "/api/logout",
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("logged");

        setTimeout(() => {
          window.location.href = "/";
        }, 300);
      })
      .catch((err) => console.log("here we go:" + err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("myFile", user.image);
    axios
      .post("/api/user/upload", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setUploading(false);
        window.location.href = `/user/${id}`;
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  const btnRef = useRef();

  const handleFileText = (c) => {
    setFileText(c);
    btnRef.current.style.visibility = "visible";
  };

  return (
    <div className={styles.profileMain}>
      {uploading && (
        <div className={styles.loading}>
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </div>
      )}
      {user && (
        <div className={styles.userSection}>
          <>
            <img className={styles.frame} src={frame} alt="frame" />
            <img
              className={styles.profileImg}
              src={
                typeof user.image != "string"
                  ? URL.createObjectURL(user.image)
                  : `/${user.image}`
              }
              alt="profie_picture"
            />
          </>

          <h3>Hello, {user.name?.split(" ")[0]}</h3>
          <p>Share the amazing door you think evreyone should see</p>

          {changing ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="file">Choose</label>
              <span className="text-danger">{fileText}</span>
              <input
                className={styles.input}
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                  setUser({ ...user, image: e.target.files[0] });
                  handleFileText(e.target.files[0].name);
                }}
                accept="image/*"
                required
                hidden
              />
              <button
                style={{ visibility: "hidden" }}
                ref={btnRef}
                type="submit"
              >
                Upload
              </button>
            </form>
          ) : (
            <img
              className={styles.cameraPng}
              src={camera}
              onClick={() => setChanging((c) => !c)}
              alt="cameraPng"
            />
          )}
        </div>
      )}
      <div className={styles.doorMain}>
        <Door door={user?.doorimage} sendDoor={(c) => getDoor(c)} />
      </div>

      <div className={styles.nav}>
        <PowerSettingsNewIcon
          onClick={handleLogout}
          className={styles.PowerSettingsNewIcon}
        />
        <Home
          onClick={() => (window.location.href = "/home")}
          className={styles.Home}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "1.2rem",
          }}
        >
          <TemporaryDrawer />
        </div>
      </div>
    </div>
  );
}
