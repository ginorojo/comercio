"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";

export default function CartDrawer({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const handleCheckout = async () => {
        if (!session) {
            signIn();
            return;
        }

        // Ir directamente a la página de checkout simulada por ahora
        window.location.href = `/checkout`;
    };

    if (!isOpen) return null;

    return (
        // Overlay base (Fondo oscuro borroso)
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Contenido Slide-out (Drawer) blanco */}
            <div className="w-full max-w-md h-full bg-white shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold">Tu Carrito</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <span className="text-4xl">🛒</span>
                            <p>El carrito está vacío.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                                    <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center border border-gray-200 rounded-md">
                                            <button
                                                className="px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 font-medium text-sm">{item.quantity}</span>
                                            <button
                                                className="px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 text-sm hover:underline"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer del Carrito */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-white space-y-4">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Subtotal</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Los gastos de envío e impuestos se calculan al pagar.
                        </p>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <span>Procesando...</span>
                            ) : (
                                <span>Ir a Pagar Seguro</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
