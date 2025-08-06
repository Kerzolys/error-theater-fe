import classNames from "classnames";
import styles from "./input-ui.module.scss";

type Props = {
  title: string;
  isError?: boolean;
  errorText?: string;
  children: React.ReactNode;
  className?: string;
};

export const InputUI = ({
  title,
  isError,
  errorText,
  children,
  className,
}: Props) => {
  return (
    <>
      <label className={classNames(styles.label, className)}>
        <span className={styles.label__title}>{title}</span>
        {children}
        {isError && <span className={styles.label__error}>{errorText}</span>}
      </label>
    </>
  );
};
