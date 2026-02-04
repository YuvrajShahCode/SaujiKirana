"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    // Cart Structure: { shopId: number, items: [] }
    const [cart, setCart] = useState({ shopId: null, items: [] });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("sauji_cart");
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("sauji_cart", JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (product, shopId, quantity = 1) => {
        // 1. Check Shop Conflict
        if (cart.shopId && cart.shopId !== shopId && cart.items.length > 0) {
            return {
                success: false,
                error: "Cart contains items from another shop. Clear cart to add items from this shop."
            };
        }

        setCart((prev) => {
            const existingItemIndex = prev.items.findIndex((item) => item.product.id === product.id);
            let newItems = [...prev.items];

            if (existingItemIndex > -1) {
                // Update quantity
                newItems[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                newItems.push({ product, quantity });
            }

            return {
                shopId: shopId,
                items: newItems
            };
        });

        return { success: true };
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const newItems = prev.items.filter((item) => item.product.id !== productId);
            return {
                shopId: newItems.length === 0 ? null : prev.shopId,
                items: newItems
            };
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) => {
            const newItems = prev.items.map(item => {
                if (item.product.id === productId) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            });
            return { ...prev, items: newItems };
        });
    };

    const clearCart = () => {
        setCart({ shopId: null, items: [] });
    };

    const cartTotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
