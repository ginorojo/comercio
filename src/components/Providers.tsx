"use client";

import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Toaster position="top-right" expand={false} richColors />
            {children}
        </SessionProvider>
    );
}
