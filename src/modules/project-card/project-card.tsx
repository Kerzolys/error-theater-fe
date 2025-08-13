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
      <div
        className={styles.container__img}
        style={{
          backgroundImage: `url(${data.mainImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2>{data.name}</h2>
      </div>
    </div>
  );
};
