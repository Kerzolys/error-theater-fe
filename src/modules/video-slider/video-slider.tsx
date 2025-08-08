import { useState } from "react";
import styles from "./video-slider.module.scss";
import classNames from "classnames";
import { convertToEmbedUrl } from "../../features/hooks/convertToEmbedUrl";

type Props = {
  data: string[];
};

export const VideoSlider = ({ data }: Props) => {
  const [currentVideo, setCurrentVideo] = useState<number>(0);

  const handleNextSlide = () => {
    if (data.length > 0) {
      setCurrentVideo(currentVideo === data.length - 1 ? 0 : currentVideo + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (data.length > 0) {
      setCurrentVideo(currentVideo === 0 ? data.length - 1 : currentVideo - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.container__arrowBackward}
        onClick={handlePreviousSlide}
      >
        {arrowBackwardIcon}
      </div>
      <div className={styles.container__slider}>
        {data.map((v, index) => (
          <iframe
            key={index}
            className={classNames(styles.container__slider__video, {
              [styles.container__slider__video_active]: currentVideo === index,
            })}
            width="100%"
            height="100%"
            src={convertToEmbedUrl(v)}
            allow="autoplay; fullscreen"
            title="Background Video"
            frameBorder={0}
          />
        ))}
      </div>
      <div className={styles.container__arrowForward} onClick={handleNextSlide}>
        {arrowForwardIcon}
      </div>
    </div>
  );
};

const arrowBackwardIcon = (
  <svg
    viewBox="0 0 1024 1024"
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
        fill="#000000"
      ></path>
    </g>
  </svg>
);

const arrowForwardIcon = (
  <svg
    fill="#000000"
    viewBox="0 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"></path>{" "}
    </g>
  </svg>
);
