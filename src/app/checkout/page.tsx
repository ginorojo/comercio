"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, Lock, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

function CheckoutContent() {
    const router = useRouter();
    const { status } = useSession();
    const { getTotal, clearCart } = useCartStore();
    const [submitting, setSubmitting] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/cart");
            toast.error("Debes iniciar sesión para proceder al pago");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simular un retraso de pago en lugar de conectarnos a Mercado Pago
        setTimeout(() => {
            setSubmitting(false);
            toast.success("Pago simulado exitosamente (Modo Prueba)");
            clearCart();
            router.push("/account?status=success");
        }, 2000);
    };

    if (!mounted || status === "loading") {
        return (
            <div className="flex items-center justify-center min-vh-screen py-24 text-gray-500 flex-col gap-4">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="font-medium animate-pulse">Cargando pasarela de pago segura...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors bg-white text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Finalizar Compra</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Pago seguro (Modo de demostración)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Pago Simulado */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            Ingresa los datos de pago
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Tarjeta
                                </label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vencimiento (MM/AA)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código de Seguridad (CVC)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Titular
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nombre completo..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-md shadow-blue-600/20 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Procesando pago...</span>
                                    </>
                                ) : (
                                    <span>Pagar ${getTotal().toFixed(2)}</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-sm">
                            <strong>Aviso importante:</strong> La integración real con Mercado Pago está deshabilitada temporalmente. Al pulsar el botón de pago se simulará una compra exitosa para que veas el flujo de la aplicación.
                        </p>
                    </div>
                </div>

                {/* Resumen Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl sticky top-24">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            Resumen de Pago
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-300 text-sm">
                                <span>Subtotal</span>
                                <span>${getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300 text-sm">
                                <span>Envío</span>
                                <span className="text-green-400 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between text-gray-300 text-sm">
                                <span>Impuestos</span>
                                <span className="text-gray-400">Incluidos</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700/50 mb-6 flex justify-between items-center">
                            <span className="font-semibold text-lg">Total a pagar</span>
                            <span className="text-2xl font-black text-blue-400">
                                ${getTotal().toFixed(2)}
                            </span>
                        </div>

                        <div className="bg-gray-800/50 rounded-2xl p-4 flex items-start gap-3 border border-gray-700/50">
                            <ShieldCheck className="w-10 h-10 text-green-500 flex-shrink-0" />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Tienes la garantía de <strong>nuestra tienda</strong>.
                                Tu transacción está en un entorno simulado y protegido.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen text-gray-500 flex-col gap-4">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="font-medium animate-pulse">Cargando pasarela de pago segura...</p>
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
