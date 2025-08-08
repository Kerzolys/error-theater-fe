import { create } from "zustand";
import type {
  TContact,
  TEvent,
  TMember,
  TProject,
  TUser,
} from "../../utils/types";
import { loginUserApi, logoutUserApi, registerUserApi } from "../api/auth-api";
import { auth } from "../firebase/firebase";
import { fetchProjectsApi } from "../api/projects-api";
import { fetchMembersApi } from "../api/members-api";
import { addItemApi, deleteItemApi, editItemApi } from "../api/firebase-api";
import { fetchEventsApi } from "../api/events-api";
import { fetchContactsApi } from "../api/contacts-api";

type AuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSessionRestored: boolean;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  logout: () => void;
  setUser: (user: TUser) => void;
  setError: (error: string | null) => void;
  restoreSession: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isSessionRestored: false,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await loginUserApi(email, password);
      if (userCredential) {
        const token = await userCredential.user.getIdToken();

        const user: TUser = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || "",
          email: userCredential.user.email || "",
          password: "",
          refreshToken: userCredential.user.refreshToken,
          token,
        };
        localStorage.setItem("refreshToken", user.refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUserApi();
      localStorage.removeItem("refreshToken");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await registerUserApi(email, password);
      return userCredential;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
  restoreSession: async () => {
    set({ isLoading: true, isSessionRestored: false });

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isSessionRestored: true,
      });
      return;
    }

    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isSessionRestored: true,
        });
        return;
      }

      try {
        const token = await user.getIdToken();
        const userData: TUser = {
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          password: "",
          refreshToken: user.refreshToken,
          token,
        };
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          isSessionRestored: true,
        });
      } catch (err: any) {
        console.log("Ошибка при получении токена", err.message);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isSessionRestored: true,
        });
      }
    });
  },
}));

type ProjectsState = {
  projects: TProject[] | [];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => void;
  addProject: (project: TProject) => void;
  editProject: (project: TProject) => void;
  deleteProject: (projectId: string) => void;
};

