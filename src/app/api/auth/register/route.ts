import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Identificar si debemos hacerlo ADMIN (Si es el primer usuario en registrarse)
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? "ADMIN" : "CUSTOMER";

        // Crear el usuario en la BD
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role,
            },
        });

        return NextResponse.json(
            { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al registrar:", error);
        return NextResponse.json({ error: "Ocurrió un error en el servidor" }, { status: 500 });
    }
}
