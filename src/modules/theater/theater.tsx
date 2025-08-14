import { useEffect } from "react";
import { useMembers } from "../../services/zustand/store";
import styles from "./theater.module.scss";
import { TeamCard } from "../team-card/team-card";
import { Preloader } from "../../shared/preloader/preloader";

export const Theater = () => {
  const { members, fetchMembers, isLoading } = useMembers();

  useEffect(() => {
    fetchMembers();
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <div className={styles.container}>
      <h2>Error Theater Team</h2>
      <div className={styles.container__team}>
        {members.map((m) => (
          <TeamCard data={m} />
        ))}
      </div>
    </div>
  );
};
