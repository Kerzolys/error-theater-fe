import React, { useEffect, useState } from "react";
import { LayoutAdmin } from "../../../modules/layout-admin/layout-admin";
import { useMembers } from "../../../services/zustand/store";
import { Preloader } from "../../../shared/preloader/preloader";
import { TeamCard } from "../../../modules/team-card/team-card";
import { ButtonUI } from "../../../shared/button-ui/button-ui";
import type { ModalTypes } from "../../../utils/types";
import styles from "./admin-team.module.scss";
import { FormAddMember } from "./components/form-add-member/form-add-member";
import { FormDeleteMember } from "./components/form-delete-member/form-delete-member";
import { Modal } from "../../../shared/modal-ui/modal-ui";
import { FormEditMember } from "./components/form-edit-member/form-edit-member";

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
    <FormAddMember
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  edit: (id, onSuccess, onFailure, onClose) => (
    <FormEditMember
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  delete: (id, onSuccess, onFailure, onClose) => (
    <FormDeleteMember
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  editConfirmation: () => <h2>Tis Member has been successfully edited!</h2>,
  addConfirmation: () => <h2>New Member has been successfully added!</h2>,
  deleteConfirmation: () => <h2>THis Member has been successfully deleted!</h2>,

  error: () => <h2>Something went wrong... Please try again later!</h2>,
};

export const AdminTeam = () => {
  const { members, fetchMembers, isLoading } = useMembers();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const handleOpenModal = (type: ModalTypes, memberId?: string) => {
    setModalType(type);
    setSelectedMemberId(memberId ?? null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedMemberId(null);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <LayoutAdmin>
      <div className={styles.container}>
        <h2>Error Theater Team Members</h2>
        <ButtonUI type="button" onClick={() => handleOpenModal("add")}>
          Add New
        </ButtonUI>
        <div className={styles.container__members}>
          {members.length > 0 ? (
            members.map((m) => (
              <div className={styles.container__members__member}>
                <TeamCard data={m} />
                <div className={styles.container__members__member__buttons}>
                  <ButtonUI
                    type="button"
                    onClick={() => handleOpenModal("edit", m.id)}
                  >
                    Edit Project
                  </ButtonUI>
                  <ButtonUI
                    type="button"
                    onClick={() => handleOpenModal("delete", m.id)}
                  >
                    Delete Project
                  </ButtonUI>
                </div>
              </div>
            ))
          ) : (
            <h2>There are no members yet!</h2>
          )}
        </div>
      </div>
      <Modal onClose={handleCloseModal} isOpen={isOpen}>
        {modalType
          ? modalConfig[modalType]?.(
              selectedMemberId || undefined,
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
              () => handleOpenModal("error"),
              handleCloseModal
            )
          : null}
      </Modal>
    </LayoutAdmin>
  );
};
