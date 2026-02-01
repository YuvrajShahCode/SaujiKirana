import ShopCard from "@/components/features/ShopCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Filter, Search } from "lucide-react";
import { SHOPS } from "@/lib/data";

export default function ShopsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Nearby Shops</h1>
                    <p className="text-muted-foreground">Found {SHOPS.length} shops within your delivery range</p>
                </div>

                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search shops..."
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SHOPS.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </div>
        </div>
    );
}
