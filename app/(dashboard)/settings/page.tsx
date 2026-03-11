import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsContainer from "./_components/settings-container";

const page = async () => {
  const cu = await auth();

  if (!cu || !cu.user) redirect("/login");

  return (
    <SettingsContainer
      accessToken={cu.user.accessToken as string}
      user={cu.user}
    />
  );
};

export default page;
