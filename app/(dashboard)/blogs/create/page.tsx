import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BlogCreateForm from "./_components/blog-create-form";

const page = async () => {
  const cu = await auth();

  if (!cu || !cu.user) redirect("/login");
  return (
    <div>
      <BlogCreateForm cu={cu.user} />
    </div>
  );
};

export default page;
