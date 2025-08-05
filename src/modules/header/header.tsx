import { Link } from "react-router-dom";
import { NavMenu } from "../nav-menu/nav-menu";
import styles from "./header.module.scss";

export const Header = () => {
  return (
    <header className={styles.container}>
      <Link to="/" className={styles.container__link}>
        ERROR-THEATER
      </Link>
      <NavMenu horizontalMenu />
    </header>
  );
};
