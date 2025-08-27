import { useLocation, useNavigate } from "react-router-dom";
import {
  NavMenuItemUI,
  type NavMenuItemProps,
} from "../../shared/nav-menu-item-ui/nav-menu-item-ui";
import styles from "./header-admin.module.scss";
import { useEffect, useState } from "react";
import { ButtonUI } from "../../shared/button-ui/button-ui";
import classNames from "classnames";

export const HeaderAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const adminMenuItems: NavMenuItemProps[] = [
    {
      id: 1,
      title: "Projects",
      href: "/admin/projects",
      isActive: location.pathname === "/admin/projects",
    },
    {
      id: 3,
      title: "Team members",
      href: "/admin/team_members",
      isActive: location.pathname === "/admin/team_members",
    },
    {
      id: 4,
      title: "Events",
      href: "/admin/events",
      isActive: location.pathname === "/admin/events",
    },
    {
      id: 5,
      title: "Reviews",
      href: "/admin/reviews",
      isActive: location.pathname === "/admin/reviews",
    },
    {
      id: 6,
      title: "Home",
      href: "/",
      isActive: location.pathname === "/",
    },
    {
      id: 7,
      title: "Admin",
      href: "/admin",
      isActive: location.pathname === "/admin",
    },
  ];

  const handleBack = () => navigate(-1);
  const handleOpenMenu = () => setIsOpenMenu(true);
  const handleCloseMenu = () => setIsOpenMenu(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileAdminMenuLyout = (
    <div className={styles.menuMobile}>
      <ButtonUI type="button" onClick={handleBack}>
        Back
      </ButtonUI>
      <div className={styles.menuMobile__menuIcon} onClick={handleOpenMenu}>
        {menuMobile}
      </div>
      <div
        className={classNames(styles.menuMobile__menu, {
          [styles.menuMobile__menu_opened]: isOpenMenu,
          [styles.menuMobile__menu_closed]: !isOpenMenu,
        })}
      >
        <div
          className={styles.menuMobile__menu__closeButton}
          onClick={handleCloseMenu}
        >
          {closeMobileMenuIcon}
        </div>
        <nav className={styles.menuMobile__menu__menuNav}>
          {adminMenuItems.map((i) => (
            <NavMenuItemUI
              href={i.href}
              title={i.title}
              isActive={i.isActive}
              key={i.id}
              horizontal={false}
            />
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <header className={styles.header}>
      {isMobile ? (
        mobileAdminMenuLyout
      ) : (
        <nav className={styles.header__nav}>
          {adminMenuItems.map((i) => (
            <NavMenuItemUI
              href={i.href}
              title={i.title}
              isActive={i.isActive}
              key={i.id}
              horizontal
            />
          ))}
        </nav>
      )}
    </header>
  );
};

const menuMobile = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g id="Menu / Menu_Alt_01">
        {" "}
        <path
          id="Vector"
          d="M12 17H19M5 12H19M5 7H19"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>{" "}
    </g>
  </svg>
);

const closeMobileMenuIcon = (
  <svg
    fill="#000000"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g>
        {" "}
        <g>
          {" "}
          <path d="M437.018,74.987c-99.968-99.977-262.067-99.977-362.035,0c-99.977,99.959-99.977,262.059,0,362.027 c99.968,99.977,262.067,99.977,362.035,0C536.994,337.054,536.994,174.955,437.018,74.987z M418.918,418.914 c-89.984,89.967-235.853,89.967-325.837,0c-89.967-89.975-89.967-235.844,0-325.828c89.984-89.967,235.853-89.967,325.837,0 C508.885,183.07,508.885,328.939,418.918,418.914z"></path>{" "}
        </g>{" "}
      </g>{" "}
      <g>
        {" "}
        <g>
          {" "}
          <path d="M274.099,256.004l81.459-81.459c5.001-4.992,5.001-13.107,0-18.099c-4.992-5-13.107-5-18.099,0L256,237.905 l-81.459-81.459c-4.992-5.009-13.107-5.009-18.099,0c-5,4.992-5,13.107,0,18.099l81.459,81.459l-81.459,81.459 c-5,4.992-5,13.107,0,18.099c4.992,5.001,13.107,5.001,18.099,0L256,274.103l81.459,81.459c4.992,5,13.107,5,18.099,0 c5.001-4.992,5.001-13.107,0-18.099L274.099,256.004z"></path>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);
