import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://saujikirana.com'), // Replace with actual domain
  title: "Sauji Kirana | Local Grocery & Food Delivery",
  description: "Order fresh groceries and food from your nearby local shops. Delivery within 6km. Hyper-local, fast, and trusted.",
  keywords: ["grocery", "food delivery", "local shops", "kirana", "instant delivery"],
  openGraph: {
    title: "Sauji Kirana",
    description: "Order fresh groceries and food from your nearby local shops.",
    url: 'https://saujikirana.com',
    siteName: 'Sauji Kirana',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sauji Kirana",
    description: "Order fresh groceries and food from your nearby local shops.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
