import type { TMember } from "../../utils/types";
import { fetchData } from "./firebase-api";

export const fetchMembersApi = () => {
  return fetchData<TMember>("members", (doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// export const fetchMembersApi = async (): Promise<TMember[] | null> => {
//   const membersCollection = collection(db, "members");
//   const membersSnapshot = await getDocs(membersCollection);
//   const membersList = await membersSnapshot.docs.map((doc) => ({
//     id: doc.id,
//     name: doc.data().name,
//     description: doc.data().description,
//     contact: doc.data().contact,
//   }));

//   return membersList;
// };

// export const addMemberApi = async (newMember: TMember) => {
//   const docRef = await addDoc(collection(db, "members"), {
//     name: newMember.name,
//     description: newMember.description,
//     contact: newMember.contact,
//   });

//   return docRef.id;
// };

// export const editMemberApi = async (editingMember: TMember) => {
//   try {
//     if (!editingMember.id) {
//       throw new Error("Member ID is required");
//     }
//     const docRef = await doc(db, "members", editingMember.id);
//     await updateDoc(docRef, { ...editingMember });
//   } catch (err) {
//     console.error(err);
//     throw new Error("Error editing member");
//   }
// };

// export const deleteMemberApi = async (deletingMemberId: string) => {
//   try {
//     if (!deletingMemberId) {
//       throw new Error("Member ID is required");
//     }
//     const docRef = await doc(db, "members", deletingMemberId);
//     await deleteDoc(docRef);
//   } catch (err) {
//     console.error(err);
//     throw new Error("Error deleting member");
//   }
// };
