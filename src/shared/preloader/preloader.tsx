import styles from "./preloader.module.scss";

export const Preloader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>;
    </div>
  );
};
