export type TUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
  token: string;
};

export type TProject = {
  id?: string;
  images: string[];
  videos: string[];
  description: string;
  name: string;
  mainImage: string;
};

export type TMember = {
  id?: string;
  name: string;
  position: string;
  description: string;
  contacts: TContact[];
  photo: string;
};

export type TEvent = {
  id?: string;
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  link?: string;
  archieved?: boolean;
  image?: string;
};

// export type TImage = {
//   id?: string;
//   link: string;
//   title?: string;
// };

// export type TVideo = {
//   id?: string;
//   link: string;
//   name?: string;
// };

export type TContact = {
  id?: string;
  type: string;
  contact: string;
};

export interface ModalConfig {
  content: React.ReactNode;
}

export type ModalTypes =
  | "add"
  | "edit"
  | "delete"
  | "addConfirmation"
  | "waiting"
  | "error"
  | "deleteConfirmation"
  | "editConfirmation";
