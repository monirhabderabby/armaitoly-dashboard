import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MessagesContainer from "./_components/message-container";

const page = async () => {
  const cu = await auth();

  if (!cu || !cu.user) redirect("/login");

  return (
    <MessagesContainer
      accessToken={cu.user.accessToken as string}
      user={cu.user}
    />
  );
};

export default page;
