import React from "react";
import styles from "./image.module.css";
import FavoriteIcon from "@material-ui/icons/Favorite";

function Image({ sendLikes, user }) {
  //This is second proxy with one in package.json, this one for loadin uploads it should be empty for prod.
  const PROXY = process.env.REACT_APP_UPLOADS_PROXY;

  return (
    <div className={styles.container}>
      <div className={styles.imgInfo}>
        <span>
          <FavoriteIcon
            className={styles.FavoriteIcon}
            onClick={() => sendLikes(user._id)}
          />
          <p style={{ color: "black" }}>{user?.doorlikes}</p>
        </span>

        <div>
          <img
            src={PROXY + user?.image}
            alt="user"
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              margin: "0 5px",
            }}
          />
          <span style={{ color: "black", backgroundColor: "inherit" }}>
            {user?.name}
          </span>
        </div>
      </div>
      <div className={styles.imgDiv}>
        <img src={`/${user.doorimage}`} alt="a big door" />
      </div>
    </div>
  );
}

export default Image;
