import { useEffect, useState, type ReactElement } from "react";
import { useProjects } from "../../../services/zustand/store";
import styles from "./admin-projects.module.scss";
import { LayoutAdmin } from "../../../modules/layout-admin/layout-admin";
import { ProjectCard } from "../../../modules/project-card/project-card";
import { ButtonUI } from "../../../shared/button-ui/button-ui";
import type { ModalConfig, ModalTypes } from "../../../utils/types";
import { FormAddProject } from "./components/form-add-project/form-add-project";
import { Modal } from "../../../shared/modal-ui/modal-ui";

const modalConfig: Record<ModalTypes, ModalConfig> = {
  add: { content: <FormAddProject /> },
  edit: {},
  delete: {},
};

export const AdminProjects = () => {
  const {
    projects,
    isLoading,
    addProject,
    deleteProject,
    editProject,
    fetchProjects,
  } = useProjects();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleOpenModal = (type: ModalTypes) => {
    setModalType(type);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalType(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <LayoutAdmin>
      <div className={styles.container}>
        <h2>Error Theater Projects</h2>
        <div className={styles.container__control}>
          <ButtonUI type="button" onClick={() => handleOpenModal("add")}>
            Add
          </ButtonUI>
        </div>
        <div className={styles.container__projects}>
          {projects.length > 0 ? (
            projects.map((p) => <ProjectCard data={p} />)
          ) : (
            <h3>There are no projects yet. Its time to fill it!</h3>
          )}
        </div>
      </div>

      <Modal onClose={handleCloseModal} isOpen={isOpen}>
        {modalConfig.add.content}
      </Modal>
    </LayoutAdmin>
  );
};
