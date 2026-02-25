import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/product/[id]/AddToCartButton";
import { notFound } from "next/navigation";
import ProductFilters from "@/components/ProductFilters";

export default async function CategoryPage({ params, searchParams }: { params: { id: string }, searchParams: { q?: string; sort?: string } }) {
    const categoryId = params.id;

    const q = searchParams.q;
    const sort = searchParams.sort;

    const productWhere: any = { isActive: true };

    if (q) {
        productWhere.title = { contains: q, mode: "insensitive" };
    }

    let productOrderBy: any = undefined;
    if (sort === "asc" || sort === "desc") {
        productOrderBy = { price: sort };
    }

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            products: {
                where: productWhere,
                orderBy: productOrderBy
            }
        }
    });

    if (!category) {
        return notFound();
    }

    const { products } = category;

    return (
        <main className="min-h-screen bg-gray-50 pt-16 pb-16">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center text-gray-900 mt-12">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-blue-900">
                        {category.name}
                    </h1>
                    <p className="text-lg font-light text-gray-500 mb-8">
                        Explora los productos de {category.name.toLowerCase()}
                    </p>
                    <ProductFilters />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <Link href={`/product/${product.id}`}>
                                <div className="relative aspect-square">
                                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 truncate">{product.title}</h3>
                                </Link>
                                <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
                                <div className="mt-4">
                                    <AddToCartButton product={product as any} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-xl">No hay productos disponibles por el momento en esta categoría.</p>
                        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block font-medium">Volver al inicio</Link>
                    </div>
                )}
            </div>
        </main>
    );
}
