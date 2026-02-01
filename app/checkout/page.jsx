"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin } from "lucide-react";

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <MapPin className="mr-2 h-4 w-4" /> Delivery Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input placeholder="Enter full address" />
                            <Button variant="outline">Detect</Button>
                        </div>
                        <div className="mt-4 h-32 bg-muted rounded flex items-center justify-center text-muted-foreground">
                            Map Preview
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
                                <input type="radio" name="payment" defaultChecked />
                                <span>Cash on Delivery</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-muted opacity-50">
                                <input type="radio" name="payment" disabled />
                                <span>Online Payment (Coming Soon)</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <Button size="lg" className="w-full mt-4">
                    Place Order
                </Button>
            </div>
        </div>
    );
}
