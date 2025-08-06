import classNames from "classnames";
import styles from "./button-ui.module.scss";

type Props = {
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
};

export const ButtonUI = ({
  type = "button",
  className,
  disabled,
  children,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(styles.button, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
