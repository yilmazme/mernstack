import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import anonymuous from "../themes/user.png";

export default function Profile() {
  const [user, setUser] = useState({ picture: null });

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
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  console.log("profile rendered");
  console.log();
  return (
    <div style={{ width: "100vw", textAlign: "center" }}>
      
      {user && (
        <div className="text-center">
          {user.image? <img
            src={`http://localhost:4000/${user.image}`}
            alt="profie_picture"
            width="300"
            height="400"
          /> : <img
          src={user.picture ? URL.createObjectURL(user.picture) : anonymuous}
          alt="profie_picture"
          width="300"
          height="400"
        />}
          
          <h3>Merhaba {user.name}</h3>
          <p>{new Date(user.dofj).toLocaleDateString()} tarihinde katıldınız</p>
        </div>
      )}
      <button onClick={handleLogout}>LOGOUT</button>
      <Link to="/home">Home</Link>
      <div>
        <form style={{}} onSubmit={handleSubmit}>
          <label htmlFor="username">Picture:</label>
          <input
            type="file"
            name="file"
            onChange={(e) => setUser({ ...user, picture: e.target.files[0] })}
            accept="image/*"
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}
