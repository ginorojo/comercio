"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsForm({ settings, updateAction }: { settings: any, updateAction: (formData: FormData) => Promise<any> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            const result = await updateAction(formData);
            if (result?.success) {
                toast.success("¡Diseño del sitio actualizado correctamente!");
                router.refresh();
            } else if (result?.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado al guardar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <input type="hidden" name="currentHeroImage" value={settings.heroImage} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Columna Izquierda: Textos */}
                <div className="space-y-8">
                    <div className="border-l-4 border-blue-600 pl-4 py-1">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Banner Principal (Hero)</h3>
                        <p className="text-sm text-gray-500">Configura los mensajes de bienvenida del sitio.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Título H1</label>
                            <input
                                required
                                name="heroTitle"
                                defaultValue={settings.heroTitle}
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Subtítulo Descriptivo</label>
                            <textarea
                                required
                                name="heroSubtitle"
                                defaultValue={settings.heroSubtitle}
                                rows={4}
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Imagen */}
                <div className="space-y-8">
                    <div className="border-l-4 border-purple-600 pl-4 py-1">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Identidad Visual</h3>
                        <p className="text-sm text-gray-500">Sube una imagen de alto impacto.</p>
                    </div>

                    <div className="relative group">
                        <div className="aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={settings.heroImage}
                                alt="Hero preview"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="px-6 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-black shadow-xl">Cambiar Imagen</span>
                            </div>
                            <input
                                type="file"
                                name="heroImageFile"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <p className="mt-3 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Resolución sugerida: 1920x1080 (Máx 2MB)</p>
                    </div>
                </div>
            </div>

            {/* Datos Corporativos */}
            <div className="pt-10 mt-10 border-t border-gray-100">
                <div className="mb-8">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Información de Contacto</h3>
                    <p className="text-sm text-gray-500">Estos datos aparecerán en el pie de página de la tienda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-1">Teléfono</label>
                        <input
                            name="contactPhone"
                            defaultValue={settings.contactPhone ?? ""}
                            className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                            placeholder="+54 11 1234 5678"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-1">Email</label>
                        <input
                            name="contactEmail"
                            defaultValue={settings.contactEmail ?? ""}
                            className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                            placeholder="contacto@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-1">Dirección Física</label>
                        <input
                            name="contactAddress"
                            defaultValue={settings.contactAddress ?? ""}
                            className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                            placeholder="Calle Ficticia 123"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-5 bg-black text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando Cambios...
                        </>
                    ) : (
                        "Publicar Actualización"
                    )}
                </button>
            </div>
        </form>
    );
}
