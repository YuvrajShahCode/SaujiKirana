import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, size = "default" }) {
    const sizeClass = size === "small" ? "h-4 w-4" : size === "large" ? "h-12 w-12" : "h-8 w-8";

    return (
        <div className={cn("flex justify-center items-center", className)}>
            <Loader2 className={cn("animate-spin text-primary", sizeClass)} />
        </div>
    );
}
