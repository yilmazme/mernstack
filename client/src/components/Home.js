import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import Backdrop from "./subs/Backdrop";
import Image from "./subs/Image";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

function Home() {
  const [users, setUsers] = useState({ loading: true, all: [], likes: 0 });

  const [backdrop, setBackdrop] = useState(false);
  const [picId, setPicId] = useState(null);

  //This is second proxy with one in package.json, this one for loadin uploads it should be empty for prod.
  const PROXY = process.env.REACT_APP_UPLOADS_PROXY;

  function openPic(x) {
    setBackdrop(true);
    setPicId(x);
  }
  let axiosInst = axios.create();
  useEffect(() => {
    axiosInst
      .get("/api/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) =>
        setTimeout(() => {
          setUsers({ loading: false, all: res.data });
        }, 1000)
      )
      .catch((res) => console.log(res));
  }, [users.likes]);

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

  //axios bu şekilde daha iyi çalıştı
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

        window.location.href = "/";
      })
      .catch((err) => console.log("here we go:" + err));
  };
  //this is to increase likes by one
  const handleLikes = async (c) => {
    axios({
      url: "/api/likes/" + c,
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => setUsers({ ...users, likes: users.likes + 1 }))
      .catch((err) => alert(err.response.data.error));
  };

  return (
    <div className={styles.homeMain}>
      <div className={styles.nav}>
        <PowerSettingsNewIcon
          onClick={handleLogout}
          className={styles.PowerSettingsNewIcon}
        />
        <Link
          to={`/user/${localStorage.getItem("userId")}`}
          style={{ color: "black", backgroundColor: "unset" }}
        >
          {users.all
            .filter((el) => el._id === localStorage.getItem("userId"))
            .map((user) => {
              return (
                <React.Fragment key={user._id}>
                  <img
                    src={PROXY + user?.image}
                    alt="user"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      margin: "0 5px",
                    }}
                  />
                  <span
                    style={{
                      color: "black",
                      fontFamily: "cursive",
                      fontSize: "14px",
                    }}
                  >
                    {user?.name}
                  </span>
                </React.Fragment>
              );
            })}
        </Link>
      </div>

      <div className={styles.cardContainer}>
        {users.loading && (
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
        {users.all.map((user) => {
          return (
            <div className={styles.userCard} key={user._id}>
              <div className={styles.cardInfo}>
                <p>By {user.name}</p>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FavoriteIcon
                    className={styles.FavoriteIcon}
                    onClick={() => handleLikes(user._id)}
                  />
                  <p style={{ margin: "2px" }}>{user?.doorlikes}</p>
                </span>
              </div>
              <img
                onClick={() => openPic(user._id)}
                src={PROXY + user.doorimage}
                alt="userImage"
              />
              <div className={styles.cardInfoBottom}>
                Upload Date: {new Date(user.dofj)?.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
      {backdrop && <Backdrop onClick={() => setBackdrop(false)} />}
      {backdrop && (
        <Image
          user={users.all.filter((el) => el._id === picId)[0]}
          sendLikes={(c) => handleLikes(c)}
        />
      )}
    </div>
  );
}

export default Home;
