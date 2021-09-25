import React,{useState, useEffect} from 'react'
import {useParams } from "react-router-dom";
import styles from "../styles/door.module.css"
import axios from "axios";
import camera from "../themes/camera.png";


function Door({door, sendDoor}) {
    const [changing, setChanging] = useState(false);

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
    console.log(typeof door)
      console.log("door rendered");
      return (
        <>
          {door && (
            <div className={styles.door}>
              
                  <img
                    className={styles.doorImg}
                    src={(typeof door ==="object")? URL.createObjectURL(door)
                  :`http://localhost:4000/${door}`
                  }
                    alt="profie_picture"
                  />
              

              {changing ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <input
                    type="file"
                    name="file"
                    onChange={
                        (e) =>
                            sendDoor(e.target.files[0])
                      
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
 
        </>
      );
}

export default Door
