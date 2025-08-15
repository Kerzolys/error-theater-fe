import type { TEvent } from "../../utils/types";
import styles from "./calendar-event.module.scss";

type Props = {
  data: TEvent;
};

export const CalendarEvent = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__info}>
        <div className={styles.container__info__time}>
          <span>{data.time}</span>
          <span>{data.date}</span>
        </div>
        <div className={`${styles.line} ${styles.line_vertical}`}></div>
        <span>{data.location}</span>
      </div>
      <div className={styles.line}></div>
      <p>{data.description}</p>
    </div>
  );
};
