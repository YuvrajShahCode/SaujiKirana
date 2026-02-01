import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, User, Menu, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Sauji Kirana
                        </span>
                    </Link>
                </div>

                {/* Desktop Search / Location (Hidden on mobile) */}
                <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-4 gap-2">
                    <Button variant="outline" className="text-muted-foreground w-full justify-start font-normal">
                        <MapPin className="mr-2 h-4 w-4" />
                        Select Location
                    </Button>
                    <div className="relative w-full">
                        <Input
                            type="search"
                            placeholder="Search for shops or items..."
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                                0
                            </span>
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>

                    <Link href="/login">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Button>
                    </Link>

                    {/* Mobile Menu Trigger (could be used for sidebar later) */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
