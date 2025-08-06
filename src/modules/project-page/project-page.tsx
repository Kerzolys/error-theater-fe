import { useParams } from "react-router-dom";
import { useProjects } from "../../services/zustand/store";
import { ImageSlider } from "../image-slider/image-slider";
import { VideoSlider } from "../video-slider/video-slider";

import styles from "./project-page.module.scss";

export const ProjectPage = () => {
  const { name } = useParams<{ name: string }>();
  const { projects, isLoading } = useProjects();
  const projectData = projects.find((p) => p.name === name);

  return (
    <div className={styles.container}>
      <div className={styles.container__info}>
        <h2>{projectData?.name}</h2>
        <p>{projectData?.description}</p>
      </div>
      <div className={styles.container__imageSlider}>
        <ImageSlider data={projectData?.images ?? []} />
      </div>
      <div className={styles.container__videoSlider}>
        <VideoSlider data={projectData?.videos ?? []} />
      </div>
    </div>
  );
};
