import { useEffect, useMemo, useState } from "react";
import { type TProjectErrors, type TProjectForm } from "../types";
import { useProjects } from "../../../../services/zustand/store";

const urlToFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const mime = blob.type || "image/jpeg";
  return new File([blob], filename, { type: mime });
};

export const useProjectForm = (projectId?: string) => {
  const {
    fetchProjects,
    projects,
    isLoading,
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
        const exportFileName = (url: string) => {
          const urlArr = url.split("/");
          return urlArr[urlArr.length - 1];
        };
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
        });
      };

      void convertImages();
    }
  }, [projectToEdit]);

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    values,
    setValues,
    isLoading,
    errors,
    setErrors,
    addProject,
    editProject,
    deleteProject,
  };
};
