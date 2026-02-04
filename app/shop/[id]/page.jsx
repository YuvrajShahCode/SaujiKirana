"use client";

import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/features/ProductCard";
import { Star, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Loader } from "@/components/ui/Loader";

export default function ShopDetails() {
    const params = useParams();
    const id = params.id;

    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Shop Details
                const shopRes = await api.get(`/shops/${id}/`);
                setShop(shopRes.data);

                // Fetch Products
                const prodRes = await api.get('/products/', { params: { shop_id: id } });
                setProducts(prodRes.data);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;
    if (!shop) return <div className="text-center py-20">Shop not found.</div>;

    // Default values for missing backend fields
    const rating = shop.rating || 4.5;
    const distance = shop.distance || 0; // Only if passed, else might need logic
    const time = Math.ceil(distance * 10) + 5;

    return (
        <div className="pb-20">
            {/* Shop Header */}
            <div className="bg-primary/5 border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
                            <p className="text-muted-foreground mb-4">{shop.type || "General Store"}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center font-bold text-foreground bg-white px-2 py-1 rounded shadow-sm">
                                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" /> {rating}
                                </span>
                                {distance > 0 && (
                                    <span className="flex items-center text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-1" /> {distance} km
                                    </span>
                                )}
                                <span className="flex items-center text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" /> {time} mins
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Backend uses is_active */}
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${shop.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {shop.is_active ? 'Open Now' : 'Closed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-xl font-bold mb-6">Products</h2>

                {products.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No products available for this shop.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} shopId={parseInt(id)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
