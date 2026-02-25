import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/product/[id]/AddToCartButton";
import ProductFilters from "@/components/ProductFilters";

export default async function HomePage({ searchParams }: { searchParams: { q?: string; sort?: string } }) {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }) || {
        heroTitle: "Bienvenido a Nuestra Tienda",
        heroSubtitle: "Descubre nuestros mejores productos",
        heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80",
        carouselImages: [],
    };

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

    const categories = await prisma.category.findMany({
        include: {
            products: {
                where: productWhere,
                orderBy: productOrderBy,
                take: 8,
            }
        }
    });

    return (
        <main className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src={settings.heroImage}
                    alt="Hero Image"
                    fill
                    className="object-cover scale-105 animate-in fade-in duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <span className="mb-4 inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold tracking-wider text-white border border-white/30 uppercase">
                        LO MEJOR PARA TU PELUDO
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight drop-shadow-lg">
                        {settings.heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-200 mb-8 max-w-2xl drop-shadow-md">
                        {settings.heroSubtitle}
                    </p>
                    <Link href="#secciones" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                        Explorar Ahora
                    </Link>
                </div>
            </section>

            <div id="secciones" className="container mx-auto px-4 mt-8">
                <ProductFilters />
            </div>

            {/* Dynamic Sections by Category */}
            {categories.map((category, index) => {
                if (category.products.length === 0) return null;
                const isEven = index % 2 === 0;

                return (
                    <section key={category.id} className={`py-12 ${isEven ? 'bg-white' : 'bg-gray-50/80'}`}>
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 pb-4">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                        {category.name}
                                    </h2>
                                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mt-4 rounded-full"></div>
                                </div>
                                <Link href={`/category/${category.id}`} className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600 transition-colors group mt-6 md:mt-0">
                                    Ver toda la sección
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {category.products.map((product: any) => (
                                    <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                        <Link href={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                        </Link>
                                        <div className="p-5 flex flex-col flex-1">
                                            <Link href={`/product/${product.id}`} className="block mb-2">
                                                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">{product.title}</h3>
                                            </Link>
                                            <div className="flex items-end justify-between mt-auto pt-4">
                                                <p className="text-2xl font-black text-blue-600">${product.price.toFixed(2)}</p>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ver más</span>
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                                <AddToCartButton product={product} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center md:hidden">
                                <Link href={`/category/${category.id}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600 transition-colors">
                                    Ver toda la sección <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        </div>
                    </section>
                );
            })}

            {categories.every(cat => cat.products.length === 0) && (
                <section className="container mx-auto px-4 py-24 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h2>
                    <p className="text-gray-500 max-w-md mx-auto">No hay productos que coincidan con la búsqueda o el catálogo está vacío.</p>
                </section>
            )}
        </main>
    );
}
