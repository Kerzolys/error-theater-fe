import { Preloader } from "../preloader/preloader";
import styles from "./modal-preloader.module.scss";

export const ModalPreloader = () => {
  return (
    <div className={styles.container}>
      <h2>Please wait...</h2>
      <Preloader />
    </div>
  );
};
