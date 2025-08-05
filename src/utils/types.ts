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
  images: TImage[];
  videos: TVideo[];
  description: string;
};

export type TMember = {
  id?: string;
  name: string;
  description: string;
  contact: TContact[];
};

export type TEvent = {
  id?: string;
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  link?: string;
  archieved: boolean;
  image: TImage;
};

export type TImage = {
  id?: string;
  link: string;
};

export type TVideo = {
  id?: string;
  link: string;
  name?: string;
};

export type TContact = {
  id?: string;
  name: string;
  contact: string;
};
