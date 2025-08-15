import { useState } from "react";
import { ButtonUI } from "../../shared/button-ui/button-ui";
import styles from "./calendar.module.scss";
import classNames from "classnames";
import { useEvents } from "../../services/zustand/store";
import { CalendarEvent } from "../calendar-event/calendar-event";

type TabTypes = "upcoming" | "past";

export const Calendar = () => {
  const { events, isLoading } = useEvents();

  const [tabType, setTabType] = useState<TabTypes>("upcoming");
  return (
    <div className={styles.container}>
      <div className={styles.container__tabs}>
        <ButtonUI
          type="button"
          className={classNames({
            [styles.container__tabs__tab_active]: tabType === "upcoming",
            [styles.container__tabs__tab]: tabType !== "upcoming",
          })}
        >
          Upcoming
        </ButtonUI>
        <ButtonUI
          type="button"
          className={classNames({
            [styles.container__tabs__tab_active]: tabType === "past",
            [styles.container__tabs__tab]: tabType !== "past",
          })}
        >
          Past
        </ButtonUI>
      </div>
      <div className={styles.container__calendar}>
        {events.map((e) => (
          <CalendarEvent data={e} key={e.id} />
        ))}
      </div>
    </div>
  );
};
