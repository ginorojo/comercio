import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import ToggleProductForm from "@/app/(private)/admin/products/ToggleProductForm";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Módulo de Productos</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                    + Agregar Producto ({products.length}/24)
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-md border border-gray-100 overflow-hidden">
                                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                                        </div>
                                        {product.title}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-semibold">
                                        ${Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock > 0 ? (
                                            <span className="text-green-600 font-medium">{product.stock} un.</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Agotado</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{product.category.name}</td>
                                    <td className="px-6 py-4">
                                        {product.isActive ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
                                                Público
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-200">
                                                Oculto
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <ToggleProductForm id={product.id} isActive={product.isActive} />
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No has agregado ningún producto todavía.
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
