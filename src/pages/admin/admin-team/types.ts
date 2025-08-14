import type { TMember } from "../../../utils/types";

export type TMemberForm = Omit<TMember, "photo"> & { photo: File | null };

export type TMemberFormErrors = {
  name: boolean;
  description: boolean;
  photo: boolean;
};
