import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchData = async <T>(
  collectionName: string,
  mapDoc: (doc: any) => T
): Promise<T[] | null> => {
  const dataCollection = collection(db, collectionName);
  const snapshot = await getDocs(dataCollection);
  return snapshot.docs.map(mapDoc);
};

export const addItemApi = async <T extends DocumentData>(
  collectionName: string,
  item: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), item);
  return docRef.id;
};

export const editItemApi = async <T extends DocumentData>(
  collectionName: string,
  item: T
) => {
  const docRef = doc(db, collectionName, item.id);
  await updateDoc(docRef, { ...item });
};

export const deleteItemApi = async (collectionName: string, itemId: string) => {
  const docRef = doc(db, collectionName, itemId);
  await deleteDoc(docRef);
};
