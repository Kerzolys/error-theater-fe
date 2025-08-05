import { NavMenu } from "../nav-menu/nav-menu";
import styles from "./footer.module.scss";

export const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className={styles.container}>
      <div className={styles.container__infoBlock}>
        <NavMenu horizontalMenu={false} />
      </div>
      <p>Kerzolys-Frontend. 2025-{date}</p>
    </footer>
  );
};
