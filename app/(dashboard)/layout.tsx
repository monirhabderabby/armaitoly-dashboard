import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  const cu = await auth();

  if (!cu || !cu.user) redirect("/login");
  return <div>{children}</div>;
};

export default Layout;
