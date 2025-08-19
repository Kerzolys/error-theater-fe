export const isValidPassword = (password: string) => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{8,}$/;
  return pattern.test(password);
};
