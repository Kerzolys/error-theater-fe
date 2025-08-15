import type { TMember } from "../../utils/types";
import styles from "./team-card.module.scss";

type Props = {
  data: TMember;
};

export const TeamCard = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__photo}>
        <img src={data.photo} alt={data.name} />
      </div>
      <div className={`${styles.line} ${styles.line_vertical}`}></div>
      <div className={styles.container__info}>
        <h2 className={styles.container__info__title}>{data.name}</h2>
        {data.position && (
          <h3 className={styles.container__info__position}>{data.position}</h3>
        )}
        <div className={styles.line}></div>
        <p className={styles.container__info__text}>{data.description}</p>
        <div className={styles.line}></div>
        {data.contacts.length > 0 ? (
          <div className={styles.container__info__contacts}>
            {data.contacts.map((c, index) => (
              <p
                className={styles.container__info__contacts__contact}
                key={index}
              >
                <span
                  className={styles.container__info__contacts__contact__type}
                >
                  {c.type}
                </span>{" "}
                <span
                  className={styles.container__info__contacts__contact__info}
                >
                  {c.contact}
                </span>
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
