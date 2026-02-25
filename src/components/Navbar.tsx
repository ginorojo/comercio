"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavbarProps = {
    categories?: {
        id: string;
        name: string;
        products: {
            id: string;
            title: string;
        }[];
    }[];
};

export default function Navbar({ categories = [] }: NavbarProps) {
    const { items, getTotal, clearCart } = useCartStore();
    const { data: session } = useSession();
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const pathname = usePathname();
    const [showPreview, setShowPreview] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const prevTotalItems = useRef(totalItems);
    const [isInitialized, setIsInitialized] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setIsInitialized(true), 500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (isInitialized && totalItems > prevTotalItems.current && pathname !== '/cart') {
            setShowPreview(true);
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = setTimeout(() => setShowPreview(false), 4000);
        }
        prevTotalItems.current = totalItems;
    }, [totalItems, isInitialized, pathname]);

    const handleMouseEnter = () => {
        if (pathname === '/cart') return;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setShowPreview(true);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setShowPreview(false);
        }, 350); // Mantiene el modal visible por 350ms para permitir mover el mouse
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>

                    <Link href="/" className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity">
                        SaaS Store
                    </Link>
                    <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100/80 shadow-inner">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${pathname === '/' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100/80'}`}
                        >
                            Inicio
                        </Link>
                        {categories.map((category) => {
                            const isActive = pathname === `/category/${category.id}`;
                            return (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.id}`}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100/80'}`}
                                >
                                    {category.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <div className="flex items-center gap-3">
                                {session.user?.role === "ADMIN" && (
                                    <Link href="/admin" className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5">
                                        Panel Admin
                                    </Link>
                                )}

                                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-100 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm transition-all text-left">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 leading-tight">Hola, {session.user?.name || "Usuario"}</span>
                                        <Link href="/account" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-0.5 inline-block">
                                            Mi Cuenta / Pedidos
                                        </Link>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 mx-1"></div>
                                    <button
                                        onClick={() => {
                                            clearCart();
                                            signOut();
                                        }}
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center"
                                        title="Cerrar sesión"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>

                    {/* Cart Trigger with Dropdown Preview */}
                    <div className="relative ml-1">
                        <Link
                            href="/cart"
                            className="relative flex items-center justify-center w-11 h-11 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-gray-100 shadow-sm hover:shadow-md"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-blue-600 border-2 border-white rounded-full shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Cart Preview Dropdown */}
                        {showPreview && items.length > 0 && pathname !== '/cart' && (
                            <div
                                className="absolute top-full right-[-10px] md:right-0 mt-3 w-[85vw] md:w-80 max-w-sm bg-white border border-gray-100 rounded-2xl shadow-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center backdrop-blur-md">
                                    <h3 className="font-semibold text-gray-900">Carrito actualizado</h3>
                                    <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{totalItems} productos</span>
                                </div>
                                <div className="max-h-[50vh] overflow-y-auto p-4 space-y-4">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-white shadow-sm">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                                <div className="flex justify-between items-center mt-1.5">
                                                    <span className="text-xs font-medium text-gray-500">Cant: {item.quantity}</span>
                                                    <span className="text-sm font-extrabold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-100 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-500">Total a pagar:</span>
                                        <span className="font-black text-lg text-gray-900">${getTotal().toFixed(2)}</span>
                                    </div>
                                    <Link
                                        href="/cart"
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-md shadow-blue-600/20 text-sm"
                                        onClick={() => setShowPreview(false)}
                                    >
                                        Ver Carrito Completo
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 space-y-4">
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            {categories.map((category) => {
                                const isActive = pathname === `/category/${category.id}`;
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.id}`}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="h-px w-full bg-gray-100 my-2"></div>

                        {session ? (
                            <div className="flex flex-col gap-3">
                                {session.user?.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="w-full px-4 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-md shadow-red-500/20"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Panel Admin
                                    </Link>
                                )}

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">Hola, {session.user?.name || "Usuario"}</span>
                                        <Link
                                            href="/account"
                                            className="text-xs font-semibold text-blue-600 mt-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Mi Cuenta / Pedidos
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => {
                                            clearCart();
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="w-full flex justify-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/30"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
