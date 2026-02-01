import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function ShopCard({ shop }) {
    const { id, name, type, rating, distance, time, limit, image, isOpen } = shop;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-200">
                        <span className="text-4xl opacity-20">🛒</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {isOpen ? 'Open' : 'Closed'}
                    </span>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{type}</p>
                    </div>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {rating}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {distance} km
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {time} mins
                    </div>
                </div>

                {distance > limit && (
                    <p className="text-xs text-red-500 mt-2 font-medium">Out of delivery range</p>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link href={`/shop/${id}`} className="w-full">
                    <Button className="w-full" disabled={!isOpen}>
                        {isOpen ? "View Shop" : "Closed Now"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
