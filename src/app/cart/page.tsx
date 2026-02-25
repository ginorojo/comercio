"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck, CreditCard } from "lucide-react";

export default function CartPage() {
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

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/"
                        className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors bg-white text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tu Carrito de Compras</h1>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Parece que aún no has añadido ningún producto a tu carrito. Explora nuestra tienda para encontrar lo que buscas.</p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-600/20"
                        >
                            Explorar Productos
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
                        {/* Lista de Productos */}
                        <div className="lg:col-span-8">
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <ul role="list" className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-8 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex-shrink-0 w-full sm:w-40 aspect-square sm:aspect-auto sm:h-40 border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 relative">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex flex-col sm:flex-row justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-4">
                                                    <div className="pr-0 sm:pr-6">
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            <Link href={`/product/${item.id}`}>{item.title}</Link>
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">Producto de alta calidad seleccionado especialmente para ti.</p>
                                                    </div>

                                                    <div className="text-left flex flex-col items-start sm:items-end sm:text-right">
                                                        <p className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                                        {item.stock > 0 ? (
                                                            item.stock < 3 ? (
                                                                <p className="mt-1 text-sm text-orange-500 font-medium flex items-center gap-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Quedan pocas unidades
                                                                </p>
                                                            ) : (
                                                                <p className="mt-1 text-sm text-green-600 font-medium flex items-center gap-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> En Stock
                                                                </p>
                                                            )
                                                        ) : (
                                                            <p className="mt-1 text-sm text-red-500 font-medium flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Agotado
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-6 sm:mt-4 flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden h-10">
                                                        <button
                                                            className="px-3 h-full text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-4 font-semibold text-gray-900 w-12 text-center text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="px-3 h-full text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.stock}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                        <span className="hidden sm:inline">Eliminar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Resumen de Compra */}
                        <div className="mt-8 lg:mt-0 lg:col-span-4">
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm sticky top-24">
                                <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-blue-400" /> Resumen del Pedido
                                    </h2>
                                </div>
                                <div className="p-6 sm:p-8 bg-white">
                                    <dl className="space-y-4 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <dt>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</dt>
                                            <dd className="font-medium text-gray-900">${getTotal().toFixed(2)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Costo de Envío</dt>
                                            <dd className="font-medium text-green-600">Gratis</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Impuestos</dt>
                                            <dd className="font-medium text-gray-900">Calculado al pago</dd>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg">
                                            <dt className="font-bold text-gray-900">Total</dt>
                                            <dd className="text-2xl font-extrabold text-blue-600">${getTotal().toFixed(2)}</dd>
                                        </div>
                                    </dl>

                                    <div className="mt-8">
                                        <button
                                            onClick={handleCheckout}
                                            disabled={loading}
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Procesando...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span>Proceder al pago</span>
                                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        <span>Pago 100% seguro y encriptado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
