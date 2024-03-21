"use client"

import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { IconUserCircle } from '@tabler/icons-react';


export default function Login() {  

  const handleResetPasswordClick = () => {

  }

  return (
    <main className={styles.main}>
      <NavBar/>
      <div className={styles.center}> 
        <div className={styles.login}>
          <div className={styles.boxHeader}>
            <h2>Reset Password</h2>
          </div>
          <div className={styles.loginFormIcon}>
            <IconUserCircle size={150} stroke={1}/>
          </div>          
          <form className={styles.loginForm}>
            <label className={styles.loginFormItem}>
              New password:
              <input type="text" name="newpassword" className={styles.largeTextInput}/>
            </label>
            <label className={styles.loginFormItem}>
              Confirm Password:
              <input type="text" name="confirmnewpassword" className={styles.largeTextInput}/>
            </label>
          </form>
          <button className={styles.lightgrayButton} onClick={handleResetPasswordClick}>Reset Password</button>
        </div>
      </div>
    </main>
  );
}