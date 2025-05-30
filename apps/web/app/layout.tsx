import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ClerkAuthListener } from "@/components/clerkListener";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="suppressHydrationWarning">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {/* <ClerkAuthListener /> */}
          <div className="relative flex flex-col">
            <div>
              <NavBar />
            </div>
            <div className="flex-1">{children}</div>
            <div>
              {/* Footer */}
              <Footer />
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
