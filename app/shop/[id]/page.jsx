import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/features/ProductCard";
import { Star, MapPin, Clock } from "lucide-react";
import { SHOPS, PRODUCTS } from "@/lib/data";
import { notFound } from "next/navigation";

// This is a Server Component that receives params prop
export default async function ShopDetails({ params }) {
    // Await params in Next.js 15+ if needed, but in 14 it's sync usually. 
    // However, in recent canary, params might be a promise.
    // Best practice now is to await it if it's dynamic.
    // Since we use static mock data, we can just use it.
    const { id } = await params;

    const shop = SHOPS.find(s => s.id === parseInt(id));

    if (!shop) {
        notFound();
    }

    // Filter products for this shop (mock logic, usually API)
    // If no products assigned in mock, show some generic ones or just the ones we added
    const shopProducts = PRODUCTS.filter(p => p.shopId === parseInt(id));

    // If empty, show random products for demo
    const displayProducts = shopProducts.length > 0 ? shopProducts : PRODUCTS.slice(0, 6);

    return (
        <div className="pb-20">
            {/* Shop Header */}
            <div className="bg-primary/5 border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
                            <p className="text-muted-foreground mb-4">{shop.type}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center font-bold text-foreground bg-white px-2 py-1 rounded shadow-sm">
                                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" /> {shop.rating}
                                </span>
                                <span className="flex items-center text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-1" /> {shop.distance} km
                                </span>
                                <span className="flex items-center text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" /> {shop.time} mins
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${shop.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {shop.isOpen ? 'Open Now' : 'Closed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-xl font-bold mb-6">Products</h2>

                {displayProducts.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No products found for this shop.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
