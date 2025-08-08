import { useEffect, useState } from "react";
import { useProjects } from "../../../services/zustand/store";
import styles from "./admin-projects.module.scss";
import { LayoutAdmin } from "../../../modules/layout-admin/layout-admin";
import { ProjectCard } from "../../../modules/project-card/project-card";
import { ButtonUI } from "../../../shared/button-ui/button-ui";
import type { ModalTypes } from "../../../utils/types";
import { FormAddProject } from "./components/form-add-project/form-add-project";
import { Modal } from "../../../shared/modal-ui/modal-ui";
import { Preloader } from "../../../shared/preloader/preloader";
import { FormEditProject } from "./components/form-edit-project/form-edit-project";
import { FormDeleteProject } from "./components/form-delete-project/form-delete-project";

const modalConfig: Partial<
  Record<
    ModalTypes,
    (
      id?: string,
      onSuccess?: () => void,
      onFailure?: () => void,
      onClose?: () => void
    ) => React.ReactNode
  >
> = {
  add: (_, onSuccess, onFailure, onClose) => (
    <FormAddProject
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  edit: (id, onSuccess, onFailure, onClose) => (
    <FormEditProject
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  delete: (id, onSuccess, onFailure, onClose) => (
    <FormDeleteProject
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  editConfirmation: () => <h2>Your Project has been successfully edited!</h2>,
  addConfirmation: () => <h2>Your Project has been successfully added!</h2>,
  deleteConfirmation: () => (
    <h2>Your Project has been successfully deleted!</h2>
  ),

  error: () => <h2>Something went wrong... Please try again later!</h2>,
};

export const AdminProjects = () => {
  const { projects, isLoading, fetchProjects } = useProjects();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const handleOpenModal = (type: ModalTypes, projectId?: string) => {
    setModalType(type);
    setSelectedProjectId(projectId ?? null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalType(null);
    setSelectedProjectId(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <LayoutAdmin>
      {!isLoading ? (
        <div className={styles.container}>
          <h2 className={styles.container__title}>Error Theater Projects</h2>
          <div className={styles.container__control}>
            <ButtonUI
              type="button"
              onClick={() => handleOpenModal("add")}
              className={styles.container__addButton}
            >
              Add new
            </ButtonUI>
          </div>
          <div className={styles.container__projects}>
            {projects.length > 0 ? (
              projects.map((p) => (
                <div className={styles.container__projects__project} key={p.id}>
                  <ProjectCard data={p} />
                  <div className={styles.container__projects__project__buttons}>
                    <ButtonUI
                      type="button"
                      onClick={() => handleOpenModal("edit", p.id)}
                    >
                      Edit Project
                    </ButtonUI>
                    <ButtonUI
                      type="button"
                      onClick={() => handleOpenModal("delete", p.id)}
                    >
                      Delete Project
                    </ButtonUI>
                  </div>
                </div>
              ))
            ) : (
              <h3>There are no projects yet. Its time to fill it!</h3>
            )}
          </div>
        </div>
      ) : (
        <Preloader />
      )}

      <Modal onClose={handleCloseModal} isOpen={isOpen}>
        {modalType
          ? modalConfig[modalType]?.(
              selectedProjectId || undefined,
              () => {
                handleCloseModal();
                handleOpenModal(
                  modalType === "add"
                    ? "addConfirmation"
                    : modalType === "edit"
                    ? "editConfirmation"
                    : "deleteConfirmation"
                );
              },
              () => handleOpenModal("error"), handleCloseModal
            )
          : null}
      </Modal>
    </LayoutAdmin>
  );
};
