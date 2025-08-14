export const exportFileName = (url: string) => {
  const urlArr = url.split("/");
  return urlArr[urlArr.length - 1];
};
