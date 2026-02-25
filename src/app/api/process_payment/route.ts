import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await req.json();

        // El frontend enviará orderId si ya hay una orden creada previamente.
        // Si no la hay (ejemplo, no se usa preferenceId), se puede requerir.
        const externalReference = body.orderId || "";

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
        const payment = new Payment(client);

        const requestOptions = {
            idempotencyKey: crypto.randomUUID(), // Prevent duplicate payments
        };

        const paymentData: any = {
            transaction_amount: body.transaction_amount,
            token: body.token,
            description: "Compra en tienda", // Se puede enviar desde el frontend
            installments: body.installments,
            payment_method_id: body.payment_method_id,
            issuer_id: body.issuer_id,
            payer: {
                email: body.payer.email,
                identification: body.payer.identification,
            },
            external_reference: externalReference,
        };

        const response = await payment.create({
            body: paymentData,
            requestOptions
        });

        // Si el pago es aprobado inmediatamente, podemos actualizar la orden
        if (response.status === "approved" && externalReference) {
            try {
                // Confirmamos la orden local
                await prisma.order.update({
                    where: { id: externalReference },
                    data: { status: "PAID" }
                });
                // Idealmente deberías vaciar el carrito aquí o limpiar el estado
            } catch (e) {
                console.error("Error updating order status:", e);
            }
        }

        return NextResponse.json({
            status: response.status,
            status_detail: response.status_detail,
            id: response.id,
        });

    } catch (error: any) {
        console.error("Error procesando pago con Mercado Pago:", error);
        return NextResponse.json({
            message: "Fallo al procesar pago",
            error: error?.message || "Error desconocido"
        }, { status: 500 });
    }
}
