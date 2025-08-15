import { useEffect, useState } from "react";
import { CalendarEvent } from "../../../modules/calendar-event/calendar-event";
import { LayoutAdmin } from "../../../modules/layout-admin/layout-admin";
import { useEvents } from "../../../services/zustand/store";
import { ButtonUI } from "../../../shared/button-ui/button-ui";
import { Preloader } from "../../../shared/preloader/preloader";
import type { ModalTypes } from "../../../utils/types";
import styles from "./admin-events.module.scss";
import { Modal } from "../../../shared/modal-ui/modal-ui";
import { FormDeleteEvent } from "./components/delete-event-form/delete-event-form";
import { FormEditEvent } from "./components/edit-event-form/edit-event-form";
import { FormAddEvent } from "./components/add-event-form/add-event-form";

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
    <FormAddEvent
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  edit: (id, onSuccess, onFailure, onClose) => (
    <FormEditEvent
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  delete: (id, onSuccess, onFailure, onClose) => (
    <FormDeleteEvent
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  editConfirmation: () => <h2>This Member has been successfully edited!</h2>,
  addConfirmation: () => <h2>New Member has been successfully added!</h2>,
  deleteConfirmation: () => <h2>This Member has been successfully deleted!</h2>,

  error: () => <h2>Something went wrong... Please try again later!</h2>,
};

export const AdminEvents = () => {
  const { events, fetchEvents, isLoading } = useEvents();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleOpenModal = (type: ModalTypes, memberId?: string) => {
    setModalType(type);
    setSelectedEventId(memberId ?? null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedEventId(null);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <LayoutAdmin>
      {!isLoading ? (
        <div className={styles.container}>
          <h2 className={styles.container__title}>Calendar Editing</h2>
          <ButtonUI type="button" onClick={() => handleOpenModal("add")}>
            Add New
          </ButtonUI>
          <div className={styles.container__calendar}>
            {events.length > 0 ? (
              events.map((e) => (
                <div className={styles.container__calendar__event} key={e.id}>
                  <CalendarEvent data={e} />
                  <div className={styles.container__calendar__event__buttons}>
                    <ButtonUI
                      type="button"
                      onClick={() => handleOpenModal("edit", e.id)}
                    >
                      Edit Member
                    </ButtonUI>
                    <ButtonUI
                      type="button"
                      onClick={() => handleOpenModal("delete", e.id)}
                    >
                      Delete Member
                    </ButtonUI>
                  </div>
                </div>
              ))
            ) : (
              <h2>There are no events yet!</h2>
            )}
          </div>
        </div>
      ) : (
        <Preloader />
      )}
      <Modal onClose={handleCloseModal} isOpen={isOpen}>
        {modalType
          ? modalConfig[modalType]?.(
              selectedEventId || undefined,
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
