import { useLocation } from "react-router-dom";
import {
  NavMenuItemUI,
  type NavMenuItemProps,
} from "../../shared/nav-menu-item-ui/nav-menu-item-ui";
import styles from "./admin.module.scss";
import { ButtonUI } from "../../shared/button-ui/button-ui";
import { useAuth } from "../../services/zustand/store";

export const AdminPage = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const adminMenuItems: NavMenuItemProps[] = [
    {
      id: 1,
      title: "Projects",
      href: "./projects",
      isActive: location.pathname === "./projects",
    },
    {
      id: 2,
      title: "Images",
      href: "./images",
      isActive: location.pathname === "./images",
    },
    {
      id: 3,
      title: "Videos",
      href: "./videos",
      isActive: location.pathname === "./videos",
    },
    {
      id: 4,
      title: "Team members",
      href: "./team_members",
      isActive: location.pathname === "./team_members",
    },
    {
      id: 5,
      title: "Events",
      href: "./events",
      isActive: location.pathname === "./events",
    },
    {
      id: 6,
      title: "Home",
      href: "/",
      isActive: location.pathname === "/",
    },
  ];

  const handleOpenRegister = () => {
    console.log("fuck");
  };

  return (
    <div className={styles.container}>
      <nav className={styles.container__navMenu}>
        {adminMenuItems.map((i) => (
          <NavMenuItemUI
            href={i.href}
            title={i.title}
            isActive={i.isActive}
            key={i.id}
          />
        ))}
        <ButtonUI type="button" onClick={handleOpenRegister}>
          Register new user
        </ButtonUI>
        <ButtonUI type="button" onClick={logout}>
          Logout
        </ButtonUI>
      </nav>
    </div>
  );
};
