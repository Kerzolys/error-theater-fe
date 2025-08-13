import type React from "react";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { useProjectForm } from "../../hooks/useProjectForm";
import styles from "./form-delete-project.module.scss";
import { deleteFromYandex } from "../../../../../services/api/deleteFromYandex";

type Props = {
  id: string;
  onSuccess?: () => void;
  onFailure?: () => void;
  onClose: () => void;
};

export const FormDeleteProject = ({
  id,
  onSuccess,
  onFailure,
  onClose,
}: Props) => {
  const { projects, deleteProject, setIsLoading } = useProjectForm();

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
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Are you sure?</h2>
      <div className={styles.form__buttons}>
        <ButtonUI type="submit">Delete Project</ButtonUI>
        <ButtonUI type="button" onClick={onClose}>
          Cancel
        </ButtonUI>
      </div>
    </form>
  );
};
