import { useNavigate } from "react-router-dom";
import type { TProject } from "../../utils/types";
import styles from "./project-card.module.scss";

type Props = {
  data: TProject;
};

export const ProjectCard = ({ data }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/projects/${data.name}`);
  };

  return (
    <div className={styles.container} onClick={handleNavigate}>
      <div className={styles.container__img}>
        <img src={data.mainImage.link} alt={data.name} />
      </div>
      <h2>{data.name}</h2>
    </div>
  );
};
