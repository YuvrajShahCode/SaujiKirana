"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/shops", label: "Shops", icon: Store },
        { href: "/cart", label: "Cart", icon: ShoppingBag },
        { href: "/orders", label: "Orders", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background px-4 py-2 md:hidden">
            <div className="flex justify-between items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 min-w-[64px]",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                            )}
                        >
                            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
