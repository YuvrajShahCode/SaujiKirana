"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

// Helper Component for Shop Row
const ShopRow = ({ shop, onAction }) => (
    <div className="flex justify-between items-center p-3 border rounded mb-2">
        <div>
            <p className="font-bold">{shop.name}</p>
            <p className="text-xs text-muted-foreground">{shop.address} | Status: <span className={shop.status === 'APPROVED' ? 'text-green-600' : 'text-orange-600'}>{shop.status}</span></p>
        </div>
        <div className="flex gap-2">
            {shop.status === 'PENDING' && (
                <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onAction(shop.id, 'APPROVED')}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => onAction(shop.id, 'REJECTED')}>Reject</Button>
                </>
            )}
            {shop.status === 'APPROVED' && (
                <Button size="sm" variant="outline" className="text-red-500 border-red-200" onClick={() => onAction(shop.id, 'SUSPENDED')}>Suspend</Button>
            )}
            {shop.status === 'SUSPENDED' && (
                <Button size="sm" variant="outline" className="text-green-500" onClick={() => onAction(shop.id, 'APPROVED')}>Re-Activate</Button>
            )}
        </div>
    </div>
);

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({ shops: 0, orders: 0 });
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        shop_id: ""
    });
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const refreshData = async () => {
        try {
            setLoading(true);
            const [shopsRes, ordersRes] = await Promise.all([
                api.get('/shops/'),
                api.get('/orders/')
            ]);
            setShops(shopsRes.data);
            setStats({
                shops: shopsRes.data.length,
                orders: ordersRes.data.length
            });
        } catch (error) {
            console.error("Admin Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshData();
    }, []);

    const handleShopAction = async (shopId, newStatus) => {
        if (!confirm(`Are you sure you want to set status to ${newStatus}?`)) return;
        try {
            // Partial Update
            await api.patch(`/shops/${shopId}/`, { status: newStatus });
            refreshData(); // Reload to see changes
        } catch (err) {
            alert("Action failed.");
        }
    };

    const handleCreateSeller = async (e) => {
        e.preventDefault();
        setFormStatus({ type: '', message: '' });
        setIsSubmitting(true);

        try {
            await api.post('/auth/create-seller/', formData);
            setFormStatus({ type: 'success', message: `Seller ${formData.username} created successfully!` });
            setFormData({ username: "", password: "", email: "", shop_id: "" }); // Reset
        } catch (error) {
            console.error("Creation Failed:", error);
            const msg = error.response?.data?.detail || "Failed to create seller. Check inputs.";
            setFormStatus({ type: 'error', message: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    const pendingShops = shops.filter(s => s.status === 'PENDING');
    const activeShops = shops.filter(s => s.status === 'APPROVED');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Super Admin</h1>
                    <p className="text-muted-foreground">System Overview</p>
                </div>
                <Link href="/super-admin/shops">
                    <Button variant="outline">Manage Shops</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Total Shops</h3>
                    <p className="text-3xl font-bold text-primary">{stats.shops}</p>
                </div>
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-indigo-600">{stats.orders}</p>
                </div>
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Pending Approvals</h3>
                    <p className="text-3xl font-bold text-orange-500">{pendingShops.length}</p>
                </div>
            </div>

            {/* Pending Approvals Section */}
            {pendingShops.length > 0 && (
                <Card className="mb-8 border-orange-200 bg-orange-50/50">
                    <CardHeader>
                        <CardTitle className="text-orange-700">Pending Shop Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingShops.map(shop => (
                            <ShopRow key={shop.id} shop={shop} onAction={handleShopAction} />
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Seller Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create Shop Seller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateSeller} className="space-y-4">
                            {formStatus.message && (
                                <div className={`p-3 rounded text-sm ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Select Shop</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.shop_id}
                                    onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose a Shop --</option>
                                    {shops.map(shop => (
                                        <option key={shop.id} value={shop.id}>
                                            {shop.name} (ID: {shop.id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Email (Optional)"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Input
                                placeholder="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Seller Account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Shops List (Optional but helpful) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registered Shops</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {shops.length === 0 ? <p className="text-muted-foreground">No shops found.</p> : (
                                shops.map(shop => (
                                    <div key={shop.id} className="p-3 border rounded flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-bold">{shop.name}</p>
                                            <p className="text-muted-foreground">{shop.address}</p>
                                        </div>
                                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            Owner ID: {shop.owner || "None"}
                                        </div>
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
