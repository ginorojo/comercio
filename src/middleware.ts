import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // Función "handler" que Next-Auth dispara después de validar el token
    function middleware(req) {
        // Protección ESTRICTA para paneles de Administración
        if (
            req.nextUrl.pathname.startsWith("/admin") &&
            req.nextauth.token?.role !== "ADMIN"
        ) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Si intenta entrar a cuenta pero no tiene sesión (NextAuth igual lo protege, es redudancia sana)
        if (
            req.nextUrl.pathname.startsWith("/account") &&
            !req.nextauth.token
        ) {
            return NextResponse.redirect(new URL("/api/auth/signin", req.url));
        }
    },
    {
        callbacks: {
            // El middleware solo entra en handler si authorized devuelve 'true'.
            // Con !!token verificamos que al menos exista un token JWT firmado.
            authorized: ({ token }) => !!token,
        },
    }
);

// Aquí definimos EXACTAMENTE qué rutas deben interceptar el middleware de NextAuth
export const config = {
    matcher: ["/admin/:path*", "/account/:path*"],
};
