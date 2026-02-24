import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Footer() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: 1 }
    });

    if (!settings) return null;

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase">SaaS Store</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            La mejor plantilla para tu próximo gran proyecto de comercio electrónico.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Navegación</h4>
                        <ul className="space-y-4 text-sm text-gray-600 font-medium">
                            <li><Link href="/" className="hover:text-black transition-colors">Inicio</Link></li>
                            <li><Link href="/categories" className="hover:text-black transition-colors">Categorías</Link></li>
                            <li><Link href="/login" className="hover:text-black transition-colors">Mi Cuenta</Link></li>
                        </ul>
                    </div>

                    {/* Contacto Dinámico */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Contacto</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {settings.contactPhone && (
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400">Teléfono</p>
                                    <p className="text-sm font-bold text-gray-800">{settings.contactPhone}</p>
                                </div>
                            )}
                            {settings.contactEmail && (
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400">Email</p>
                                    <p className="text-sm font-bold text-gray-800">{settings.contactEmail}</p>
                                </div>
                            )}
                            {settings.contactAddress && (
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-[10px] uppercase font-black text-gray-400">Dirección</p>
                                    <p className="text-sm font-bold text-gray-800">{settings.contactAddress}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 font-medium">
                        © {new Date().getFullYear()} SaaS E-commerce. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        {/* Placeholders para métodos de pago */}
                        <span className="text-xl">💳</span>
                        <span className="text-xl">🏦</span>
                        <span className="text-xl">📦</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
