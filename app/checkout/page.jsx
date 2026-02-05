"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const [address, setAddress] = useState("");
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shop, setShop] = useState(null);

    // Fetch Shop Details for validation
    useEffect(() => {
        if (cart.shopId) {
            api.get(`/shops/${cart.shopId}/`)
                .then(res => setShop(res.data))
                .catch(err => console.error("Failed to fetch shop details", err));
        }
    }, [cart.shopId]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Redirect if cart is empty
    useEffect(() => {
        if (!cart.items || cart.items.length === 0) {
            router.push('/');
        }
    }, [cart, router]);

    const handleDetectLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setLoading(false);
                    // Optional: Reverse geocode here to get address string if API key available
                },
                (err) => {
                    console.error(err);
                    setError("Failed to detect location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation not supported.");
        }
    };

    const handlePlaceOrder = async () => {
        setError("");

        if (!location) {
            setError("Please detect your delivery location.");
            return;
        }

        if (!address) {
            setError("Please enter a delivery address.");
            return;
        }

        // Client-side Distance Validation through strictly enforcing rules
        if (shop && location) {
            const dist = calculateDistance(location.lat, location.lng, shop.latitude, shop.longitude);
            if (dist > (shop.delivery_radius_km || 6)) {
                setError(`You are ${dist.toFixed(2)} km away. This shop only delivers within ${shop.delivery_radius_km || 6} km.`);
                return;
            }
        }

        setLoading(true);

        try {
            const itemsPayload = cart.items.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }));

            const payload = {
                shop: cart.shopId,
                delivery_lat: location.lat,
                delivery_lng: location.lng,
                delivery_address: address,
                items: itemsPayload
            };

            await api.post('/orders/', payload);

            clearCart();
            // Redirect to dashboard or order success
            router.push('/dashboard?order_success=true');
        } catch (err) {
            console.error("Order Error:", err);
            // Handle specific backend errors
            const msg = err.response?.data?.error || err.response?.data?.detail || "Failed to place order.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!cart.items.length) return null; // Handling useEffect redirect

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                <div className="flex flex-col gap-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <MapPin className="mr-2 h-4 w-4" /> Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter full address (Building, Street, Landmark)"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <Button variant="outline" onClick={handleDetectLocation} disabled={loading}>
                                    {loading && !location ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                                </Button>
                            </div>
                            {location && (
                                <div className="mt-2 text-xs text-green-600 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" /> Location Captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                </div>
                            )}
                            <div className="mt-4 h-32 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                                {location ? "Location Pinned" : "Map Preview Placeholder"}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {cart.items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between text-sm">
                                        <span>{item.quantity} x {item.product.name}</span>
                                        <span className="font-medium">₹{item.product.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-muted">
                                    <input type="radio" name="payment" defaultChecked readOnly />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-muted opacity-50">
                                    <input type="radio" name="payment" disabled />
                                    <span>Online Payment (Coming Soon)</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Button size="lg" className="w-full mt-4" onClick={handlePlaceOrder} disabled={loading}>
                        {loading ? "Placing Order..." : `Place Order (₹${cartTotal})`}
                    </Button>
                </div>
            </div>
        </AuthGuard>
    );
}
