import { HeaderAdmin } from "../header-admin/header-admin";

export const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderAdmin />
      {children}
    </>
  );
};
