import { auth } from "@/auth";
import Sidebar from "@/components/dashboard/sidebar";
import { Search } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!session || !user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
          {/* Search */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ..."
              className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#23A4D2] focus:ring-1 focus:ring-[#23A4D2] transition"
            />
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {user?.email}
              </p>
            </div>
            <Image
              src={user?.profileImage ?? "/avatar-placeholder.png"}
              alt="Avatar"
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-2 ring-gray-100"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
