import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-muted/40 py-8 md:py-12 mb-16 md:mb-0">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-primary">Sauji Kirana</h3>
                    <p className="text-sm text-muted-foreground">
                        Your trusted local shopping companion. Fresh groceries delivered in minutes.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold">Quick Links</h4>
                    <Link href="/shops" className="text-sm text-muted-foreground hover:text-primary">
                        Nearby Shops
                    </Link>
                    <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary">
                        View Cart
                    </Link>
                    <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary">
                        Track Order
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold">Support</h4>
                    <Link href="/help" className="text-sm text-muted-foreground hover:text-primary">
                        Help Center
                    </Link>
                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                        Contact Us
                    </Link>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                        Terms of Service
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold">For Business</h4>
                    <Link href="/register-shop" className="text-sm text-muted-foreground hover:text-primary">
                        Register as Shopkeeper
                    </Link>
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                        Partner Login
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Sauji Kirana. All rights reserved.
            </div>
        </footer>
    );
}
