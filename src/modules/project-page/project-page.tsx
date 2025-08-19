import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../../services/zustand/store";
import { ImageSlider } from "../image-slider/image-slider";
import { VideoSlider } from "../video-slider/video-slider";

import styles from "./project-page.module.scss";
import { Layout } from "../layout/layout";
import { useEffect } from "react";
import { Preloader } from "../../shared/preloader/preloader";
import { ButtonUI } from "../../shared/button-ui/button-ui";

export const ProjectPage = () => {
  const { name } = useParams<{ name: string }>();
  const { projects, isLoading, fetchProjects } = useProjects();
  const projectData = projects.find((p) => p.name === name);
  const navigate = useNavigate();

  const handleNavigateToProjects = () => navigate("/projects");

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <Layout>
      <div className={styles.container}>
        <ButtonUI
          type="button"
          onClick={handleNavigateToProjects}
          className={styles.container__backButton}
        >
          Back to projects
        </ButtonUI>
        <div className={styles.container__info}>
          <h2>{projectData?.name}</h2>
          <div className={styles.line}></div>
          <p>{projectData?.description}</p>
        </div>
        <div className={styles.container__imageSlider}>
          <ImageSlider data={projectData?.images ?? []} />
        </div>
        <div className={styles.line_large}></div>
        <div className={styles.container__videoSlider}>
          <VideoSlider data={projectData?.videos ?? []} />
        </div>
      </div>
    </Layout>
  );
};
