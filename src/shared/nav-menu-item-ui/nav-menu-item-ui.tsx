import { Link } from "react-router-dom";
import styles from "./nav-menu-item-ui.module.scss";
import classNames from "classnames";

export type NavMenuItemProps = {
  id?: number;
  href: string;
  isActive: boolean;
  title: string;
  horizontal?: boolean;
  onClick?: (evt: React.MouseEvent) => void
};

export const NavMenuItemUI = ({
  href,
  isActive,
  title,
  horizontal,onClick
}: NavMenuItemProps) => {
  return (
    <Link
      to={href}
      className={classNames(styles.navMenuItem, {
        [styles.navMenuItem_active]: isActive,
        [styles.navMenuItem_horizontal]: !horizontal,
      })}
      onClick={onClick}
    >
      {title}
    </Link>
  );
};
