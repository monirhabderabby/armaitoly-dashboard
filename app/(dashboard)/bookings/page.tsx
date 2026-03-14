// app/(dashboard)/booking-management/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BookingManagementContainer from "./_components/booking-management-container";

const page = async () => {
  const cu = await auth();
  if (!cu || !cu.user) redirect("/login");
  return <BookingManagementContainer user={cu.user} />;
};

export default page;
