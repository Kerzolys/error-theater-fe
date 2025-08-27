import { useEffect, useState } from "react";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";
import styles from "./form-delete-review.module.scss";
import type { ModalTypes } from "../../../../../utils/types";
import { useReviewForm } from "../../hooks/useReviewForm";
import { ModalPreloader } from "../../../../../shared/modal-preloader/modal-preloader";

type Props = {
  id: string;
  onSuccess?: () => void;
  onFailure?: () => void;
  onClose: () => void;
};

const modalConfig: Partial<Record<ModalTypes, () => React.ReactNode>> = {
  waiting: () => <ModalPreloader />,
};

export const FormDeleteReview = ({
  id,
  onSuccess,
  onFailure,
  onClose,
}: Props) => {
  const { deleteReview, isLoading, reviews } = useReviewForm(id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    try {
      const deletingReview = reviews.find((r) => r.id === id);
      if (!deletingReview) return;

      await deleteReview(id);
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Are you sure?</h2>
      <div className={styles.form__buttons}>
        <ButtonUI type="submit">Delete Review</ButtonUI>
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
