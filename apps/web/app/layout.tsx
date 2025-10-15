import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Niconne } from "next/font/google";

const niconne = Niconne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-niconne",
});
export const metadata: Metadata = {
  title: "Litecode",
  description: "nano-Leetcode Platform",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className="suppressHydrationWarning">
        <body className={``}>
          <div className="relative flex flex-col">
            <div>
              <NavBar />
            </div>
            <div className="flex-1">{children}</div>
            <div>
              <Footer />
            </div>
          </div>
        </body>
      </html>
    </>
  );
}
