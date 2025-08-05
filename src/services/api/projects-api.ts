import type { TProject } from "../../utils/types";
import { fetchData } from "./firebase-api";

// export const fetchProjectsApi = async (): Promise<TProject[] | null> => {
//   const projectsCollection = collection(db, "projects");
//   const projectsSnapshot = await getDocs(projectsCollection);
//   const projectsList = await projectsSnapshot.docs.map((doc) => ({
//     id: doc.id,
//     images: doc.data().images,
//     videos: doc.data().videos,
//     description: doc.data().description,
//   }));

//   return projectsList;
// };

export const fetchProjectsApi = () => {
  return fetchData<TProject>("projects", (doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// export const addProjectApi = async (newProject: TProject) => {
//   const docRef = await addDoc(collection(db, "projects"), {
//     images: newProject.images,
//     videos: newProject.videos,
//     description: newProject.description,
//   });

//   return docRef.id;
// };

// export const editProjectApi = async (editingProject: TProject) => {
//   try {
//     if (!editingProject.id) {
//       throw new Error("Project ID is required");
//     }

//     const docRef = await doc(db, "projects", editingProject.id);
//     await updateDoc(docRef, { ...editingProject });
//   } catch (err) {
//     console.error(err);
//     throw new Error("Error editing project");
//   }
// };

// export const deleteProjectApi = async (deletingProjectId: string) => {
//   try {
//     if (!deletingProjectId) {
//       throw new Error("Project ID is required");
//     }
//     const docRef = await doc(db, "projects", deletingProjectId);
//     await deleteDoc(docRef);
//   } catch (err) {
//     console.error(err);
//     throw new Error("Error deleting project");
//   }
// };
