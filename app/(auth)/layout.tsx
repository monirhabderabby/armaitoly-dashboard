import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
};

export default Layout;
