export const urlToFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const mime = blob.type || "image/jpeg";
  return new File([blob], filename, { type: mime });
};