import type { TContact } from "../../utils/types";
import { fetchData } from "./firebase-api";

export const fetchContactsApi = () => {
  return fetchData<TContact>("contacts", (doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
