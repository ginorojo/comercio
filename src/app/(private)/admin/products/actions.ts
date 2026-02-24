"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductVisibility(id: string, makeActive: boolean) {
    // En producción podrías revisar la sesion getServerSession para ver si es ADMIN
    await prisma.product.update({
        where: { id },
        data: { isActive: makeActive },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
}
