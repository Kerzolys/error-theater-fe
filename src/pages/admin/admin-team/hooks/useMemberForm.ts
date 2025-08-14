import { useEffect, useMemo, useState } from "react";
import { useMembers } from "../../../../services/zustand/store";
import { type TMemberFormErrors, type TMemberForm } from "../types";
import { urlToFile } from "../../../../features/hooks/urlToFile";
import { exportFileName } from "../../../../features/hooks/exportFileName";

export const useMembersForm = (memberId?: string) => {
  const {
    members,
    isLoading,
    setIsLoading,
    addMember,
    editMember,
    deleteMember,
  } = useMembers();

  const [values, setValues] = useState<TMemberForm>({
    name: "",
    description: "",
    contacts: [
      {
        type: "",
        contact: "",
      },
    ],
    photo: null,
  });
  const [errors, setErrors] = useState<TMemberFormErrors>({
    name: false,
    description: false,
    photo: false,
  });

  const memberToEdit = useMemo(() => {
    return memberId ? members.find((p) => p.id === memberId) : null;
  }, [memberId, members]);

  console.log(memberToEdit)
  console.log('values', values)

  useEffect(() => {
    if (memberToEdit) {
      const convertImage = async () => {
        const photoFile = await urlToFile(
          memberToEdit.photo,
          exportFileName(memberToEdit.photo)
        );

        setValues({
          name: memberToEdit.name || "",
          description: memberToEdit.description || "",
          photo: photoFile,
          contacts: memberToEdit.contacts || [],
        });
      };
      void convertImage();
    }
  }, [memberToEdit]);

  return {
    members,
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    addMember,
    editMember,
    deleteMember,
  };
};
