import { useLocation, useNavigate } from "react-router-dom";
import styles from "./nav-menu.module.scss";
import {
  NavMenuItemUI,
  type NavMenuItemProps,
} from "../../shared/nav-menu-item-ui/nav-menu-item-ui";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

export const NavMenu = ({ horizontalMenu }: { horizontalMenu: boolean }) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean | null>();
  const [infoInView, setInfoInView] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleInfoClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    const el = document.getElementById("info");

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToInfo: true } });
    } else {
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setIsOpenMenu(false);
      }
    }
  };

  const menuItems: NavMenuItemProps[] = [
    {
      id: 1,
      href: "/projects",
      title: "Projects",
      isActive: location.pathname === "/projects",
    },
    {
      id: 2,
      href: "/theater",
      title: "Theater",
      isActive: location.pathname === "/theater",
    },
    {
      id: 3,
      href: "/calendar",
      title: "Calendar",
      isActive: location.pathname === "/calendar",
    },
    {
      id: 4,
      href: "",
      title: "Info",
      isActive: location.pathname === "/" && infoInView,
      onClick: handleInfoClick,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpenMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenMenu]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const target = document.getElementById("info");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInfoInView(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.5,
      }
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  const handleOpenMenu = () => setIsOpenMenu(true);
  const handleCloseMenu = () => setIsOpenMenu(false);

  const mobileMenuLayout = (
    <>
      <div onClick={handleOpenMenu} className={styles.mobileMenu}>
        {menuMobile}
      </div>
      {isOpenMenu && (
        <div className={styles.mobileMenu__content}>
          <div
            className={styles.mobileMenu__content__closeButton}
            onClick={handleCloseMenu}
          >
            {closeMobileMenuIcon}
          </div>
          <div className={styles.container_vertical}>
            {menuItems.map((i) => (
              <NavMenuItemUI
                href={i.href}
                title={i.title}
                isActive={i.isActive}
                key={i.id}
                horizontal={false}
                onClick={i.onClick}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div
      className={classNames({
        [styles.container]: horizontalMenu,
        [styles.container_vertical]: !horizontalMenu,
      })}
    >
      {isMobile && horizontalMenu ? (
        mobileMenuLayout
      ) : (
        <>
          {menuItems.map((i) => (
            <NavMenuItemUI
              href={i.href}
              title={i.title}
              isActive={i.isActive}
              key={i.id}
              horizontal={horizontalMenu}
              onClick={i.onClick}
            />
          ))}
        </>
      )}
    </div>
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
    viewBox="0 0 512 512"
    xml:space="preserve"
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
