import React from 'react'
import styles from "./image.module.css";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Button } from '@material-ui/core';
//import axios from 'axios';

function Image({ onClick, user }) {

    // const download=async()=>{
    //     const response = await axios.post("/download", { responseType: 'blob', imageName: down });
    //     return response;
    // }

    return (
        <div className={styles.container} onClick={onClick}>
            {/* <button onClick={download}>down</button> */}
            <div className={styles.imgInfo}>
            <Button>Download</Button>
       
                    <span>
                        <FavoriteIcon className={styles.FavoriteIcon} />
                        <p style={{ color: "black" }}>{user?.doorlikes}</p>
                    </span>
            
                <div>
                    <img src={`http://localhost:4000/${user?.image}`}
                        alt="user"
                        style={{
                            width: "3rem", height: "3rem",
                            borderRadius: "50%", margin: "0 5px"
                        }} />
                    <span style={{ color: "black", backgroundColor: "inherit" }}>
                        {user?.name}
                    </span>
                </div>

            </div>
            <div className={styles.imgDiv}>
                <img src={`http://localhost:4000/${user.doorimage}`} alt="a big door" />
            </div>
        </div>
    )
}

export default Image
