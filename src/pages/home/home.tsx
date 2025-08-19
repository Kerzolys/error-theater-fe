import { useLocation } from "react-router-dom";
import { HomeDescription } from "../../modules/home-description/home-description";
import { HomeHero } from "../../modules/home-hero/home-hero";
import { Layout } from "../../modules/layout/layout";
import { useEffect } from "react";

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToInfo) {
      const el = document.getElementById("info");
      if (el) {
        // скроллим к блоку
        el.scrollIntoView({ behavior: "smooth" });
      }
      // очищаем state, чтобы при последующих переходах случайно не скроллило
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <Layout>
      <HomeHero />
      <HomeDescription />
    </Layout>
  );
};
