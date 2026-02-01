"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock register
        setTimeout(() => {
            setIsLoading(false);
            router.push("/");
        }, 1500);
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px-300px)] py-20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details to register as a new customer
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName">First name</label>
                                <Input id="firstName" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName">Last name</label>
                                <Input id="lastName" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email">Email</label>
                            <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" isLoading={isLoading}>
                            Create account
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </div>
                        <div className="text-center text-xs text-muted-foreground mt-4">
                            Want to sell? <Link href="/register-shop" className="underline">Register as Shopkeeper</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
