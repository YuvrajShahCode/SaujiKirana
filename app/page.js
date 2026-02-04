"use client"

import HeroSection from "@/components/features/HeroSection";
import ShopCard from "@/components/features/ShopCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader } from "@/components/ui/Loader";

export default function Home() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // 1. Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchShops(latitude, longitude);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError("Please enable location services to see nearby shops.");
          // Fetch shops without location (might return all or empty depending on backend logic)
          // Backend view says: if lat/lng not provided, return all (or filtered by nothing).
          fetchShops();
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      fetchShops();
    }
  }, []);

  const fetchShops = async (lat, lng) => {
    try {
      setLoading(true);
      const params = {};
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }

      const response = await api.get('/shops/', { params });

      // Map backend data to UI props
      const mappedShops = response.data.map(shop => ({
        id: shop.id,
        name: shop.name,
        type: "General Store", // Field missing in backend
        rating: 4.5, // Field missing in backend
        distance: shop.distance || 0, // Calculated by backend if lat/lng sent
        time: Math.ceil((shop.distance || 0) * 10) + 5, // Estimate: 10 mins per km + 5 prep
        limit: shop.delivery_radius_km,
        image: null, // Field missing in backend
        isOpen: shop.is_active
      }));

      setShops(mappedShops);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    } finally {
      setLoading(false);
    }
  };

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
          {locationError && <span className="text-sm text-amber-600 flex items-center"><MapPin className="h-4 w-4 mr-1" /> {locationError}</span>}
          <Link href="/shops">
            <Button variant="link" className="text-primary">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            {/* Fallback loader if Loader component fails or is simple */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shops.length > 0 ? (
              shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No shops found nearby.
              </div>
            )}
          </div>
        )}
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
