import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FaqsPage from "./_components/faqs-management";

const Page = async () => {
  const cu = await auth();

  if (!cu || !cu.user) redirect("/login");
  return (
    <div>
      <FaqsPage cu={cu.user} />
    </div>
  );
};

export default Page;
