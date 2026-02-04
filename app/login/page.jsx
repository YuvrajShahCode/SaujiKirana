"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email"); // Using email as username or handle separately? 
        // Backend User model uses 'username'. We need to see if email login is supported or if we need a username field.
        // The previous mock used email input. 
        // Standard Django Auth expects 'username'. 
        // Let's assume for now we send email as username OR add a username field. 
        // Looking at Register page, it asks for First/Last/Email/Password. 
        // RegisterSerializer uses `username` and `email`. 
        // Let's check if the backend supports email auth or if we need to change input to 'username'.
        // For now, I will send email as username if the backend treats it that way, 
        // BUT standard Django requires 'username'. 
        // I'll update the form to ask for Username strictly to match backend default, 
        // OR I will check if I should modify the form to include username. 
        // The Register page has First/Last/Email/Password but NO Username field? 
        // Wait, I need to check Register Page again.

        // Let's pause and check Register Page content more closely.
        // The viewed Register Page has: First Name, Last Name, Email, Password. 
        // The Backend RegisterSerializer expects: `username`, `email`, `password`, `role`.
        // So the frontend Register form is MISSING `username`.
        // I will update Login to distinct username/password and Register to include username.

        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const response = await api.post('/auth/login/', {
                username,
                password
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Optional: Store username/role if returned, else just redirect
            router.push("/");
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px-300px)] py-20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            {/* Django default auth uses username */}
                            <label htmlFor="username">Username</label>
                            <Input id="username" name="username" placeholder="johndoe" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" isLoading={isLoading}>
                            Sign In
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
