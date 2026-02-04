"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const phone_number = formData.get("phone_number");

        // Backend expects: username, email, password, role (optional, defaults to CUSTOMER), phone_number (optional)

        try {
            await api.post('/auth/register/', {
                username,
                email,
                password,
                phone_number
            });

            router.push("/login?registered=true");
        } catch (err) {
            console.error("Register Error:", err);
            // Django errors are usually { field: ["error"] }
            let msg = "Registration failed.";
            if (err.response?.data) {
                if (err.response.data.username) msg = `Username: ${err.response.data.username[0]}`;
                else if (err.response.data.email) msg = `Email: ${err.response.data.email[0]}`;
                else if (err.response.data.password) msg = `Password: ${err.response.data.password[0]}`;
                else msg = JSON.stringify(err.response.data);
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
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
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md break-words">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="username">Username</label>
                                <Input id="username" name="username" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone_number">Phone Number</label>
                                <Input id="phone_number" name="phone_number" placeholder="98XXXXXXXX" />
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
