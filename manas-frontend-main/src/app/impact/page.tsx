'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import ImpactCard from '@/components/ImpactCard';
import { ImpactCardType } from '@/types/cards';

export default function ImpactPage() {
    const [impactCards, setImpactCards] = useState<ImpactCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const cards = await api.fetchImpactCards();
                setImpactCards(cards);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <section className="pt-32 pb-16 bg-white relative overflow-hidden">
                <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-200 rounded-full blur-3xl opacity-40"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">Our Impact in <span className="text-primary">Action</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore the initiatives and programs that are transforming lives in our community.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-card h-96 animate-pulse">
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {impactCards.map((card) => (
                                <ImpactCard key={card.id} card={card} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
