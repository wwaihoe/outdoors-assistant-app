import styles from "../page.module.css";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IconUserFilled } from '@tabler/icons-react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function NavBar() {
  const { user, error, isLoading } = useUser();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleUserControlsClick = () => {
    setShowDropdown(!showDropdown);
  }

  return (
    <div className={styles.navBar}>
      <div className={styles.title}>
        <Link href="/"><h2>Outdoors Assistant</h2></Link>
          <Image className={styles.logo}
            src="/images/logo.png"
            width={50}
            height={50}
            alt="Logo"
          />
      </div>
      <div className={styles.navItems}>
        <nav>
          <Link className={pathname == "/" ? styles.navItemActive : styles.navItem} href="/">Home</Link>
          <Link className={pathname == "/events" ? styles.navItemActive : styles.navItem} href="/events">Events</Link>
        </nav>
        <nav className={styles.userNavGroup}> 
          {user && <p className={styles.userName}>{user.name}</p>}
          <button className={showDropdown? styles.navCircleItemActive: styles.navCircleItem} onClick={handleUserControlsClick}><IconUserFilled size={28}/></button>
        </nav>
      </div>
      {showDropdown?
        (
          <div className={styles.userControls}>
            {user? <Link href="/api/auth/logout">Logout</Link>: <Link href="/api/auth/login">Login</Link>}
          </div>
        ):null
      }
    </div>
  )
}