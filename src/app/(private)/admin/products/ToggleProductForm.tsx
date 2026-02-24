"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { toggleProductVisibility } from "./actions";

export default function ToggleProductForm({ id, isActive }: { id: string, isActive: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            try {
                await toggleProductVisibility(id, !isActive);
                toast.success(isActive ? "Producto oculto" : "Producto visible en tienda");
            } catch (error) {
                toast.error("Ocurrió un error al cambiar estado");
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border transition-colors ${isActive
                    ? "bg-white border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    : "bg-blue-600 border-transparent text-white hover:bg-blue-700 disabled:opacity-50"
                }`}
        >
            {isPending ? "Procesando..." : isActive ? "Ocultar" : "Mostrar"}
        </button>
    );
}
