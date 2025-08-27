import type { TProject } from "../../utils/types";
import { fetchData } from "./firebase-api";

export const fetchProjectsApi = () => {
  return fetchData<TProject>("projects", (doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

