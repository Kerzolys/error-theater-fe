import { useEffect, useState } from "react";
import { deleteFromYandex } from "../../../../../services/api/deleteFromYandex";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import type { ModalTypes } from "../../../../../utils/types";

import styles from "./form-delete-member.module.scss";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";
import { useEventForm } from "../../hooks/useEventForm";
import { Preloader } from "../../../../../shared/preloader/preloader";

type Props = {
  id: string;
  onSuccess?: () => void;
  onFailure?: () => void;
  onClose: () => void;
};

const modalConfig: Partial<Record<ModalTypes, () => React.ReactNode>> = {
  waiting: () => (
    <>
      <h2>Please wait...</h2>
      <Preloader />
    </>
  ),
};

export const FormDeleteEvent = ({
  id,
  onSuccess,
  onFailure,
  onClose,
}: Props) => {
  const { deleteEvent, isLoading, setIsLoading, events } = useEventForm(id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    try {
      const deleteingMember = events.find((e) => e.id === id);

      if (!deleteingMember?.image) return;

      if (deleteingMember.image) {
        setIsLoading(true);
        await deleteFromYandex(deleteingMember.image);
        setIsLoading(false);
      }

      await deleteEvent(id);
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
        <ButtonUI type="submit">Delete Event</ButtonUI>
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
