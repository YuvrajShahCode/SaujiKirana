"use client"

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Cart Item Component
function CartItem({ item }) {
    return (
        <Card className="flex flex-row items-center p-4 gap-4">
            <div className="h-16 w-16 bg-muted rounded flex items-center justify-center text-xs">
                Img
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-sm text-muted-foreground">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8">
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-bold w-4 text-center">1</span>
                <Button size="icon" variant="outline" className="h-8 w-8">
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </Card>
    );
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 101, name: "Aashirvaad Atta (5kg)", price: 320 },
        { id: 102, name: "Tata Salt (1kg)", price: 28 },
    ]);

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                    <Link href="/shops">
                        <Button>Browse Shops</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {cartItems.map((item, idx) => (
                        <CartItem key={idx} item={item} />
                    ))}

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between text-lg font-bold mb-6">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <Link href="/checkout">
                            <Button className="w-full" size="lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
