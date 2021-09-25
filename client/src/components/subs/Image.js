import React from 'react'
import styles from "./image.module.css";
//import axios from 'axios';

function Image({onClick, source, down, likes}) {

    // const download=async()=>{
    //     const response = await axios.post("/download", { responseType: 'blob', imageName: down });
    //     return response;
    // }
    
    return (
        <div className={styles.imageDiv} onClick={onClick}>
            {/* <button onClick={download}>down</button> */}
            <p style={{color:"black"}}>{likes}</p>
            <img src={source} alt="a big door"/>
        </div>
    )
}

export default Image
