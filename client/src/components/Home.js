import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import anonymous from "../themes/user.png";

function Home() {
  const [users, setUsers] = useState({ loading: true, all: [] });
  const [loggedUser, setLoggedUser] = useState(null);
  let axiosInst = axios.create();
  useEffect(() => {
    axiosInst
      .get("/users", {
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
  }, []);

  useEffect(() => {
    setLoggedUser(
      users.all.filter((user) => {
        return user.token === localStorage.getItem("refreshToken");
      })[0]
    );
  }, [users]);

  const handleDelete = async (id) => {
    await axiosInst
      .delete(`/delete/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsers({
          loading: users.loading,
          all: users.all.filter((user) => user._id !== id),
        });
      })
      .catch((err) => console.log(err.response.data.error));
  };
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

  console.log("home rendered");
  return (
    <div className={styles.homeMain}>
      <div className={styles.nav}>
        Merhaba {loggedUser?.name}
        <Link to={`/user/${loggedUser?._id}`}>My Profile</Link>
        <button onClick={handleLogout}>LOGOUT</button>
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
              <img
                src={
                  user.image ? `http://localhost:4000/${user.image}` : anonymous
                }
              />
              <p>{user.name}</p>
              <button onClick={() => handleDelete(user._id)}>x</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
