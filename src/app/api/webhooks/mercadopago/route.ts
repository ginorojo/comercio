import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Webhook type general de mercadopago `payment` o verificación a nivel de action
        if (body.type === "payment" || body.action === "payment.created") {
            const paymentId = body.data.id;

            // Consultar la API de Mercado Pago validando la legitimidad
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener la info del pago");
            }

            const payment = await response.json();

            // Si el pago está aprobado
            if (payment.status === "approved") {
                const orderId = payment.external_reference; // Recuperado de las preferencias armadas

                if (orderId) {
                    const order = await prisma.order.findUnique({ where: { id: orderId } });

                    if (order && order.status !== "PAID") {
                        // 1. Cambiar Order a PAID
                        await prisma.order.update({
                            where: { id: orderId },
                            data: { status: "PAID" }
                        });

                        // 2. Restar la cantidad del stock de cada Product
                        // tipando los items tal cual se guardan: { productId, quantity, price, title }
                        const items = order.items as Array<{ productId: string, quantity: number }>;

                        // Recorremos los items de la orden y restamos de forma atómica su cantidad en stock
                        for (const item of items) {
                            await prisma.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: {
                                        decrement: item.quantity
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }

        // MP requiere siempre responder un Success (200 o 201) rápidamente para que deje de enviar el evento
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
