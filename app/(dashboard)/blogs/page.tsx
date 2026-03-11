import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BlogList } from "./_components/blog-list";

export default async function BlogsPage() {
  const session = await auth();
  const cu = session?.user;

  if (!session || !cu) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            Blog Management
          </h1>
          <nav className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <Link
              href="/dashboard"
              className="hover:text-[#23A4D2] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="size-3" />
            <span className="font-medium text-gray-600">Blog Management</span>
          </nav>
        </div>

        <Link href="/blogs/create">
          <Button className="h-9 gap-1.5 rounded-lg bg-[#23A4D2] px-4 text-sm font-medium text-white hover:bg-[#1a8fb8] transition-colors cursor-pointer">
            <Plus className="size-3.5" />
            Add New Blog
          </Button>
        </Link>
      </div>

      {/* Blog list */}
      <BlogList cu={cu} />
    </div>
  );
}
