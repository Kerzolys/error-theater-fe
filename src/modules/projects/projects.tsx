import { useEffect } from "react";
import { useProjects } from "../../services/zustand/store";
import styles from "./projects.module.scss";
import { ProjectCard } from "../project-card/project-card";
import { Preloader } from "../../shared/preloader/preloader";

export const Projects = () => {
  const { isLoading, projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, []);

  const sortedProjects = projects.sort(
    (a, b) => Number(b.data) - Number(a.data)
  );

  if (isLoading) return <Preloader />;

  return (
    <div className={styles.container}>
      {sortedProjects.map((p) => (
        <ProjectCard data={p} key={p.id} />
      ))}
    </div>
  );
};
