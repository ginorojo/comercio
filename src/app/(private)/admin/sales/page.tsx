import prisma from "@/lib/prisma";

export default async function AdminSalesPage() {
    const orders = await prisma.order.findMany({
        where: { status: "PAID" },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Módulo de Ventas y Órdenes</h1>
            <p className="text-gray-500 mb-8 max-w-2xl">
                Monitor general de todas las transacciones generadas en la plataforma. Los estados son administrados automáticamente por el Webhook de Mercado Pago.
            </p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">ID Orden</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4 text-center">Fecha</th>
                                <th className="px-6 py-4 text-center">Estado de Pago</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any) => (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-blue-600">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900 line-clamp-1">{order.user.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{order.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`font-semibold px-2.5 py-1 rounded-md text-xs tracking-wider uppercase ${order.status === "PAID" ? "bg-green-100 text-green-800" :
                                                order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-gray-900 text-right tabular-nums text-lg">
                                        ${order.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 font-bold text-gray-500 text-lg">
                                        No hay ventas en la base de datos todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
