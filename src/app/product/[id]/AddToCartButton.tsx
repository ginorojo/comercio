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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center transition-colors shadow-sm"
        >
            Agregar al Carrito
        </button>
    );
}
