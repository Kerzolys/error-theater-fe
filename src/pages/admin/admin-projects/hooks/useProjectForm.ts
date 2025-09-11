import { useEffect, useMemo, useState } from "react";
import { type TProjectErrors, type TProjectForm } from "../types";
import { useProjects } from "../../../../services/zustand/store";
import { urlToFile } from "../../../../features/hooks/urlToFile";
import { exportFileName } from "../../../../features/hooks/exportFileName";

export const useProjectForm = (projectId?: string) => {
  const {
    projects,
    isLoading,
    setIsLoading,
    addProject,
    deleteProject,
    editProject,
  } = useProjects();

  const [values, setValues] = useState<TProjectForm>({
    name: "",
    description: "",
    mainImage: null,
    images: [],
    videos: [],
    data: "",
  });

  const [errors, setErrors] = useState<TProjectErrors>({
    name: false,
    description: false,
    mainImage: false,
  });

  const projectToEdit = useMemo(() => {
    return projectId ? projects.find((p) => p.id === projectId) : null;
  }, [projectId, projects]);

  useEffect(() => {
    if (projectToEdit) {
      const convertImages = async () => {
        const imagesFiles = await Promise.all(
          (projectToEdit.images || []).map((url) =>
            urlToFile(url, exportFileName(url))
          )
        );

        const mainImageFile = await urlToFile(
          projectToEdit.mainImage,
          exportFileName(projectToEdit.mainImage)
        );

        setValues({
          name: projectToEdit.name || "",
          description: projectToEdit.description || "",
          mainImage: mainImageFile,
          images: imagesFiles,
          videos: projectToEdit.videos || [],
          data: projectToEdit.data || "",
        });
      };

      void convertImages();
    }
  }, [projectToEdit]);

  return {
    projects,
    values,
    setValues,
    isLoading,
    setIsLoading,
    errors,
    setErrors,
    addProject,
    editProject,
    deleteProject,
  };
};
