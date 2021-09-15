import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import jwtDecode from "jwt-decode";

function Home({ logout, isLogged }) {
  const [users, setUsers] = useState({ loading: true, all: [] });

  useEffect(() => {
    axiosInst
      .get("/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) => setUsers({ loading: false, all: res.data }))
      .catch((res) => console.log(res));
  }, []);
  let axiosInst = axios.create();
  const loggedUser = users.all.filter((user) => {
    return user.token === localStorage.getItem("refreshToken");
  })[0];

  const handledelete = async (id) => {
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
      .catch((err) => console.log(err));
  };
  // refresh stuf
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
        logout();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log(res);

        window.location.href = "/";
      })
      .catch((err) => console.log("here we go:" + err));
  };

  console.log("home rendered and loggin: " + isLogged);
  return (
    <div className="home">
      <Navbar />
      Merhaba {loggedUser && loggedUser.username}
      {users.loading && <h3>LOADING...</h3>}
      {users.all.map((user) => {
        return (
          <div
            key={user._id}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
              textAlign: "center",
              height: "30px",
            }}
          >
            <p>{user.name}</p>
            <button onClick={() => handledelete(user._id)}>x</button>
          </div>
        );
      })}
      <button
        onClick={() => {
          handleLogout();
        }}
      >
        LOGOUT
      </button>
    </div>
  );
}

export default Home;
