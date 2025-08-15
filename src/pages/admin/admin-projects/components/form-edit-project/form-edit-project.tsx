import { useEffect, useState } from "react";
import { deleteFromYandex } from "../../../../../services/api/deleteFromYandex";
import { uploadToYandex } from "../../../../../services/api/uploadToYandex";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { InputFileUI } from "../../../../../shared/input-file-ui/input-file-ui";
import { InputUI } from "../../../../../shared/input-ui/input-ui";
import type { ModalTypes, TProject } from "../../../../../utils/types";
import { useProjectForm } from "../../hooks/useProjectForm";
import styles from "./form-edit-project.module.scss";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";
import { convertNameToYandex } from "../../../../../features/hooks/convertNameToYandex";
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

export const FormEditProject = ({
  id,
  onSuccess,
  onFailure,
  onClose,
}: Props) => {
  const {
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    editProject,
    projects,
  } = useProjectForm(id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;

    setValues((prev) => ({
      ...prev,
      [name]:
        name === "videos" ? value.split(",").map((item) => item.trim()) : value,
    }));
  };

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = evt.target;

    setValues((prev) => ({
      ...prev,
      [name]:
        name === "mainImage"
          ? files?.[0] || null
          : files
          ? [...prev.images, ...Array.from(files)]
          : prev.images,
    }));
  };

  const handleDeleteFile = (file: File, values: "mainImage" | "images") => {
    setValues((prev) => ({
      ...prev,
      [values]:
        values === "images"
          ? (prev[values] || []).filter((f: File) => f.name !== file.name)
          : null,
    }));
  };

  const handleResetForm = () => {
    setValues({
      name: "",
      description: "",
      mainImage: null,
      images: [],
      videos: [],
    });
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const newErrors = {
      name: values.name.trim() === "",
      description: values.description.trim() === "",
      mainImage: !values.mainImage,
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);

    if (hasErrors) return;

    try {
      const initialProject = projects.find((p) => p.id === id);
      
      if (!values.mainImage || values.images.length === 0) return;
      if (!initialProject) return;

      const mainImageChanged =
        values.mainImage?.name !== initialProject?.mainImage;
      const imagesChanged =
        values.images.some(
          (file, i) => file.name !== initialProject?.images[i]
        ) || values.images.length !== initialProject?.images.length;
      let newMainImageLink = initialProject?.mainImage;
      if (mainImageChanged) {
        setIsLoading(true);
        await deleteFromYandex(initialProject?.mainImage!);
        newMainImageLink = await uploadToYandex(
          `project_${convertNameToYandex(values.name)}`,
          values.mainImage
        );
        setIsLoading(false);
      }
      let newImagesLinks = initialProject?.images;
      if (imagesChanged) {
        setIsLoading(true);
        await Promise.all(
          initialProject.images.map((i) => deleteFromYandex(i))
        );
        newImagesLinks = await Promise.all(
          values.images.map((i) =>
            uploadToYandex(
              `project_${convertNameToYandex(values.name)}_images`,
              i
            )
          )
        );
        setIsLoading(false);
      }

      const updatedProject: TProject = {
        id,
        name: values.name,
        description: values.description,
        mainImage: newMainImageLink,
        images: newImagesLinks,
        videos: values.videos,
      };

      await editProject(updatedProject);
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputUI
        title="Name of the Project"
        isError={errors.name && !values.name}
        errorText="Field is required"
      >
        <input
          type="text"
          value={values.name}
          name="name"
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Description of the Project"
        isError={errors.description && !values.description}
        errorText="Field is required"
      >
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
        ></textarea>
      </InputUI>
      <InputUI
        title="Main Image"
        isError={errors.mainImage && !values.mainImage}
        errorText="Please upload a photo"
      >
        <InputFileUI name="mainImage" onChange={handleFileChange} />
      </InputUI>
      {values.mainImage && (
        <div className={styles.filesBlock}>
          <div className={styles.filesBlock__file}>
            <div
              className={styles.filesBlock__file__deleteButton}
              onClick={() => {
                if (values.mainImage)
                  handleDeleteFile(values.mainImage, "mainImage");
              }}
            >
              {deleteFileIcon}
            </div>
            <img src={URL.createObjectURL(values.mainImage)} alt="" />
            <span>{values.mainImage.name}</span>
          </div>
        </div>
      )}

      <InputUI title="Gallery Images">
        <InputFileUI name="images" onChange={handleFileChange} multiple />
      </InputUI>
      {values.images && (
        <div className={styles.filesBlock}>
          {values.images.map((f, i) => (
            <div className={styles.filesBlock__file} key={i}>
              <div
                className={styles.filesBlock__file__deleteButton}
                onClick={() => handleDeleteFile(f, "images")}
              >
                {deleteFileIcon}
              </div>
              <img src={URL.createObjectURL(f)} alt="" />

              <span>{f.name}</span>
            </div>
          ))}
        </div>
      )}
      <InputUI title="Gallery Videos (use comma)">
        <input
          type="text"
          name="videos"
          value={values.videos}
          onChange={handleChange}
        />
      </InputUI>
      <ButtonUI type="submit">Save</ButtonUI>
      <ButtonUI type="button" onClick={handleResetForm}>
        Reset
      </ButtonUI>
      <ButtonUI type="button" onClick={onClose}>
        Cancel
      </ButtonUI>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        {modalType && modalConfig[modalType]?.()}
      </Modal>
    </form>
  );
};

const deleteFileIcon = (
  <svg
    fill="#000000"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g>
        {" "}
        <g>
          {" "}
          <path d="M437.018,74.987c-99.968-99.977-262.067-99.977-362.035,0c-99.977,99.959-99.977,262.059,0,362.027 c99.968,99.977,262.067,99.977,362.035,0C536.994,337.054,536.994,174.955,437.018,74.987z M418.918,418.914 c-89.984,89.967-235.853,89.967-325.837,0c-89.967-89.975-89.967-235.844,0-325.828c89.984-89.967,235.853-89.967,325.837,0 C508.885,183.07,508.885,328.939,418.918,418.914z"></path>{" "}
        </g>{" "}
      </g>{" "}
      <g>
        {" "}
        <g>
          {" "}
          <path d="M274.099,256.004l81.459-81.459c5.001-4.992,5.001-13.107,0-18.099c-4.992-5-13.107-5-18.099,0L256,237.905 l-81.459-81.459c-4.992-5.009-13.107-5.009-18.099,0c-5,4.992-5,13.107,0,18.099l81.459,81.459l-81.459,81.459 c-5,4.992-5,13.107,0,18.099c4.992,5.001,13.107,5.001,18.099,0L256,274.103l81.459,81.459c4.992,5,13.107,5,18.099,0 c5.001-4.992,5.001-13.107,0-18.099L274.099,256.004z"></path>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);
