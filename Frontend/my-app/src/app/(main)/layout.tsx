import { Navbar } from "@/components/main/NavbarComponent";
import { Footer } from "@/components/main/FooterComponent";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfbf8]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}