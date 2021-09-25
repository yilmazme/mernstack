import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import Backdrop from "./subs/Backdrop";
import Image from "./subs/Image";

function Home() {
  const [users, setUsers] = useState({ loading: true, all: [] });
  const [loggedUser, setLoggedUser] = useState(null);

const [backdrop, setBackdrop] = useState(false);
const [picId, setPicId] = useState(null);

function openPic(x) {
  setBackdrop(true)
  setPicId(x)
}
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
        <Link to={`/user/${loggedUser?._id}`}>
        <img src={`http://localhost:4000/${loggedUser?.image}` } 
        alt="user" 
        style={{width:"2rem", height:"2rem",
        borderRadius:"50%", margin:"0 5px"
        }}/>
        <span style={{color:"black", backgroundColor:"inherit"}}>
          Hello {loggedUser?.name}
        </span>
        
        </Link>
        <button onClick={handleLogout}>Logout</button>
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
                onClick={()=>openPic(user._id)}
                src={`http://localhost:4000/${user.doorimage}` }
                alt="userImage"
              />
              <p>By {user.name}</p>
             
            </div>
          );
        })}
      </div>
      {backdrop && <Backdrop onClick={()=>setBackdrop(false)}/>}
      {backdrop && 
      <Image 
      likes={users.all.filter(el=>el._id === picId)
        .map(ele=>ele.doorlikes)
        } 
      source={users.all.filter(el=>el._id === picId)
      .map(ele=>`http://localhost:4000/${ele.doorimage}`)
      } 
     
      
      // onClick={()=>setBackdrop(false)}
      
      />}
    </div>
  );
}

export default Home;
