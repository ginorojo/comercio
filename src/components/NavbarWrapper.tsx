import prisma from "@/lib/prisma";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
    const categories = await prisma.category.findMany({
        include: {
            products: true,
        },
    });

    return <Navbar categories={categories} />;
}
