import { useLocation } from "react-router-dom";
import {
  NavMenuItemUI,
  type NavMenuItemProps,
} from "../../shared/nav-menu-item-ui/nav-menu-item-ui";
import styles from "./admin.module.scss";
import { ButtonUI } from "../../shared/button-ui/button-ui";
import { useAuth } from "../../services/zustand/store";
import { AuthModal } from "../../modules/auth-modal/auth-modal";
import { useEffect, useState } from "react";
import { Modal } from "../../shared/modal-ui/modal-ui";
import { Preloader } from "../../shared/preloader/preloader";

export const AdminPage = () => {
  const { isAuthenticated, restoreSession, isLoading, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const adminMenuItems: NavMenuItemProps[] = [
    {
      id: 1,
      title: "Projects",
      href: "./projects",
      isActive: location.pathname === "./projects",
    },
    {
      id: 2,
      title: "Team members",
      href: "./team_members",
      isActive: location.pathname === "./team_members",
    },
    {
      id: 3,
      title: "Events",
      href: "./events",
      isActive: location.pathname === "./events",
    },
    {
      id: 4,
      title: "Home",
      href: "/",
      isActive: location.pathname === "/",
    },
  ];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) return <Preloader />;

  if (!isAuthenticated) {
    return (
      <>
        <Modal isOpen={true} onClose={handleClose}>
          <AuthModal isLogin />
        </Modal>
      </>
    );
  }

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
        <ButtonUI type="button" onClick={handleOpen}>
          Register new user
        </ButtonUI>
        <ButtonUI type="button" onClick={logout}>
          Logout
        </ButtonUI>
      </nav>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <AuthModal key={isOpen ? "open" : "closed"} isLogin={false} />
      </Modal>
    </div>
  );
};
