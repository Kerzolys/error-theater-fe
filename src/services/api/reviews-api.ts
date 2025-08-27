import type { TReview } from "../../utils/types";
import { fetchData } from "./firebase-api";

export const fetchReviewsApi = () => {
  return fetchData<TReview>("reviews", (doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
