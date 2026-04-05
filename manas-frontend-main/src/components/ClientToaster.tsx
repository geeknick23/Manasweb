'use client';

import { Toaster as SonnerToaster } from 'sonner';

export default function ClientToaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: '#fdf4f3',
                    border: '1px solid #fad5d1',
                    color: '#752e26',
                },
            }}
        />
    );
}
