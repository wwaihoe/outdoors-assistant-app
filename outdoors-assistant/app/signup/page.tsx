"use client"

import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { IconUserCircle } from '@tabler/icons-react';


export default function Login() {  

  const handleSignUpClick = () => {

  }

  return (
    <main className={styles.main}>
      <NavBar/>
      <div className={styles.center}> 
        <div className={styles.login}>
          <div className={styles.boxHeader}>
            <h2>Sign Up</h2>
          </div>
          <div className={styles.loginFormIcon}>
            <IconUserCircle size={150} stroke={1}/>
          </div>          
          <form className={styles.loginForm}>
            <label className={styles.loginFormItem}>
              Username:
              <input type="text" name="username" className={styles.largeTextInput}/>
            </label>
            <label className={styles.loginFormItem}>
              Password:
              <input type="text" name="password" className={styles.largeTextInput}/>
            </label>
          </form>
          <button className={styles.lightgrayButton} onClick={handleSignUpClick}>Sign Up</button>
          <Link href="/login"><button className={styles.transparentButton}>Login to your account</button></Link>
        </div>
      </div>
    </main>
  );
}
