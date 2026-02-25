"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [q, setQ] = useState(searchParams.get("q") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (q) params.set("q", q);
            else params.delete("q");

            if (sort) params.set("sort", sort);
            else params.delete("sort");

            router.push(`?${params.toString()}`, { scroll: false });
        }, 300); // 300ms debounce para la búsqueda inmediata

        return () => clearTimeout(timer);
    }, [q, sort, router, searchParams]);

    const handleClear = () => {
        setQ("");
        setSort("");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 mt-4 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Filtros de Búsqueda
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="q" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del producto</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="q"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Ej. Collar para perro"
                            className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-xl outline-none focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors bg-gray-50/50 hover:border-gray-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <div className="w-full md:w-64">
                    <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-1">Ordenar por precio</label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-400 rounded-xl outline-none focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors bg-gray-50/50 hover:border-gray-500"
                    >
                        <option value="">Destacados (por defecto)</option>
                        <option value="desc">Mayor a menor precio</option>
                        <option value="asc">Menor a mayor precio</option>
                    </select>
                </div>
                <div className="flex items-end gap-2 pt-2 md:pt-0">
                    {(q || sort) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors h-[42px]"
                            title="Limpiar filtros"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
