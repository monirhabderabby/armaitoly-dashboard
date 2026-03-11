import { auth } from "@/auth";
import { baseUrl } from "@/constants";
import { SingleBlogResponse } from "@/types/blogs";
import { redirect } from "next/navigation";
import BlogCreateForm from "../../create/_components/blog-create-form";

async function getBlog(
  id: string,
  accessToken: string,
): Promise<SingleBlogResponse> {
  const res = await fetch(`${baseUrl}/blog/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to fetch blog");
  }

  return res.json();
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const blogRes = await getBlog(id, session.user.accessToken ?? "");

  return (
    <div>
      <BlogCreateForm cu={session.user} initianData={blogRes.data} />
    </div>
  );
};

export default Page;
