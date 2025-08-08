import { useLocation, useNavigate } from "react-router-dom";
import type { TProject } from "../../utils/types";
import styles from "./project-card.module.scss";

type Props = {
  data: TProject;
};

export const ProjectCard = ({ data }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    navigate(`/projects/${data.name}`);
  };

  return (
    <div
      className={styles.container}
      onClick={location.pathname === "/projects" ? handleNavigate : undefined}
      style={
        location.pathname === "/projects"
          ? { cursor: "pointer" }
          : { cursor: "auto" }
      }
    >
      <div className={styles.container__img}>
        <h2>{data.name}</h2>
        <img src={data.mainImage} alt={data.name} />
      </div>
    </div>
  );
};
