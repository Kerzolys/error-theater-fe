import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { InputUI } from "../../../../../shared/input-ui/input-ui";
import { useProjectForm } from "../../hooks/useProjectForm";
import styles from "./form-add-project.module.scss";

export const FormAddProject = () => {
  const { values, setValues, errors, setErrors, isLoading, addProject } =
    useProjectForm();

  const hasMainImage =
    values.mainImage_link.trim() !== "" || values.mainImage_file !== null;

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
          ? files?.[0] ?? null
          : files
          ? Array.from(files)
          : [],
    }));
  };

  return (
    <form>
      <InputUI
        title="Name of the Project"
        isError={errors.name || !values.name}
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
        isError={errors.description || !values.description}
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
        isError={hasMainImage || !values.mainImage_file}
        errorText="Please upload a photo"
      >
        <input type="file" onChange={handleFileChange} name="mainImage" />
      </InputUI>
      <ButtonUI
        onClick={() => {}}
        type="button"
        disabled={values.mainImage_file !== null}
      >
        Choose photo
      </ButtonUI>
      <InputUI title="Gallery Images">
        <input type="file" onChange={handleFileChange} name="images" multiple />
      </InputUI>
      <ButtonUI
        onClick={() => {}}
        type="button"
        disabled={values.images_files.length > 0}
      >
        Choose photos
      </ButtonUI>
      <InputUI title="Gallery Videos (use coma)">
        <input
          type="text"
          name="videos"
          value={values.videos}
          onChange={handleChange}
        />
      </InputUI>
    </form>
  );
};
