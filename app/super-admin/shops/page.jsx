"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageShops() {
    const router = useRouter();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        delivery_radius_km: 6
    });

    const [locationStatus, setLocationStatus] = useState("idle"); // idle, detecting, success, error

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const res = await api.get('/shops/');
            setShops(res.data);
        } catch (error) {
            console.error("Failed to fetch shops:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocationStatus("detecting");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setLocationStatus("success");
            },
            (error) => {
                console.error(error);
                alert("Unable to retrieve your location");
                setLocationStatus("error");
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/shops/', formData);
            alert("Shop created successfully!");
            setFormData({
                name: "",
                address: "",
                latitude: "",
                longitude: "",
                delivery_radius_km: 6
            });
            setLocationStatus("idle");
            fetchShops();
        } catch (error) {
            console.error("Create failed:", error);
            alert("Failed to create shop.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this shop?")) return;
        try {
            await api.delete(`/shops/${id}/`);
            setShops(shops.filter(s => s.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete shop.");
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/super-admin">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Manage Shops</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Shop Form */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Add New Shop</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Shop Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g. Gupta General Store"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Full Address</label>
                                <Input
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    placeholder="Shop 12, Main Market..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium">Latitude</label>
                                    <Input
                                        value={formData.latitude}
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                        required
                                        type="number"
                                        step="any"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Longitude</label>
                                    <Input
                                        value={formData.longitude}
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                        required
                                        type="number"
                                        step="any"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleDetectLocation}
                            >
                                <MapPin className="mr-2 h-4 w-4" />
                                {locationStatus === "detecting" ? "Detecting..." : "Get Current Location"}
                            </Button>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Shop"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Shop List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Existing Shops ({shops.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {shops.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No shops found.</p>
                            ) : (
                                shops.map(shop => (
                                    <div key={shop.id} className="flex justify-between items-start p-4 border rounded hover:bg-muted/50 transition">
                                        <div>
                                            <h3 className="font-bold">{shop.name}</h3>
                                            <p className="text-sm text-muted-foreground">{shop.address}</p>
                                            <div className="flex gap-2 text-xs mt-1 text-muted-foreground">
                                                <span>Lat: {parseFloat(shop.latitude).toFixed(4)}</span>
                                                <span>Lng: {parseFloat(shop.longitude).toFixed(4)}</span>
                                                <span>Radius: {shop.delivery_radius_km}km</span>
                                            </div>
                                            {shop.owner && (
                                                <p className="text-xs text-blue-600 mt-1">Owner ID: {shop.owner}</p>
                                            )}
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(shop.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
