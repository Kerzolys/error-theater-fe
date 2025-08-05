import { Footer } from "../footer/footer";
import { Header } from "../header/header";

import styles from "./layout.module.scss";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
};
