"use client";

import { logoSrc } from "@/constants/images";
import {
  BookOpen,
  CalendarCheck,
  HelpCircle,
  ImageUpscale,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const AlertModal = dynamic(() => import("@/components/ui/custom/alert-modal"), {
  ssr: false,
});

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Booking Management",
    href: "/bookings",
    icon: CalendarCheck,
  },
  { label: "Blog Management", href: "/blogs", icon: BookOpen },
  { label: "Assets", href: "/assets", icon: ImageUpscale },
  {
    label: "Contact messages",
    href: "/contacts",
    icon: MessageSquare,
  },
  { label: "FAQ Management", href: "/faqs", icon: HelpCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut({ redirect: true, redirectTo: "/login" });
  }

  return (
    <>
      <AlertModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
      />

      <aside className="flex h-screen w-50 shrink-0 flex-col border-r border-gray-100 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-4">
          <Image
            src={logoSrc}
            alt="Joy Beach Villas"
            width={90}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#23A4D2] text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon className="size-3.75 shrink-0" />
                <span className="leading-none">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 px-3 py-4">
          <button
            onClick={() => setLogoutOpen(true)}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="size-3.75 shrink-0" />
            <span className="leading-none">
              {isLoggingOut ? "Logging out..." : "Log out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
