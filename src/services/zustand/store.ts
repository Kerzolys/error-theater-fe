import { create } from "zustand";
import type { TEvent, TMember, TProject, TUser } from "../../utils/types";
import { loginUserApi, logoutUserApi, registerUserApi } from "../api/auth-api";
import { auth } from "../firebase/firebase";
import { fetchProjectsApi } from "../api/projects-api";
import { fetchMembersApi } from "../api/members-api";
import { addItemApi, deleteItemApi, editItemApi } from "../api/firebase-api";
import { fetchEventsApi } from "../api/events-api";
import { getCache, setCache } from "../../features/hooks/cache";

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
  setIsLoading: (value: boolean) => void;
  error: string | null;
  fetchProjects: () => void;
  addProject: (project: TProject) => void;
  editProject: (project: TProject) => void;
  deleteProject: (projectId: string) => void;
};

export const useProjects = create<ProjectsState>((set) => ({
  projects: getCache("projects") || [],
  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  error: null,
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    const cached = getCache<TProject[]>("projects");
    if (cached) {
      set({ projects: cached, isLoading: false });
      return;
    }

    try {
      const projects = await fetchProjectsApi();
      if (projects) {
        set({ projects, isLoading: false });
        setCache("projects", projects, 1440);
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
      set((state) => {
        const updated = [
          ...state.projects,
          { ...newProject, id: newProjectId },
        ];
        setCache("projects", updated, 1440);
        return { projects: updated, isLoading: false };
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  editProject: async (editingProject: TProject) => {
    set({ isLoading: true, error: null });
    try {
      await editItemApi("projects", editingProject);
      set((state) => {
        const updated = state.projects.map((p) =>
          p.id === editingProject.id ? editingProject : p
        );
        setCache("projects", updated, 1440);
        return { projects: updated, isLoading: false };
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  deleteProject: async (deletingProjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteItemApi("projects", deletingProjectId);
      set((state) => {
        const updated = state.projects.filter(
          (p) => deletingProjectId !== p.id
        );
        setCache("projects", updated, 1440);
        return { projects: updated, isLoading: false };
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
}));

type MembersState = {
  members: TMember[] | [];
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: string | null;
  fetchMembers: () => void;
  addMember: (member: TMember) => void;
  editMember: (member: TMember) => void;
  deleteMember: (memberId: string) => void;
};

export const useMembers = create<MembersState>((set) => ({
  members: getCache("members") || [],
  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  error: null,
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    const cached = getCache<TMember[]>("members");
    if (cached) {
      set({ members: cached, isLoading: false });
      return;
    }
    try {
      const members = await fetchMembersApi();
      if (members) {
        set({ members, isLoading: false });
        setCache("members", members, 1440);
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
      set((state) => {
        const updated = [...state.members, { ...newMember, id: newMemberId }];
        setCache("members", updated, 1440);
        return { members: updated, isLoading: false };
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  editMember: async (editingMember: TMember) => {
    set({ isLoading: true, error: null });
    try {
      await editItemApi("members", editingMember);
      set((state) => {
        const updated = state.members.map((m) =>
          m.id === editingMember.id ? editingMember : m
        );
        setCache("members", updated, 1440);
        return { members: updated, isLoading: false };
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
  deleteMember: async (deletingMemberId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteItemApi("members", deletingMemberId);
      set((state) => {
        const updated = state.members.filter((m) => deletingMemberId !== m.id);
        setCache("members", updated, 1440);
        return { members: updated, isLoading: false };
      });
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
