import { useEffect, useMemo, useState } from "react";
import {type TProjectErrors, type TProjectForm } from "../types";
import { useProjects } from "../../../../services/zustand/store";

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
    mainImage_file: null,
    mainImage_link: "",
    images_link: [],
    images_files: [],
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
      setValues({
        name: projectToEdit.name || "",
        description: projectToEdit.description || "",
        mainImage_link: projectToEdit.mainImage || "",
        mainImage_file: null,
        images_files: [],
        images_link: projectToEdit.images || [],
        videos: projectToEdit.videos || [],
      });
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
