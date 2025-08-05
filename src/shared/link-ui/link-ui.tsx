import { Link } from "react-router-dom";

import styles from "./link-ui.module.scss";
import classNames from "classnames";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const LinkUI = ({ href, children, className }: Props) => {
  return (
    <Link to={href} className={classNames(styles.link, className)}>
      {children}
    </Link>
  );
};
