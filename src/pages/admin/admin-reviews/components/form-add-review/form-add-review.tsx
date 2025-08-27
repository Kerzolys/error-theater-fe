import { useEffect, useState } from "react";
import type { ModalTypes, TReview } from "../../../../../utils/types";
import type { TReviewFormError } from "../../types";
import { useReviewForm } from "../../hooks/useReviewForm";
import { ModalPreloader } from "../../../../../shared/modal-preloader/modal-preloader";

import styles from "./form-add-review.module.scss";
import { InputUI } from "../../../../../shared/input-ui/input-ui";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";

type Props = {
  onSuccess?: () => void;
  onFailure?: () => void;
  onClose: () => void;
};

const modalConfig: Partial<Record<ModalTypes, () => React.ReactNode>> = {
  waiting: () => <ModalPreloader />,
};

export const FormAddReview = ({ onSuccess, onFailure, onClose }: Props) => {
  const { values, setValues, errors, setErrors, isLoading, addReview } =
    useReviewForm();

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
  };

  const handleReset = () =>
    setValues({
      text: "",
      source: "",
    });

  const handelSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const newErrors: TReviewFormError = {
      text: values.text.trim() === "",
      source: values.source.trim() === "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) return;

    try {
      const newReview: TReview = {
        text: values.text,
        source: values.source,
      };

      await addReview(newReview);

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
    <form onSubmit={handelSubmit} className={styles.form}>
      <InputUI title="Text of the review" isError={errors.text && !values.text}>
        <textarea name="text" value={values.text} onChange={handleChange} />
      </InputUI>
      <InputUI
        title="Source of the review"
        isError={errors.source && !values.source}
      >
        <input
          type="text"
          name="source"
          value={values.source}
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
