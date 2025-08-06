import { useState } from "react";
import type { TImage } from "../../utils/types";
import styles from "./image-slider.module.scss";

type Props = {
  data: TImage[];
};

export const ImageSlider = ({ data }: Props) => {
  const [currentImage, setCurrentImage] = useState<number>(0);

  const handleNextSlide = () => {
    if (data.length > 0) {
      setCurrentImage(currentImage === data.length - 1 ? 0 : currentImage + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (data.length > 0) {
      setCurrentImage(currentImage === 0 ? data.length - 1 : currentImage - 1);
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
      {data.map((i) => (
        <img src={i.link} alt={i.title ?? ""} key={i.id} />
      ))}
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