export const useProjects = create<ProjectsState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await fetchProjectsApi();
      if (projects) {
        set({ projects, isLoading: false });
      } else {
        set({ error: "Error fetching projects", isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  addProject: async (newProject: TProject) => {
    set({ isLoading: true, error: null });

    try {
      const newProjectId = await addItemApi("projects", newProject);
      set((state) => ({
        projects: [...state.projects, { ...newProject, id: newProjectId }],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  editProject: async (editingProject: TProject) => {
    set({ isLoading: true, error: null });
    try {
      await editItemApi("projects", editingProject);
      set((state) => ({
        projects: state.projects.map((p) =>
          editingProject.id ? editingProject : p
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  deleteProject: async (deletingProjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteItemApi("projects", deletingProjectId);
      set((state) => ({
        projects: state.projects.filter((p) => deletingProjectId !== p.id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
}));

type MembersState = {
  members: TMember[] | [];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => void;
  addMember: (member: TMember) => void;
  editMember: (member: TMember) => void;
  deleteMember: (memberId: string) => void;
};

export const useMembers = create<MembersState>((set) => ({
  members: [],
  isLoading: false,
  error: null,
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const members = await fetchMembersApi();
      if (members) {
        set({ members, isLoading: false });
      } else {
        set({ error: "Error fetching members", isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  addMember: async (newMember: TMember) => {
    set({ isLoading: true, error: null });
    try {
      const newMemberId = await addItemApi("members", newMember);
      set((state) => ({
        members: [...state.members, { ...newMember, id: newMemberId }],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  editMember: async (editingMember: TMember) => {
    set({ isLoading: true, error: null });
    try {
      await editItemApi("members", editingMember);
      set((state) => ({
        members: state.members.map((m) =>
          editingMember.id ? editingMember : m
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  deleteMember: async (deletingMemberId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteItemApi("members", deletingMemberId);
      set((state) => ({
        members: state.members.filter((m) => deletingMemberId !== m.id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
}));

type EventsState = {
  events: TEvent[] | [];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => void;
  addEvent: (newEvent: TEvent) => void;
  editEvent: (editingEvent: TEvent) => void;
  deleteEvent: (deletingEventId: string) => void;
};

export const useEvents = create<EventsState>((set) => ({
  events: [],
  isLoading: false,
  error: null,
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await fetchEventsApi();
      if (events) {
        set({ events, isLoading: false });
      } else {
        set({ error: "Error fetching events", isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  addEvent: async (newEvent: TEvent) => {
    set({ isLoading: true, error: null });
    try {
      const newEventId = await addItemApi("events", newEvent);
      set((state) => ({
        events: [...state.events, { ...newEvent, id: newEventId }],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  editEvent: async (editingEvent: TEvent) => {
    set({ isLoading: true, error: null });
    try {
      await editItemApi("members", editingEvent);
      set((state) => ({
        events: state.events.map((e) => (editingEvent.id ? editingEvent : e)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  deleteEvent: async (deletingEventId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteItemApi("members", deletingEventId);
      set((state) => ({
        events: state.events.filter((e) => deletingEventId !== e.id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
}));

// type ImagesState = {
//   images: TImage[] | [];
//   isLoading: boolean;
//   error: string | null;
//   fetchImages: () => void;
//   addImage: (newImage: TImage) => void;
//   editImage: (editingImage: TImage) => void;
//   deleteImage: (deletingImageId: string) => void;
// };

// export const useImages = create<ImagesState>((set) => ({
//   images: [],
//   isLoading: false,
//   error: null,
//   fetchImages: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const images = await fetchImagesApi();
//       if (images) {
//         set({ images, isLoading: false });
//       } else {
//         set({ error: "Error fetching images", isLoading: false });
//       }
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
//   addImage: async (newImage: TImage) => {
//     set({ isLoading: true, error: null });
//     try {
//       const newImageId = await addItemApi("images", newImage);
//       set((state) => ({
//         images: [...state.images, { ...newImage, id: newImageId }],
//         isLoading: false,
//       }));
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
//   editImage: async (editingImage: TImage) => {
//     set({ isLoading: true, error: null });
//     try {
//       await editItemApi("images", editingImage);
//       set((state) => ({
//         images: state.images.map((i) => (editingImage.id ? editingImage : i)),
//         isLoading: false,
//       }));
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
//   deleteImage: async (deletingImageId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       await deleteItemApi("images", deletingImageId);
//       set((state) => ({
//         images: state.images.filter((i) => deletingImageId !== i.id),
//         isLoading: false,
//       }));
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
// }));

// type VideosState = {
//   videos: TVideo[] | [];
//   isLoading: boolean;
//   error: string | null;
//   fetchVideos: () => void;
//   addVideo: (newVideo: TVideo) => void;
//   editVideo: (editingVideo: TVideo) => void;
//   deleteVideo: (deletingVideoId: string) => void;
// };

// export const useVideos = create<VideosState>((set) => ({
//   videos: [],
//   isLoading: false,
//   error: null,
//   fetchVideos: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const videos = await fetchVideosApi();
//       if (videos) {
//         set({ videos, isLoading: false });
//       } else {
//         set({ error: "Error fetching videos", isLoading: false });
//       }
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
//   addVideo: async (newVideo: TVideo) => {
//     set({ isLoading: true, error: null });
//     try {
//       const newVideoId = await addItemApi("videos", newVideo);
//       set((state) => ({
//         videos: [...state.videos, { ...newVideo, id: newVideoId }],
//         isLoading: false,
//       }));
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
//   editVideo: async (editingVideo: TVideo) => {
//     set({ isLoading: true, error: null });
//     try {
//       await editItemApi("videos", editingVideo);
//       set((state) => ({
//         videos: state.videos.map((v) => (editingVideo.id ? editingVideo : v)),
//         isLoading: false,
//       }));
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
//   deleteVideo: async (deletingVideoId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       await deleteItemApi("videos", deletingVideoId);
//       set((state) => ({
//         videos: state.videos.filter((v) => deletingVideoId !== v.id),
//         isLoading: false,
//       }));
//     } catch (err: any) {
//       set({ isLoading: false, error: err.message });
//     }
//   },
// }));

type ContactsState = {
  contacts: TContact[] | [];
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => void;
  addContact: (newContact: TContact) => void;
  editContact: (editingContact: TContact) => void;
  deleteContact: (deletingContactId: string) => void;
};

export const useContacts = create<ContactsState>((set) => ({
  contacts: [],
  isLoading: false,
  error: null,
  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const contacts = await fetchContactsApi();
      if (contacts) {
        set({ contacts, isLoading: false });
      } else {
        set({ error: "Error fetching contacts", isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  addContact: async (newContact: TContact) => {
    set({ isLoading: true, error: null });
    try {
      const newContactId = await addItemApi("contacts", newContact);
      set((state) => ({
        contacts: [...state.contacts, { ...newContact, id: newContactId }],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  editContact: async (editingContact: TContact) => {
    set({ isLoading: true, error: null });
    try {
      await editItemApi("contacts", editingContact);
      set((state) => ({
        contacts: state.contacts.map((c) =>
          editingContact.id ? editingContact : c
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  deleteContact: async (deletingContactId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteItemApi("contacts", deletingContactId);
      set((state) => ({
        contacts: state.contacts.filter((c) => deletingContactId !== c.id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
}));
