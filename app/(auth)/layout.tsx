import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {children}
    </div>
  );
};

export default Layout;
