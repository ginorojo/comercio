import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
    let settings = await prisma.siteSettings.findUnique({
        where: { id: 1 }
    });

    if (!settings) {
        // Inicializar default de forma segura
        settings = await prisma.siteSettings.create({
            data: {
                id: 1,
                heroTitle: "Bienvenido a Nuestra Tienda",
                heroSubtitle: "Descubre nuestros mejores productos al instante",
                heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
            }
        });
    }

    async function updateSettings(formData: FormData) {
        "use server";

        try {
            const heroTitle = formData.get("heroTitle") as string;
            const heroSubtitle = formData.get("heroSubtitle") as string;
            const contactPhone = formData.get("contactPhone") as string;
            const contactEmail = formData.get("contactEmail") as string;
            const contactAddress = formData.get("contactAddress") as string;

            const file = formData.get("heroImageFile") as File;
            let heroImage = formData.get("currentHeroImage") as string;

            // Subida a Cloudinary si hay archivo
            if (file && file.size > 0) {
                if (file.size > 2 * 1024 * 1024) {
                    return { error: "La imagen es muy pesada (Máx 2MB)" };
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const base64Img = `data:${file.type};base64,${buffer.toString("base64")}`;

                const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        file: base64Img,
                        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
                    }),
                });

                if (cloudRes.ok) {
                    const cRes = await cloudRes.json();
                    heroImage = cRes.secure_url;
                } else {
                    return { error: "Error al subir la imagen a Cloudinary" };
                }
            }

            // Upsert al ID 1
            await prisma.siteSettings.upsert({
                where: { id: 1 },
                create: {
                    id: 1,
                    heroTitle, heroSubtitle, heroImage, contactPhone, contactEmail, contactAddress
                },
                update: {
                    heroTitle, heroSubtitle, heroImage, contactPhone, contactEmail, contactAddress
                },
            });

            revalidatePath("/");
            revalidatePath("/admin/settings");
            return { success: true };
        } catch (error: any) {
            console.error("Error en updateSettings:", error);
            return { error: "Error en el servidor: " + error.message };
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Personalización del Sitio</h1>
                <p className="text-gray-500 mt-2 text-lg">Modifica la imagen principal, los textos de bienvenida y la información de contacto global.</p>
            </div>

            <SettingsForm settings={settings} updateAction={updateSettings} />
        </div>
    );
}
