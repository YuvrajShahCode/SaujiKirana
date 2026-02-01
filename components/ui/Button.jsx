import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
};

const Button = React.forwardRef(
    ({ className, variant = "default", size = "default", asChild = false, isLoading = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        // Simple variant lookup
        const variantClass = buttonVariants[variant] || buttonVariants.default;
        const sizeClass = buttonSizes[size] || buttonSizes.default;

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    variantClass,
                    sizeClass,
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button };
