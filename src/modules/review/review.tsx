import type { TReview } from "../../utils/types";
import styles from "./review.module.scss";

type Props = {
  data: TReview;
};

export const Review = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <p className={styles.container__text}>{data.text}</p>
      <span className={styles.container__span}>{data.source}</span>
    </div>
  );
};
