import { useEffect, useMemo, useState } from "react";
import { useReviews } from "../../../../services/zustand/store";
import type { TReview } from "../../../../utils/types";
import type { TReviewFormError } from "../types";

export const useReviewForm = (reviewId?: string) => {
  const {
    reviews,
    isLoading,
    setIsLoading,
    addReview,
    editReview,
    deleteReview,
  } = useReviews();

  const [values, setValues] = useState<TReview>({
    text: "",
    source: "",
  });
  const [errors, setErrors] = useState<TReviewFormError>({
    text: false,
    source: false,
  });

  const reviewToEdit = useMemo(() => {
    return reviewId ? reviews.find((p) => p.id === reviewId) : null;
  }, [reviewId, reviews]);

  useEffect(() => {
    if (reviewToEdit) {
      setValues({
        text: reviewToEdit.text,
        source: reviewToEdit.source,
      });
    }
  }, [reviewToEdit]);

  return {
    reviews,
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    addReview,
    editReview,
    deleteReview,
  };
};
