export const convertNameToYandex = (name: string) =>
  name.replace(/[^\p{L}\p{N}]+/gu, "_");
