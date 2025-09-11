export type TProjectForm = {
  id?: string;
  images: File[];
  videos: string[];
  description: string;
  name: string;
  mainImage: File | null;
  data: string;
};

export type TProjectErrors = {
  name: boolean;
  description: boolean;
  mainImage: boolean;
};
