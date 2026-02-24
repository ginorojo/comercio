import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
    const [totalProducts, totalCategories, totalOrders, soldAmountRaw] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: "PAID" },
        }),
    ]);

    const soldAmount = soldAmountRaw._sum.total || 0;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Resumen General
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ventas Totales"
                    value={`$${soldAmount.toFixed(2)}`}
                    desc="Ganancias en órdenes cobradas"
                    color="bg-green-50"
                    textColor="text-green-700"
                />
                <StatCard
                    title="Órdenes (Todas)"
                    value={totalOrders}
                    desc="Ventas globales"
                    color="bg-blue-50"
                    textColor="text-blue-700"
                />
                <StatCard
                    title="Productos Activos"
                    value={totalProducts}
                    desc="Inventario en BD"
                    color="bg-orange-50"
                    textColor="text-orange-700"
                />
                <StatCard
                    title="Categorías"
                    value={totalCategories}
                    desc="Máximo 5 permitidas"
                    color="bg-purple-50"
                    textColor="text-purple-700"
                />
            </div>

            {/* Acciones Rápidas */}
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mt-12 mb-6">
                Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <QuickActionLink
                    href="/admin/products"
                    title="Agregar Producto"
                    desc="Sube fotos a Cloudinary y añade stock"
                />
                <QuickActionLink
                    href="/admin/settings"
                    title="Editar Diseño"
                    desc="Cambia el Hero global y el carrusel principal"
                />
                <QuickActionLink
                    href="/admin/sales"
                    title="Revisar Ventas"
                    desc="Mira el estado (Pagado o Falso) de las órdenes"
                />
            </div>
        </div>
    );
}

// Subcomponentes funcionales minificados sin uso de librerías extra
function StatCard({ title, value, desc, color, textColor }: any) {
    return (
        <div className={`${color} p-6 rounded-xl border border-white space-y-2 shadow-sm`}>
            <h3 className={`text-sm font-medium ${textColor} opacity-80 uppercase tracking-widest`}>
                {title}
            </h3>
            <p className={`text-4xl font-black ${textColor}`}>{value}</p>
            <p className={`text-sm ${textColor} opacity-70`}>{desc}</p>
        </div>
    );
}

function QuickActionLink({ href, title, desc }: any) {
    return (
        <Link href={href}>
            <div className="bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
            </div>
        </Link>
    );
}
