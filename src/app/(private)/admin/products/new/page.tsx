import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany();

    // Next.js Server Action Embebida para el form
    async function createProduct(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const desc = formData.get("description") as string;
        const priceStr = formData.get("price") as string;
        const stockStr = formData.get("stock") as string;
        const catId = formData.get("categoryId") as string;

        // --- LÓGICA DE CLOUDINARY PARA LA IMAGEN ---
        // En Next 14 App Router, formData.get de tipo "file" devuelve File / Blob.
        const file = formData.get("imageFile") as File;
        let fallbackImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff"; // Imagen placeholder por seguridad

        // Subida nativa a Cloudinary desde Server Action (requiere Next.js 14.1+ y Node >18)
        if (file && file.size > 0) {
            if (file.size > 2 * 1024 * 1024) throw new Error("La imagen supera los 2MB permitidos"); // Limitado a 2MB para producto

            const buffer = Buffer.from(await file.arrayBuffer());
            const base64Img = `data:${file.type};base64,${buffer.toString("base64")}`;

            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    file: base64Img,
                    upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default" // Asegúrate de crear este preset en Cloudinary como 'Unsigned'
                }),
            });

            if (cloudinaryResponse.ok) {
                const cRes = await cloudinaryResponse.json();
                fallbackImageUrl = cRes.secure_url;
            }
        }

        // Insertar en Base de datos
        await prisma.product.create({
            data: {
                title,
                description: desc,
                price: parseFloat(priceStr),
                stock: parseInt(stockStr, 10),
                categoryId: catId,
                image: fallbackImageUrl,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin/products");
        redirect("/admin/products");
    }

    return (
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>

            {categories.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 border border-yellow-200 rounded-lg">
                    ⚠️ Debes crear primero al menos una <Link href="/admin/categories" className="font-bold underline">Categoría</Link> antes de agregar productos.
                </div>
            ) : (
                <form action={createProduct} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Título del Producto</label>
                            <input required name="title" type="text" className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white" placeholder="Ej: Zapatillas Nike" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Precio (USD)</label>
                            <input required name="price" type="number" step="0.01" min="0" className="w-full border p-3 rounded-lg" placeholder="199.99" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Stock Inicial</label>
                            <input required name="stock" type="number" min="0" className="w-full border p-3 rounded-lg" placeholder="50" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Categoría</label>
                        <select required name="categoryId" className="w-full border p-3 rounded-lg bg-white">
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción Completa</label>
                        <textarea required name="description" rows={4} className="w-full border p-3 rounded-lg" />
                    </div>

                    {/* Área de Imagen Nativa */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <label className="cursor-pointer block">
                            <span className="text-purple-600 font-bold mb-2 block">📷 Subir Foto Primaria (Max 2MB)</span>
                            <input type="file" name="imageFile" accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </label>
                    </div>

                    <div className="flex gap-4 border-t pt-6">
                        <Link href="/admin/products" className="px-6 py-3 border font-semibold rounded-lg hover:bg-gray-50 w-full text-center">
                            Cancelar
                        </Link>
                        <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 w-full shadow border-transparent">
                            Guardar Producto en DB
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
