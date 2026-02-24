import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Validacion asincrona de servidor fuerte por si acaso algo salta el middleware
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Fijo Lateral */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link href="/admin" className="text-xl font-bold tracking-tight text-gray-900">
                        Store Admin Panel
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-900"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                        Módulo Productos
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                        Módulo Categorías
                    </Link>
                    <Link
                        href="/admin/sales"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                        Ventas / Órdenes
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                        Configuración Sitio
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                        Volver a la Tienda
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header Admin (Optional implementation) */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 md:hidden">
                    <span className="font-bold">Admin Panel</span>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
