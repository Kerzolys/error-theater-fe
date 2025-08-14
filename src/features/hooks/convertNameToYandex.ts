export const convertNameToYandex = (name: string) =>
  name.replace(/[\s\W]+/g, "_");
