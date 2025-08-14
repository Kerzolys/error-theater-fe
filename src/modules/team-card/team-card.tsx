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
      <div className={styles.container__info}>
        <h2>{data.name}</h2>
        <p>{data.description}</p>
        <div className={styles.container__info__contacts}>
          {data.contacts.length > 0 &&
            data.contacts.map((c) => (
              <span key={c.id}>
                {c.name}: {c.contact}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
