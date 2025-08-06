export type TProjectForm = {
  id?: string;
  images_link: string[];
  images_files: File[];
  videos: string[];
  description: string;
  name: string;
  mainImage_link: string;
  mainImage_file: File[] | null;
};

export type TProjectErrors = {
  name: boolean;
  description: boolean;
  mainImage: boolean;
};
