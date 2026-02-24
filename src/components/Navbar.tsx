"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
    const { items } = useCartStore();
    const { data: session } = useSession();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter hover:text-blue-600 transition-colors">
                        SaaS Store
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Inicio</Link>
                        <Link href="/categories" className="hover:text-blue-600">Categorías</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            {session.user?.role === "ADMIN" && (
                                <Link href="/admin" className="text-sm font-medium text-red-600 hover:text-red-700">
                                    Panel Admin
                                </Link>
                            )}
                            <Link href="/account" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                                Mi Cuenta
                            </Link>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 hidden sm:inline">Hola, {session.user?.name || "Usuario"}</span>
                                <button onClick={() => signOut()} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Salir
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="text-sm font-semibold px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-sm">
                            Iniciar Sesión
                        </Link>
                    )}

                    {/* Cart Drawer Trigger */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        🛒
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
}
