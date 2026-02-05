"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AuthGuard from "@/components/auth/AuthGuard";

export default function RegisterShopPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [location, setLocation] = useState(null);
    const [detecting, setDetecting] = useState(false);

    const handleDetectLocation = () => {
        if (navigator.geolocation) {
            setDetecting(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setDetecting(false);
                },
                (err) => {
                    console.error(err);
                    setError("Failed to detect location. Please enable location services.");
                    setDetecting(false);
                }
            );
        } else {
            setError("Geolocation not supported.");
        }
    };

    const handleRegisterShop = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!location) {
            setError("Please capture your shop location.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const address = formData.get("address");

        try {
            await api.post('/shops/', {
                name,
                address,
                latitude: location.lat,
                longitude: location.lng
            });

            // Redirect to dashboard with success param
            router.push("/dashboard?shop_created=true");
        } catch (err) {
            console.error("Shop Creation Error:", err);
            const msg = err.response?.data?.error || err.response?.data?.detail || "Failed to register shop.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Register your Shop</CardTitle>
                        <CardDescription>
                            Start selling on Sauji Kirana. Approval required.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegisterShop}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Shop Name</label>
                                <Input id="name" name="name" placeholder="e.g. Gupta General Store" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium">Full Address</label>
                                <Input id="address" name="address" placeholder="Building, Street, Area, City" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Shop Location (Accurate)</label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleDetectLocation}
                                        disabled={detecting}
                                    >
                                        {detecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                                        {location ? "Update Location" : "Detect Current Location"}
                                    </Button>
                                </div>
                                {location && (
                                    <p className="text-xs text-green-600 mt-1">
                                        Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
                                    </p>
                                )}
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" type="submit" isLoading={isLoading} disabled={!location}>
                                Submit for Approval
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AuthGuard>
    );
}
