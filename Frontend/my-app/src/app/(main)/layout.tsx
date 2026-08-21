import { Navbar } from "@/components/main/NavbarComponent";
import { Footer } from "@/components/main/FooterComponent";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CartProvider>
        <OrderProvider>
          <div className="flex min-h-screen flex-col bg-[#fcfbf8]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </OrderProvider>
      </CartProvider>
    </ToastProvider>
  );
}
