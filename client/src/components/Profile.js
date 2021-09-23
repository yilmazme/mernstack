import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import anonymuous from "../themes/user.png";
import styles from "../styles/profile.module.css";

export default function Profile() {
  const [user, setUser] = useState({ picture: null });
  const [changing, setChanging] = useState(false);

  let { id } = useParams();

  let axiosInst = axios.create();

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
      .then((res) => setTimeout(() => {
        window.location.href=`/user/${id}`
      }, 100))
      .catch((err) => console.log(err));
  };

  console.log("profile rendered");
  return (
    <div className={styles.profileMain}>
      {user && (
        <div className={styles.userSection}>
          {user.image ? (
            <img
              src={`http://localhost:4000/${user.image}`}
              alt="profie_picture"
            />
          ) : (
            <img
              src={
                user.picture ? URL.createObjectURL(user.picture) : anonymuous
              }
              alt="profie_picture"
            />
          )}

          <h3>Merhaba {user.name}</h3>
          <p>{new Date(user.dofj).toLocaleDateString()} tarihinde katıldınız</p>
          {changing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                name="file"
                onChange={(e) =>
                  setUser({ ...user, picture: e.target.files[0] })
                }
                accept="image/*"
              />
              <button type="submit">Upload</button>
            </form>
          ) : (
            <button onClick={() => setChanging((c) => !c)}>Upload a Pic</button>
          )}
        </div>
      )}

      <div className={styles.nav}>
        <button onClick={handleLogout}>LOGOUT</button>
        <Link to="/home">Home</Link>
      </div>
    </div>
  );
}
