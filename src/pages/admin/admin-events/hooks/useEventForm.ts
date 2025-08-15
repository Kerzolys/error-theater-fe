import { useEffect, useMemo, useState } from "react";
import { useEvents } from "../../../../services/zustand/store";
import type { TEventForm, TEventFormErrors } from "../types";
import { urlToFile } from "../../../../features/hooks/urlToFile";
import { exportFileName } from "../../../../features/hooks/exportFileName";

export const useEventForm = (eventId?: string) => {
  const { events, isLoading, setIsLoading, addEvent, editEvent, deleteEvent } =
    useEvents();

  const [values, setValues] = useState<TEventForm>({
    date: "",
    time: "",
    location: "",
    name: "",
    description: "",
    link: "",
    image: null,
    archieved: false,
  });
  const [errors, setErrors] = useState<TEventFormErrors>({
    date: false,
    time: false,
    location: false,
    description: false,
  });

  const eventToEdit = useMemo(() => {
    return eventId ? events.find((p) => p.id === eventId) : null;
  }, [eventId, events]);

  useEffect(() => {
    if (eventToEdit) {
      const convertImage = async () => {
        const photoFile = await urlToFile(
          eventToEdit.image,
          exportFileName(eventToEdit.image)
        );

        setValues({
          date: eventToEdit.date || "",
          time: eventToEdit.time || "",
          location: eventToEdit.time || "",
          name: eventToEdit.name || "",
          description: eventToEdit.description || "",
          link: eventToEdit.link || "",
          image: photoFile,
          archieved: eventToEdit.archieved,
        });
      };
      void convertImage();
    }
  }, [eventToEdit]);

  return {
    events,
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    addEvent,
    editEvent,
    deleteEvent,
  };
};
