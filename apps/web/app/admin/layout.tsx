import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />
      <div className="flex-1 min-h-0">{children}</div>
      <Footer />
    </div>
  );
}
