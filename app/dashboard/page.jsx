"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [myShop, setMyShop] = useState(null);

    // Form
    const [shopForm, setShopForm] = useState({ name: '', address: '', latitude: '', longitude: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Basic Auth Check
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/login');
                return;
            }

            // We need to know who the user is. 
            // In a real app, we'd have a /me endpoint or decode token.
            // For now, we infer from localStorage or fetch profile if available.
            // Let's assume we can fetch basic user details or just check role from localStorage
            const role = localStorage.getItem('user_role');
            setUser({ role });

            try {
                setLoading(true);

                // If Shopkeeper, fetch their shop status first
                if (role === 'SHOPKEEPER') {
                    // We need an endpoint to "get my shop". 
                    // Since we don't have /me/shop, we filter shops by owner=me via filtering logic implicitly or explicitly.
                    // But standard list /shops/ returns "Active & Approved" usually.
                    // Let's try fetching /shops/ first. If the backend is set up right for permissions, 
                    // a SHOPKEEPER might see their own shop even if pending? 
                    // Actually our backend logic says "Admin or Owner sees their own". 
                    // So fetching /shops/ should return my shop.
                    const shopRes = await api.get('/shops/');
                    // Assuming 1 shop per user
                    const foundShop = shopRes.data.find(s => s.owner === parseInt(localStorage.getItem('user_id') || '0'));
                    // Wait, we don't have user_id easily. 
                    // Let's rely on the fact that for SHOPKEEPER, list might return their shop.
                    // OR we check the response.
                    if (shopRes.data.length > 0) {
                        setMyShop(shopRes.data[0]); // Simplification
                    }
                }

                const response = await api.get('/orders/');
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleCreateShop = async (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            alert("Geolocation needed");
            return;
        }

        setCreating(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const payload = {
                    ...shopForm,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
                const res = await api.post('/shops/', payload);
                setMyShop(res.data);
                alert("Shop created! Please wait for approval.");
            } catch (err) {
                alert("Failed to create shop. " + (err.response?.data?.error || ""));
            } finally {
                setCreating(false);
            }
        }, (err) => {
            alert("Location access denied.");
            setCreating(false);
        });
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    // SHOPKEEPER VIEW
    if (user?.role === 'SHOPKEEPER') {
        if (!myShop) {
            return (
                <div className="container mx-auto px-4 py-8 max-w-lg">
                    <Card>
                        <CardHeader><CardTitle>Setup Your Shop</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateShop} className="space-y-4">
                                <p className="text-sm text-muted-foreground">You need to register your shop to receive orders.</p>
                                <input className="border p-2 w-full rounded" placeholder="Shop Name" required
                                    value={shopForm.name} onChange={e => setShopForm({ ...shopForm, name: e.target.value })} />
                                <textarea className="border p-2 w-full rounded" placeholder="Full Address" required
                                    value={shopForm.address} onChange={e => setShopForm({ ...shopForm, address: e.target.value })} />
                                <button type="submit" disabled={creating} className="bg-primary text-white w-full py-2 rounded">
                                    {creating ? "Creating..." : "Create Shop & Request Approval"}
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (myShop.status === 'PENDING') {
            return (
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-orange-600 mb-2">Approval Pending</h1>
                    <p>Your shop <strong>{myShop.name}</strong> is currently waiting for admin approval.</p>
                    <p className="text-sm text-muted-foreground mt-4">You will receive orders once approved.</p>
                </div>
            );
        }

        if (myShop.status === 'SUSPENDED') {
            return (
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Shop Suspended</h1>
                    <p>Please contact support.</p>
                </div>
            );
        }
    }

    // NORMAL DASHBOARD (Customer / Approved Shopkeeper / SuperUser fallback)
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            {/* Stats & Orders List (Existing Code) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-primary">{orders.length}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p className="text-muted-foreground">No orders found.</p>
                ) : (
                    orders.map(order => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                    <span className={`text-sm font-bold ${order.status === 'PENDING' ? 'text-orange-500' : 'text-green-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p><strong>Shop:</strong> {order.shop_id || "Shoppee"}</p>
                                    <p><strong>Total:</strong> ₹{order.total_amount}</p>
                                    <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                    <p><strong>Address:</strong> {order.delivery_address}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
