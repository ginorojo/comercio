import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/product/[id]/AddToCartButton";

export default async function HomePage() {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }) || {
        heroTitle: "Bienvenido a Nuestra Tienda",
        heroSubtitle: "Descubre nuestros mejores productos",
        heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80",
        carouselImages: [],
    };

    const products = await prisma.product.findMany({
        where: { isActive: true },
        take: 12,
    });

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full flex items-center justify-center">
                <Image
                    src={settings.heroImage}
                    alt="Hero Image"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                        {settings.heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl font-light">
                        {settings.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Catálogo */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Catálogo de Productos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product: any) => (
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
                                    <AddToCartButton product={product} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {products.length === 0 && (
                    <p className="text-center text-gray-500">No hay productos disponibles por el momento.</p>
                )}
            </section>
        </main>
    );
}
