import AppProvider from "@/provider/appProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Joy Beach Villas | Luxury Beachfront Accommodation",
  description:
    "Experience the ultimate beachfront getaway at Joy Beach Villas. Enjoy stunning ocean views, world-class amenities, and unforgettable stays in our luxury villas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}  antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
