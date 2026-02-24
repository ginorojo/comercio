import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Así es como Next.js App Router (v13.2+) implementa Route Handlers.
// Se pasa el authOptions centralizado que definimos en "src/lib/auth.ts".
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
