import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'E-commerce SaaS',
    description: 'Plantilla base de SaaS E-commerce',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <Providers>
                    <NavbarWrapper />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
