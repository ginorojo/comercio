import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: "desc" },
    });

    const MAX_CATEGORIES = 5;
    const canAddMore = categories.length < MAX_CATEGORIES;

    async function createCategory(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;

        // Contamos nuevamente validando servidor real contra ataques de Postman
        const count = await prisma.category.count();
        if (count >= MAX_CATEGORIES) throw new Error("Límite de categorías alcanzado.");

        await prisma.category.create({ data: { name } });
        revalidatePath("/admin/categories");
        revalidatePath("/");
    }

    async function deleteCategory(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        // Se delega al motor DB restricción si tiene productos activos
        await prisma.category.delete({ where: { id } });
        revalidatePath("/admin/categories");
        revalidatePath("/");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Módulo de Categorías</h1>

            {/* Grid General */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna Izquierda: Formulario (Bloqueado si hay 5) */}
                <div className="md:col-span-1 space-y-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="font-semibold text-gray-800">Nueva Categoría</h2>
                    <p className="text-sm text-gray-500 mb-4">Puedes agregar hasta {MAX_CATEGORIES}. Actualmente: {categories.length}</p>

                    {canAddMore ? (
                        <form action={createCategory} className="space-y-4">
                            <div>
                                <input required name="name" type="text" placeholder="Ej: Electrónica" className="w-full border p-2 rounded-lg bg-gray-50 text-sm focus:bg-white" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                                + Crear Categoría
                            </button>
                        </form>
                    ) : (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
                            🚫 Has alcanzado el límite máximo de categorías ({MAX_CATEGORIES}).
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Tabla de Listados */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4 text-center">Productos Vinculados</th>
                                <th className="px-6 py-4 flex justify-end">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat: any) => (
                                <tr key={cat.id} className="border-b">
                                    <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-center font-medium tabular-nums">{cat._count.products} uni.</td>
                                    <td className="px-6 py-4 text-right">
                                        {cat._count.products === 0 ? (
                                            <form action={deleteCategory}>
                                                <input type="hidden" name="id" value={cat.id} />
                                                <button type="submit" className="text-red-500 hover:underline">Eliminar</button>
                                            </form>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic" title="No puedes borrar una categoría con productos asignados">
                                                En Uso
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        No hay categorías en el sistema.
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
