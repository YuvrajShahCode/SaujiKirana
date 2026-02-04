"use client";

import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, shopId }) {
    const { name, price, image } = product;
    const { addToCart } = useCart();

    const handleAdd = () => {
        const result = addToCart(product, shopId);
        if (!result.success) {
            alert(result.error);
        }
    };

    return (
        <Card className="overflow-hidden flex flex-row md:flex-col h-auto md:h-full">
            {/* Image mockup */}
            <div className="relative w-24 h-24 md:w-full md:h-40 bg-muted flex-shrink-0">
                {/* Image logic unchanged */}
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 20vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-200">
                        <span className="text-2xl opacity-20">📦</span>
                    </div>
                )}
            </div>

            <CardContent className="p-3 flex-1 flex flex-col justify-between">
                <div className="mb-2">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{name}</h4>
                    <p className="text-sm font-bold text-primary">₹{price}</p>
                </div>

                <Button size="sm" variant="outline" className="w-full mt-auto h-8 text-xs" onClick={handleAdd}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
            </CardContent>
        </Card>
    );
}
