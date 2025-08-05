import { HomeDescription } from "../../modules/home-description/home-description";
import { HomeHero } from "../../modules/home-hero/home-hero";
import { Layout } from "../../modules/layout/layout";

export const HomePage = () => {
  return (
    <Layout>
      <HomeHero />
      <HomeDescription />
    </Layout>
  );
};
