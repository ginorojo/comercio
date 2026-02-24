"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("¡Inicio de sesión exitoso!");
                router.push("/");
                router.refresh(); // Para refrescar la sesión en el Navbar
            }
        } catch (error) {
            toast.error("Error al intentar iniciar sesión.");
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Bienvenido</h2>
                <p className="text-center text-gray-500 mb-8">Ingresa tus credenciales para continuar</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600 mb-2">¿Nuevo por aquí?</p>
                    <Link href="/register" className="inline-block w-full py-3 px-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm">
                        Crear una cuenta nueva
                    </Link>
                </div>
            </div>
        </div>
    );
}
