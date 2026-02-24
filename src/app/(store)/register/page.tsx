"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            let data;
            try {
                data = await res.json();
            } catch (e) {
                toast.error("Error en la respuesta del servidor (No es JSON).");
                setLoading(false);
                return;
            }

            if (!res.ok) {
                toast.error(data.error || "Error al crear la cuenta");
                setLoading(false);
                return;
            }

            toast.success("¡Cuenta creada con éxito! Iniciando sesión...");

            // Auto-login de UX luego de registro exitoso
            await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            router.push("/");
            router.refresh();

        } catch (error) {
            console.error("Error al registrar:", error);
            toast.error("Error de conexión: " + (error instanceof Error ? error.message : "Desconocido"));
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
            <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-50">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Únete a nosotros</h2>
                    <p className="text-gray-500 font-medium">Crea tu cuenta en segundos</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
                            placeholder="Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
                            placeholder="juan@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 h-16 flex items-center justify-center text-lg shadow-md shadow-blue-100"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Registrarme Ahora"
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-400 font-medium text-sm">
                        ¿Ya eres miembro?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
