import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/door.module.css";
import axios from "axios";
import camera from "../themes/camera.png";
import Spinner from "react-bootstrap/Spinner";

function Door({ door, sendDoor }) {
  const [changing, setChanging] = useState(false);
  const [fileText, setFileText] = useState("no file choosen");
  const [uploading, setUploading] = useState(false);

  let { id } = useParams();

  //This is second proxy with one in package.json, this one for loadin uploads it should be empty for prod.
  const PROXY = process.env.REACT_APP_UPLOADS_PROXY;

  const handleSubmit = (e) => {
    setUploading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("myFile", door);
    axios
      .post("/api/user/uploaddoor", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) =>
        setTimeout(() => {
          setUploading(false);
          window.location.href = `/user/${id}`;
        }, 10)
      )
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
    <>
      {door && (
        <div className={styles.door}>
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
          <img
            className={styles.doorImg}
            src={
              typeof door != "string"
                ? URL.createObjectURL(door)
                : PROXY
                ? PROXY + door
                : `/${door}`
            }
            alt="profie_picture"
          />

          {changing ? (
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
