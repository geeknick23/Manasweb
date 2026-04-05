'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import AuthProvider with SSR disabled
const AuthProvider = dynamic(
    () => import('@/context/AuthContext').then((mod) => mod.AuthProvider),
    {
        ssr: false,
        loading: () => null
    }
);

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
