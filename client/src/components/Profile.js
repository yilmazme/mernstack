import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import anonymuous from "../themes/user.png";
import styles from "../styles/profile.module.css";
import camera from "../themes/camera.png";
import jwtDecode from "jwt-decode";
import frame from "../themes/frame.png";

export default function Profile() {
  const [user, setUser] = useState({ picture: null });
  const [changing, setChanging] = useState(false);

  let { id } = useParams();
  useEffect(() => {
    axiosInst({
      url: `/user/${id}`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => setUser({ ...res.data }))
      //.then((res) => console.log(res.data))
      .catch((err) => console.log(err.response.data));
  }, []);

  // refresh stuff
  async function refreshToken() {
    try {
      let reftoken = localStorage.getItem("refreshToken");

      let res = await axios({
        url: "/login/refresh",
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
      url: "/logout",
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("logged");
        console.log(res);

        window.location.href = "/";
      })
      .catch((err) => console.log("here we go:" + err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myFile", user.picture);
    axios
      .post("/user/upload", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) =>
        setTimeout(() => {
          window.location.href = `/user/${id}`;
        }, 100)
      )
      .catch((err) => console.log(err));
  };

  console.log("profile rendered");
  return (
    <div className={styles.profileMain}>
      {user && (
        <div className={styles.userSection}>
          {user.image ? (
            <>
              <img className={styles.frame} src={frame} alt="frame" />
              <img
                className={styles.profileImg}
                src={`http://localhost:4000/${user.image}`}
                alt="profie_picture"
              />
            </>
          ) : (
            <img
              className={styles.profileImg}
              src={
                user.picture ? URL.createObjectURL(user.picture) : anonymuous
              }
              alt="profie_picture"
            />
          )}

          <h3>Merhaba {user.name?.split(" ")[0]}</h3>
          <p>
            {new Date(user.dofj)?.toLocaleDateString()} tarihinde katıldınız
          </p>
          {changing ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="file"
                name="file"
                onChange={(e) =>
                  setUser({ ...user, picture: e.target.files[0] })
                }
                accept="image/*"
                required
              />
              <button type="submit">Upload</button>
            </form>
          ) : (
            <img
              className={styles.cameraPng}
              src={camera}
              onClick={() => setChanging((c) => !c)}
            />
          )}
        </div>
      )}

      <div className={styles.nav}>
        <Link to="/home">Home</Link>
        <button onClick={handleLogout}>LOGOUT</button>
      </div>
    </div>
  );
}
