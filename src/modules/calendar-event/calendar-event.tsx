import { useState } from "react";
import type { TEvent } from "../../utils/types";
import styles from "./calendar-event.module.scss";
import { Modal } from "../../shared/modal-ui/modal-ui";

type Props = {
  data: TEvent;
};

export const CalendarEvent = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <div className={styles.container} onClick={handleOpenModal}>
      <div className={styles.container__info}>
        <div className={styles.container__info__time}>
          <h2>{data.time}</h2>
          <h2>{data.date}</h2>
        </div>
        <div className={styles.line_vertical}></div>
        <h2>{data.location}</h2>
      </div>
      <div className={styles.line}></div>
      <p className={styles.container__description}>{data.description}</p>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <div className={styles.modal__event}>
          {data.image && (
            <div className={styles.modal__event__img}>
              <img src={data.image} alt="" />
            </div>
          )}
          <div className={styles.modal__event__info}>
            <h2 className={styles.modal__event__info__title}>{data.name}</h2>
            <div className={styles.line}></div>
            <div className={styles.modal__event__info__time}>
              <h3>{data.date}</h3>
              <h3>{data.time}</h3>
            </div>
            <h3>{data.location}</h3>
            <p className={styles.modal__event__info__text}>
              {data.description}
            </p>
            {data.link && <a href={data.link}>More</a>}
            <div className={styles.line}></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
