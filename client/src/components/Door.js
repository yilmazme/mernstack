import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/door.module.css";
import axios from "axios";
import camera from "../themes/camera.png";

function Door({ door, sendDoor }) {
  const [changing, setChanging] = useState(false);
  const [fileText, setFileText] = useState("no file choosen");

  let { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myFile", door);
    axios
      .post("/user/uploaddoor", formData, {
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

  const btnRef = useRef();

  const handleFileText = (c) => {
    setFileText(c);
    btnRef.current.style.visibility = "visible";
  };

  return (
    <>
      {door && (
        <div className={styles.door}>
          <img
            className={styles.doorImg}
            src={
              typeof door === "object"
                ? URL.createObjectURL(door)
                : `http://localhost:4000/${door}`
            }
            alt="profie_picture"
          />

          {changing ? (
            // <form className={styles.form} onSubmit={handleSubmit}>
            //   <input
            //     type="file"
            //     name="file"
            //     onChange={
            //         (e) =>
            //             sendDoor(e.target.files[0])

            //     }
            //     accept="image/*"
            //     required
            //   />
            //   <button type="submit">Upload</button>
            // </form>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="file">Choose</label>
              <span className="text-danger">{fileText}</span>
              <input
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                  sendDoor(e.target.files[0]);
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
    </>
  );
}

export default Door;
