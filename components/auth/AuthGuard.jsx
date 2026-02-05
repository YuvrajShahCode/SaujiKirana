"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loader";

export default function AuthGuard({ children, requiredRole = null }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');

        if (!token) {
            router.push('/login');
            return;
        }

        if (requiredRole && role !== requiredRole) {
            // Redirect to appropriate page
            if (role === 'SUPERUSER') router.push('/super-admin');
            else router.push('/dashboard'); // Fallback
            return;
        }

        setAuthorized(true);
    }, [router, requiredRole]);

    if (!authorized) {
        return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
    }

    return <>{children}</>;
}
