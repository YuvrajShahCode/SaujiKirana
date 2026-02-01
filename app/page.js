import HeroSection from "@/components/features/HeroSection";
import ShopCard from "@/components/features/ShopCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { SHOPS } from "@/lib/data";

export default function Home() {
  const featuredShops = SHOPS.filter(s => s.isOpen).slice(0, 4);

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {["Grocery", "Fresh Veggies", "Beverages", "Snacks", "Household", "Personal Care"].map((cat) => (
            <div key={cat} className="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border bg-card hover:border-primary transition-colors">
              <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Shops */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nearby Shops</h2>
          <Link href="/shops">
            <Button variant="link" className="text-primary">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4 mb-10">
        <div className="rounded-2xl bg-secondary px-8 py-12 md:flex items-center justify-between text-secondary-foreground overflow-hidden relative">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-3xl font-bold mb-4">Become a Seller</h3>
            <p className="text-lg opacity-90 mb-6">
              Own a Kirana shop? Register with us and reach more customers in your neighborhood.
            </p>
            <Link href="/register-shop">
              <Button variant="secondary" className="bg-white text-secondary hover:bg-gray-100 border-none">
                Register Now
              </Button>
            </Link>
          </div>
          {/* Abstract Background Shapes */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-10"></div>
        </div>
      </section>
    </div>
  );
}
