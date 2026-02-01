"use client"

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Modal";
import AddressPicker from "@/components/features/AddressPicker";
import { useRouter } from "next/navigation";

export default function HeroSection() {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [locationName, setLocationName] = useState("");
    const router = useRouter();

    const handleLocationSelect = (loc) => {
        console.log("Selected Location:", loc);
        // In a real app, reverse geocode here to get address name
        setLocationName(`${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
        setIsPickerOpen(false);
    };

    const handleFindShops = () => {
        // Navigate to shops page with filters if needed
        router.push("/shops");
    };

    return (
        <section className="relative bg-gradient-to-r from-green-50 to-orange-50 py-20 lg:py-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Groceries delivered from your <br className="hidden md:inline" />
                    <span className="text-primary">Trusted Local Shops</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Order fresh food, drinks, and daily essentials from nearby Kirana stores.
                    Delivered to your doorstep in minutes.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto bg-white p-2 rounded-lg shadow-lg border">
                    <div className="relative w-full cursor-pointer" onClick={() => setIsPickerOpen(true)}>
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Select your delivery location"
                            value={locationName}
                            readOnly
                            className="pl-10 border-none shadow-none focus-visible:ring-0 cursor-pointer"
                        />
                    </div>
                    <Button className="w-full sm:w-auto px-8 h-10" onClick={handleFindShops}>
                        Find Shops
                    </Button>
                </div>
            </div>

            <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Location</DialogTitle>
                        <DialogDescription>
                            Choose your delivery location on the map to find nearby shops.
                        </DialogDescription>
                    </DialogHeader>
                    <AddressPicker onSelectLocation={handleLocationSelect} />
                </DialogContent>
            </Dialog>
        </section>
    );
}
