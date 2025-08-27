import { useEffect, useRef, useState } from "react";
import { useReviews } from "../../services/zustand/store";
import descriptionImg from "./assets/homeDescriptionImage.jpeg";
import styles from "./home-description.module.scss";
import { Review } from "../review/review";
import classNames from "classnames";

export const HomeDescription = () => {
  const { reviews, fetchReviews } = useReviews();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const reviewsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (reviewsRef.current) {
      observer.observe(reviewsRef.current);
    }
  }, []);

  return (
    <div id="info" className={styles.container}>
      <div className={styles.container__infoBlock}>
        <div className={styles.container__info}>
          <div className={styles.line}></div>
          <p>
            Errortheater is a music theater company for provoked
            misunderstandings. The dramaturgy of our pieces allows a working
            method that does not exclude change, adaptation, and development,
            but rather makes them into a staging and compositional principle.
            Errortheater modulates given situations and sets (mis-)lights to
            irresponsibly guide the gaze.
          </p>
          <p>
            {" "}
            Our goal is, under the sign of music, to create sensitivities for
            processes, actions, and sounds that would otherwise fall outside the
            grid of categories and attention. We compose everything — things,
            situations, etc. Text is musical material, just as much as sound or
            spotlight: everything is used, shaped according to the laws of music
            without concepts.
          </p>
          <p>
            {" "}
            Founded in 2016 by composer Alexander Chernyshkov and since 2020
            collaborating with Philipp Lossau, Errortheater has already nestled
            itself through numerous productions and destructions at festivals
            such as the Biennale di Venezia, Steirischer Herbst,
            Musiktheatertage Wien, and at venues such as the Radiokulturhaus
            Wien and Elektroteatr Stanislavsky Moscow.
          </p>
          <p>
            {" "}
            Recurring performers work in ever new and expanded constellations on
            productive and failure-prone encounters.
          </p>
          <div className={styles.line}></div>
        </div>
        <div className={styles.container__image}>
          <img src={descriptionImg} alt="Error Theater Image" />
        </div>
      </div>
      <div className={classNames(styles.container__reviewsBlock, {[styles.container__reviewsBlock_visible]: isVisible})} ref={reviewsRef}>
        {reviews.length > 0 &&
          reviews.map((r) => <Review data={r} key={r.id} />)}
      </div>
    </div>
  );
};
