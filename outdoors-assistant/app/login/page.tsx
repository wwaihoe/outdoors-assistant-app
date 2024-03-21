"use client"

import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { IconUserCircle } from '@tabler/icons-react';
import { useAuth } from "../components/AuthProvider";


export default function Login() {  
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const auth = useAuth();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleLoginClick = () => {
    if (input.username !== "" && input.password !== "") {
      auth?.loginAction(input);
      return;
    }
    alert("pleae provide a valid input");
  }

  return (
    <main className={styles.main}>
      <NavBar/>
      <div className={styles.center}> 
        <div className={styles.login}>
          <div className={styles.boxHeader}>
            <h2>Login</h2>
          </div>
          <div className={styles.loginFormIcon}>
            <IconUserCircle size={150} stroke={1}/>
          </div>          
          <form className={styles.loginForm}>
            <label className={styles.loginFormItem}>
              Username:
              <input type="text" name="username" className={styles.largeTextInput} onChange={handleInput}/>
            </label>
            <label className={styles.loginFormItem}>
              Password:
              <input type="text" name="password" className={styles.largeTextInput} onChange={handleInput}/>
            </label>
          </form>
          <button className={styles.lightgrayButton} onClick={handleLoginClick}>Login</button>
          <Link href="/signup"><button className={styles.transparentButton}>Create an account</button></Link>
          {/* <Link href="/resetpassword"><button className={styles.transparentButton}>Forgot password?</button></Link> */}
        </div>
      </div>
    </main>
  );
}