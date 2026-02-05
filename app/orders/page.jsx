"use client"

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, MapPin, Clock } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function OrdersPage() {
    const orders = [
        {
            id: "#ORD-9381",
            shop: "Gupta Kirana Store",
            items: "Atta (5kg), Fortune Oil (1L)",
            total: 470,
            status: "Delivered",
            date: "2023-10-24",
            address: "123, Kathmandu Heights",
        },
        {
            id: "#ORD-9382",
            shop: "Raju Da's Tea & Snacks",
            items: "Samosa (4pc), Masala Tea (2)",
            total: 140,
            status: "Processing",
            date: "Today, 10:30 AM",
            address: "Office Block B",
        }
    ];

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold">{order.shop}</h3>
                                        <p className="text-xs text-muted-foreground">{order.date}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="text-sm mb-3">
                                    <p className="font-medium text-foreground">{order.items}</p>
                                </div>

                                <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-3">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" /> {order.address}
                                        </span>
                                    </div>
                                    <div className="font-bold text-foreground">
                                        ₹{order.total}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AuthGuard>
    );
}
