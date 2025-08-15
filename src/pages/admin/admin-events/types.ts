import type { TEvent } from "../../../utils/types";

export type TEventForm = Omit<TEvent, "image"> & { image: File | null };

export type TEventFormErrors = {
  name: boolean;
  date: boolean;
  time: boolean;
  description: boolean;
  location: boolean;
};
