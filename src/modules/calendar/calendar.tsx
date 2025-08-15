import { useState } from "react";
import { ButtonUI } from "../../shared/button-ui/button-ui";
import styles from "./calendar.module.scss";
import classNames from "classnames";
import { useEvents } from "../../services/zustand/store";
import { CalendarEvent } from "../calendar-event/calendar-event";
import { Preloader } from "../../shared/preloader/preloader";

type TabTypes = "upcoming" | "past";

export const Calendar = () => {
  const { events, isLoading } = useEvents();

  const [tabType, setTabType] = useState<TabTypes>("upcoming");

  const sortedUpcomingEvents = events
    .filter((e) => !e.archieved)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events.filter((e) => e.archieved);

  const handleChangeTab = (type: TabTypes) => setTabType(type);

  if (isLoading) return <Preloader />;

  return (
    <div className={styles.container}>
      <div className={styles.container__tabs}>
        <ButtonUI
          type="button"
          className={classNames({
            [styles.container__tabs__tab_active]: tabType === "upcoming",
            [styles.container__tabs__tab]: tabType !== "upcoming",
          })}
          onClick={() => handleChangeTab("upcoming")}
        >
          Upcoming
        </ButtonUI>
        <ButtonUI
          type="button"
          className={classNames({
            [styles.container__tabs__tab_active]: tabType === "past",
            [styles.container__tabs__tab]: tabType !== "past",
          })}
          onClick={() => handleChangeTab("past")}
        >
          Past
        </ButtonUI>
      </div>
      <div className={styles.container__calendar}>
        {tabType === "upcoming"
          ? sortedUpcomingEvents.map((e) => (
              <CalendarEvent data={e} key={e.id} />
            ))
          : pastEvents.map((e) => <CalendarEvent data={e} key={e.id} />)}
      </div>
    </div>
  );
};
