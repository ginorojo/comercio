import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Traer historial de este único usuario (solo pedidos pagados)
    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
            status: "PAID"
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                            Mi Cuenta
                        </h1>
                        <p className="text-gray-500 text-lg font-medium">
                            Hola, <span className="text-black font-bold">{session.user.name}</span>. Revisa tus pedidos y actividad.
                        </p>
                    </div>
                    <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {session.user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400">Email registrado</p>
                            <p className="text-sm font-bold text-gray-800">{session.user.email}</p>
                        </div>
                    </div>
                </header>

                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Historial de Pedidos</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {orders.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-16 text-center space-y-4">
                                <div className="text-5xl">📦</div>
                                <p className="text-xl font-bold text-gray-900">Aún no tienes pedidos registrados.</p>
                                <p className="text-gray-500 max-w-xs mx-auto text-sm">Cuando realices tu primera compra, aparecerá aquí con todos sus detalles y estado de envío.</p>
                                <Link href="/" className="inline-block mt-4 px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-all">
                                    Ir a la tienda
                                </Link>
                            </div>
                        ) : (
                            orders.map((order: any) => {
                                // Asegurarnos de que items sea un array antes de procesar
                                const items = Array.isArray(order.items) ? (order.items as Array<any>) : [];

                                return (
                                    <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                        {/* Barra superior del pedido */}
                                        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">ID Pedido</p>
                                                    <p className="font-mono text-sm font-bold text-blue-600">#{order.id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Fecha de Compra</p>
                                                    <p className="text-sm font-bold text-gray-800">
                                                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Pagado</p>
                                                    <p className="text-xl font-black text-gray-900">${Number(order.total).toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <span
                                                        className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === "PAID"
                                                            ? "bg-green-100 text-green-700"
                                                            : order.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {order.status === 'PAID' ? 'Completado' :
                                                            order.status === 'PENDING' ? 'Pago Pendiente' : 'Fallido'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detalle de productos */}
                                        <div className="p-8">
                                            <div className="space-y-4">
                                                {items.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xs">
                                                                {item.quantity}x
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-tight">{item.title}</h4>
                                                                <p className="text-xs text-gray-400 font-medium">${Number(item.price).toFixed(2)} c/u</p>
                                                            </div>
                                                        </div>
                                                        <div className="font-black text-gray-900">
                                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
