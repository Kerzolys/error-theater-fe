import { useEffect, useState } from "react";
import { LayoutAdmin } from "../../../modules/layout-admin/layout-admin";
import { Review } from "../../../modules/review/review";
import { useReviews } from "../../../services/zustand/store";
import { ButtonUI } from "../../../shared/button-ui/button-ui";
import { Modal } from "../../../shared/modal-ui/modal-ui";
import { Preloader } from "../../../shared/preloader/preloader";
import type { ModalTypes } from "../../../utils/types";

import styles from "./admin-reviews.module.scss";
import { FormAddReview } from "./components/form-add-review/form-add-review";
import { FormEditReview } from "./components/form-edit-review/form-edit-review";
import { FormDeleteReview } from "./components/form-delete-review/form-delete-review";

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
    <FormAddReview
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  edit: (id, onSuccess, onFailure, onClose) => (
    <FormEditReview
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  delete: (id, onSuccess, onFailure, onClose) => (
    <FormDeleteReview
      id={id!}
      onSuccess={onSuccess}
      onFailure={onFailure}
      onClose={onClose!}
    />
  ),
  editConfirmation: () => <h2>This Review has been successfully edited!</h2>,
  addConfirmation: () => <h2>New Review has been successfully added!</h2>,
  deleteConfirmation: () => <h2>This Review has been successfully deleted!</h2>,

  error: () => <h2>Something went wrong... Please try again later!</h2>,
};

export const AdminReviews = () => {
  const { reviews, isLoading, fetchReviews } = useReviews();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const handleOpenModal = (type: ModalTypes, reviewId?: string) => {
    setModalType(type);
    setSelectedReviewId(reviewId ?? null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedReviewId(null);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <LayoutAdmin>
      {!isLoading ? (
        <div className={styles.container}>
          <h2>Error Theater Reviews</h2>
          <ButtonUI type="button" onClick={() => handleOpenModal("add")}>
            Add New
          </ButtonUI>
          <div className={styles.container__reviews}>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div className={styles.container__reviews__review} key={r.id}>
                  <Review data={r} />
                  <div className={styles.container__reviews__review__buttons}>
                    <ButtonUI
                      type="button"
                      onClick={() => handleOpenModal("edit", r.id)}
                    >
                      Edit Review
                    </ButtonUI>
                    <ButtonUI
                      type="button"
                      onClick={() => handleOpenModal("delete", r.id)}
                    >
                      Delete Review
                    </ButtonUI>
                  </div>
                </div>
              ))
            ) : (
              <h2>There are no reviews yet!</h2>
            )}
          </div>
        </div>
      ) : (
        <Preloader />
      )}
      <Modal onClose={handleCloseModal} isOpen={isOpen}>
        {modalType
          ? modalConfig[modalType]?.(
              selectedReviewId || undefined,
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
