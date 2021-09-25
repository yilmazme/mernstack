import React from 'react'
import styles from "./backdrop.module.css";


export default function Backdrop({onClick}){
        return (
            <div onClick={onClick} className={styles.backdrop}></div>
        )
}