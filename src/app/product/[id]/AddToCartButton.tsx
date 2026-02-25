"use client";

import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
// import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
    const { addItem } = useCartStore();

    const handleAddToCart = () => {
        addItem(
            {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1, // Start with 1 when adding from grid
                stock: product.stock,
            },
            1
        );
        toast.success(`${product.title} añadido al carrito`, {
            description: `Tienes productos agregados en tu bolsa.`,
        });
    };

    return (
        <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
            <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Añadir a la bolsa
            </span>
        </button>
    );
}
