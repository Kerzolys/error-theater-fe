import type React from "react";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { useProjectForm } from "../../hooks/useProjectForm";
import styles from "./form-delete-project.module.scss";
import { deleteFromYandex } from "../../../../../services/api/deleteFromYandex";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";
import type { ModalTypes } from "../../../../../utils/types";
import { useEffect, useState } from "react";
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

export const FormDeleteProject = ({
  id,
  onSuccess,
  onFailure,
  onClose,
}: Props) => {
  const { projects, deleteProject,isLoading, setIsLoading } = useProjectForm();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    try {
      const deleteingProject = projects.find((p) => p.id === id);

      if (!deleteingProject?.mainImage || deleteingProject?.images.length === 0)
        return;

      if (deleteingProject.mainImage) {
        setIsLoading(true);
        await deleteFromYandex(deleteingProject?.mainImage);
        setIsLoading(false);
      }

      if (deleteingProject.images.length > 0) {
        setIsLoading(true);
        await Promise.all(
          deleteingProject.images.map((i) => deleteFromYandex(i))
        );
        setIsLoading(false);
      }

      await deleteProject(id);
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
        <ButtonUI type="submit">Delete Project</ButtonUI>
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
