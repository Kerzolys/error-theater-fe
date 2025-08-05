import type { TEvent } from "../../utils/types";
import { fetchData } from "./firebase-api";

export const fetchEventsApi = () => {
  return fetchData<TEvent>("events", (doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// export const fetchEventsApi = async (): Promise<TEvent[] | null> => {
//   const eventsCollection = collection(db, "events");
//   const eventsSnapshot = await getDocs(eventsCollection);
//   const eventsList = await eventsSnapshot.docs.map((doc) => ({
//     id: doc.id,
//     name: doc.data().name,
//     location: doc.data().location,
//     date: doc.data().date,
//     time: doc.data().time,
//     description: doc.data().description,
//     link: doc.data().link,
//     archieved: doc.data().archieved,
//     image: doc.data().image,
//   }));

//   return eventsList;
// };

// export const addEventApi = async (newEvent: TEvent) => {
//   const docRef = await addDoc(collection(db, "events"), {
//     name: newEvent.name,
//     location: newEvent.location,
//     date: newEvent.date,
//     time: newEvent.time,
//     description: newEvent.description,
//     link: newEvent.link,
//     archieved: newEvent.archieved,
//     image: newEvent.image,
//   });

//   return docRef.id;
// };
