import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Opcional: Prohibir compras sin login. Si se permite, se asigna a un user genérico o se quita esta parte.
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Necesitas iniciar sesión para comprar" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const items = body.items; // Trae el array inmutable de tu Zustand [ {id, title, price, quantity} ]

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
        }

        // 1. Calcular el Total en el backend validando desde prisma por seguridad 
        //    (nunca confiar en el price de frontend).
        let backendTotal = 0;
        const itemsParaMP = [];
        const snapshotItems = []; // Snapshot inmutable JSON para la orden

        for (const clientItem of items) {
            // Re-verificar contra BD real actual
            const realProduct = await prisma.product.findUnique({
                where: { id: clientItem.id }
            });

            if (!realProduct || realProduct.stock < clientItem.quantity || !realProduct.isActive) {
                return NextResponse.json({ error: `Conflicto de stock con: ${clientItem.title}` }, { status: 409 });
            }

            backendTotal += realProduct.price * clientItem.quantity;

            // Armar el payload específico que pide MP SDK v2+
            itemsParaMP.push({
                id: realProduct.id,
                title: realProduct.title,
                quantity: clientItem.quantity,
                unit_price: realProduct.price,
                currency_id: "USD", // o "ARS", "MXN", "CLP", lo que aplique a tu moneda
            });

            // Nuestro propio snapshot para "orden"
            snapshotItems.push({
                productId: realProduct.id,
                title: realProduct.title,
                price: realProduct.price, // guardamos a cuánto lo vendimos en este msg
                quantity: clientItem.quantity
            });
        }

        // 2. Crear la Orden Interna como Pendiente
        const nuevaOrden = await prisma.order.create({
            data: {
                userId,
                total: backendTotal,
                status: "PENDING",
                items: snapshotItems // Se guarda el JSON como foto de este momento
            }
        });

        // 3. Conectar a Mercado Pago Config Version 2
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
        const preference = new Preference(client);

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        // 4. Crear la preferencia de pago devolviendo las URLs y el ID de nuesta Orden Real
        const response = await preference.create({
            body: {
                items: itemsParaMP,
                back_urls: {
                    success: `${baseUrl}/account?status=success`,
                    failure: `${baseUrl}/cart?status=failed`,
                    pending: `${baseUrl}/account?status=pending`,
                },
                auto_return: "approved",
                external_reference: nuevaOrden.id, // VITAL: Le pasamos nuestro TransactionID. El webhook nos lo devolverá.
            }
        });

        // 5. Devolver al Front el checkout_url público de Mercado Pago
        return NextResponse.json({
            url: response.init_point,
            preferenceId: response.id,
            orderId: nuevaOrden.id
        });

    } catch (error) {
        console.error("Error validando checkout MP:", error);
        return NextResponse.json({ error: "Fallo Interno en Checkout" }, { status: 500 });
    }
}
