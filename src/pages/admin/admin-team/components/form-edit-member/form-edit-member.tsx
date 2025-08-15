import { useEffect, useState } from "react";
import type { ModalTypes, TContact, TMember } from "../../../../../utils/types";
import { useMembersForm } from "../../hooks/useMemberForm";
import styles from "./form-edit-member.module.scss";
import type { TMemberFormErrors } from "../../types";
import { InputUI } from "../../../../../shared/input-ui/input-ui";
import { InputFileUI } from "../../../../../shared/input-file-ui/input-file-ui";
import { ButtonUI } from "../../../../../shared/button-ui/button-ui";
import { Modal } from "../../../../../shared/modal-ui/modal-ui";
import { deleteFromYandex } from "../../../../../services/api/deleteFromYandex";
import { uploadToYandex } from "../../../../../services/api/uploadToYandex";
import { convertNameToYandex } from "../../../../../features/hooks/convertNameToYandex";
import { Preloader } from "../../../../../shared/preloader/preloader";

type Props = {
  id: string;
  onSuccess?: () => void;
  onFailure?: () => void;
  onClose: () => void;
};
const modalConfig: Partial<Record<ModalTypes, () => React.ReactNode>> = {
  waiting: () =>  <>
        <h2>Please wait...</h2>
        <Preloader />
      </>,
};

export const FormEditMember = ({
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
    editMember,
    members,
  } = useMembersForm(id);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (
    index: number,
    field: keyof TContact,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = evt.target;

    if (!files) return;

    setValues((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleDeleteFile = () =>
    setValues((prev) => ({ ...prev, photo: null }));

  const handleAddContact = () =>
    setValues((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { type: "", contact: "" }],
    }));

  const handleDeleteContact = (index: number) =>
    setValues((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));

  const handleReset = () =>
    setValues({
      name: "",
      position: "",
      description: "",
      photo: null,
      contacts: [],
    });

  const handelSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const newErrors: TMemberFormErrors = {
      name: values.name.trim() === "",
      description: values.description.trim() === "",
      photo: !values.photo,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) return;

    try {
      const initialMember = members.find((m) => id === m.id);
      if (!initialMember) return;
      if (!values.photo) return;

      const photoChanged = initialMember.photo !== values.photo?.name;
      let newPhotoLink = initialMember.photo;
      if (photoChanged) {
        setIsLoading(true);
        await deleteFromYandex(initialMember.photo);
        newPhotoLink = await uploadToYandex(
          `team_members_${convertNameToYandex(values.name)}`,
          values.photo
        );
        setIsLoading(false);
      }

      const updatedMember: TMember = {
        id,
        name: values.name,
        position: values.position,
        description: values.description,
        photo: newPhotoLink,
        contacts: values.contacts,
      };

      await editMember(updatedMember);

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
    <form className={styles.form} onSubmit={handelSubmit}>
      <InputUI
        title="Name of member"
        isError={errors.name && values.name === ""}
        errorText="Field is required!"
      >
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI title="Position of member">
        <input
          type="text"
          name="position"
          value={values.position}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Short bio"
        isError={errors.description && values.description === ""}
        errorText="Field is required!"
      >
        <textarea
          value={values.description}
          name="description"
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Photo of member"
        isError={errors.photo && !values.photo}
        errorText="Field is required!"
      >
        <InputFileUI name="photo" onChange={handleFileChange} />
      </InputUI>
      {values.photo && (
        <div className={styles.filesBlock}>
          <div className={styles.filesBlock__file}>
            <div
              className={styles.filesBlock__file__deleteButton}
              onClick={() => {
                if (values.photo) handleDeleteFile();
              }}
            >
              {deleteIcon}
            </div>
            <img src={URL.createObjectURL(values.photo)} alt="" />
            <span>{values.photo.name}</span>
          </div>
        </div>
      )}
      <div className={styles.form__contacts}>
        {values.contacts.map((c, index) => (
          <div className={styles.form__contacts__input}>
            <InputUI title="Platform / Service">
              <input
                type="text"
                value={c.type}
                onChange={(e) =>
                  handleContactChange(index, "type", e.target.value)
                }
              />
            </InputUI>
            <InputUI title="Contact Information">
              <input
                type="text"
                value={c.contact}
                onChange={(e) =>
                  handleContactChange(index, "contact", e.target.value)
                }
              />
            </InputUI>
            <div
              onClick={() => handleDeleteContact(index)}
              className={styles.form__deleteContactButton}
            >
              {deleteIcon}
            </div>
          </div>
        ))}
        <div
          onClick={handleAddContact}
          className={styles.form__addContactButton}
        >
          {addIcon}
        </div>
      </div>
      <div className={styles.form__buttons}>
        <ButtonUI type="submit">Save</ButtonUI>
        <ButtonUI type="button" onClick={handleReset}>
          Reset
        </ButtonUI>
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

const addIcon = (
  <svg
    fill="#000000"
    viewBox="0 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path>{" "}
    </g>
  </svg>
);

const deleteIcon = (
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
