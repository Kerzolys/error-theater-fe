import { useEffect, useState } from "react";
import type { ModalTypes, TEvent } from "../../../../../utils/types";
import { InputUI } from "../../../../../shared/input-ui/input-ui";
import { InputFileUI } from "../../../../../shared/input-file-ui/input-file-ui";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";
import { uploadToYandex } from "../../../../../services/api/uploadToYandex";
import { convertNameToYandex } from "../../../../../features/hooks/convertNameToYandex";
import { useEventForm } from "../../hooks/useEventForm";
import type { TEventFormErrors } from "../../types";

import styles from "./form-add-event.module.scss";
import { ModalPreloader } from "../../../../../shared/modal-preloader/modal-preloader";

type Props = {
  onSuccess?: () => void;
  onFailure?: () => void;
  onClose: () => void;
};
const modalConfig: Partial<Record<ModalTypes, () => React.ReactNode>> = {
  waiting: () => <ModalPreloader />,
};

export const FormAddEvent = ({ onSuccess, onFailure, onClose }: Props) => {
  const {
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    addEvent,
  } = useEventForm();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "date") {
      setErrors((prev) => ({
        ...prev,
        date: value !== "" && !isDateValid(value),
      }));
    }

    if (name === "time") {
      setErrors((prev) => ({
        ...prev,
        time: value !== "" && !isTimeValid(value),
      }));
    }
  };

  const isDateValid = (date: string) => {
    const pattern =
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/;
    return pattern.test(date);
  };

  const isTimeValid = (time: string) => {
    const pattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    return pattern.test(time);
  };

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = evt.target;

    if (!files) return;

    setValues((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleDeleteFile = () =>
    setValues((prev) => ({ ...prev, photo: null }));

  const handleReset = () =>
    setValues({
      date: "",
      time: "",
      location: "",
      name: "",
      description: "",
      image: null,
      link: "",
    });

  const handelSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const newErrors: TEventFormErrors = {
      date: values.date.trim() === "" || !isDateValid(values.date),
      time: values.time.trim() === "" || !isTimeValid(values.time),
      location: values.location.trim() === "",
      name: values.name.trim() === "",
      description: values.description.trim() === "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) return;

    let imageLink: string | undefined;

    try {
      // if (!values.image) return;

      if (values.image) {
        setIsLoading(true);
        imageLink = await uploadToYandex(
          `events_${convertNameToYandex(values.name)}`,
          values.image
        );
        setIsLoading(false);
      }

      const newEvent: TEvent = {
        date: values.date,
        time: values.time,
        location: values.location,
        name: values.name,
        description: values.description,
        image: imageLink || "",
        link: values.link || "",
        archieved: false,
      };

      await addEvent(newEvent);

      onSuccess?.();
    } catch (err) {
      console.log(err);
      onFailure?.();
    }
  };

  const handleOpenModal = (type: ModalTypes) => {
    setModalType(type);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalType(null);
  };

  useEffect(() => {
    if (isLoading) {
      handleOpenModal("waiting");
    }
    return () => handleCloseModal();
  }, [isLoading]);

  return (
    <form className={styles.form} onSubmit={handelSubmit}>
      <InputUI
        title="Date"
        isError={(errors.date && values.date === "") || errors.date}
        errorText={
          values.date === ""
            ? "Field is required!"
            : "Invalid date format (e.g., Aug 16, 2025)"
        }
      >
        <input
          type="text"
          name="date"
          value={values.date}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Time"
        isError={(errors.time && values.time === "") || errors.time}
        errorText={
          values.time === ""
            ? "Field is required!"
            : "Invalid time format (HH:MM)"
        }
      >
        <input
          type="text"
          name="time"
          value={values.time}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Location"
        isError={errors.location && values.location === ""}
        errorText="Field is required!"
      >
        <input
          type="text"
          value={values.location}
          name="location"
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Name of event"
        isError={errors.name && !values.name}
        errorText="Field is required!"
      >
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Description of event"
        isError={errors.description && !values.description}
        errorText="Field is required!"
      >
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI title="Image of event">
        <InputFileUI name="image" onChange={handleFileChange} />
      </InputUI>
      {values.image && (
        <div className={styles.filesBlock}>
          <div className={styles.filesBlock__file}>
            <div
              className={styles.filesBlock__file__deleteButton}
              onClick={() => {
                if (values.image) handleDeleteFile();
              }}
            >
              {deleteIcon}
            </div>
            <img
              src={URL.createObjectURL(values.image)}
              alt={values.image.name}
            />
            <span>{values.image.name}</span>
          </div>
        </div>
      )}
      <InputUI title="Link of event">
        <input
          type="text"
          name="link"
          value={values.link}
          onChange={handleChange}
        />
      </InputUI>

      <div className={styles.form__buttons}>
        <ButtonUI type="submit">Save</ButtonUI>
        <ButtonUI type="button" onClick={handleReset}>
          Reset
        </ButtonUI>
        <ButtonUI type="button" onClick={onClose}>
          Cancel
        </ButtonUI>
      </div>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        {modalType && modalConfig[modalType]?.()}
      </Modal>
    </form>
  );
};

const deleteIcon = (
  <svg
    fill="#000000"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g>
        {" "}
        <g>
          {" "}
          <path d="M437.018,74.987c-99.968-99.977-262.067-99.977-362.035,0c-99.977,99.959-99.977,262.059,0,362.027 c99.968,99.977,262.067,99.977,362.035,0C536.994,337.054,536.994,174.955,437.018,74.987z M418.918,418.914 c-89.984,89.967-235.853,89.967-325.837,0c-89.967-89.975-89.967-235.844,0-325.828c89.984-89.967,235.853-89.967,325.837,0 C508.885,183.07,508.885,328.939,418.918,418.914z"></path>{" "}
        </g>{" "}
      </g>{" "}
      <g>
        {" "}
        <g>
          {" "}
          <path d="M274.099,256.004l81.459-81.459c5.001-4.992,5.001-13.107,0-18.099c-4.992-5-13.107-5-18.099,0L256,237.905 l-81.459-81.459c-4.992-5.009-13.107-5.009-18.099,0c-5,4.992-5,13.107,0,18.099l81.459,81.459l-81.459,81.459 c-5,4.992-5,13.107,0,18.099c4.992,5.001,13.107,5.001,18.099,0L256,274.103l81.459,81.459c4.992,5,13.107,5,18.099,0 c5.001-4.992,5.001-13.107,0-18.099L274.099,256.004z"></path>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);
