import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
// Asumimos que hay un componente cliente AddToCartButton que usa Zustand
import AddToCartButton from "./AddToCartButton";

interface PageProps {
    // En Next.js 14+ / App Router, los params en rutas dinámicas pueden manejarse directamente así:
    params: { id: string };
}

// 1. Generación Dinámica de Metadata (SEO y OpenGraph)
export async function generateMetadata({ params }: PageProps) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    });

    if (!product) {
        return { title: "Producto no encontrado | SaaS Tienda" };
    }

    return {
        title: `${product.title} | SaaS Tienda`,
        description: product.description,
        openGraph: {
            images: [product.image],
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    // 2. Carga de datos directa en el Server Component
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    });

    // Si el producto no existe o fue "ocultado" por el Admin (isActive: false)
    if (!product || !product.isActive) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Imagen del producto */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        priority /* Para Largest Contentful Paint (SEO) */
                    />
                </div>

                {/* Detalles del Producto */}
                <div className="flex flex-col justify-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        {product.title}
                    </h1>
                    <p className="text-2xl font-semibold text-blue-600">
                        ${product.price.toFixed(2)}
                    </p>
                    <div className="prose prose-sm text-gray-600">
                        <p>{product.description}</p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                            Disponibilidad: {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
                        </p>

                        {product.stock > 0 ? (
                            /* Componente cliente para interactuar con Zustand */
                            <AddToCartButton product={product} />
                        ) : (
                            <div className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg text-center font-semibold cursor-not-allowed">
                                Sin Stock
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
