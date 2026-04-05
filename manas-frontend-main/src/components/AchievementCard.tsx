'use client';

import { AchievementCardType } from '@/types/cards';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { Card, CardContent } from './ui/card';

interface AchievementCardProps {
    achievement: AchievementCardType;
    index: number;
}

export default function AchievementCard({ achievement, index }: AchievementCardProps) {
    const { ref, isInView } = useInView(0.3);
    const numericValue = parseInt(achievement.number.replace(/\D/g, '')) || 0;
    const count = useCountUp(numericValue, 2000, isInView);
    const suffix = achievement.number.replace(/[\d,]/g, '');

    return (
        <Card
            ref={ref}
            className={`group relative rounded-[2rem] p-10 bg-white border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-2 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative z-10 p-0">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-primary">{achievement.icon}</div>
                <div className="text-5xl font-bold font-display text-slate-900">
                    {count.toLocaleString()}{suffix}
                </div>
                <div className="mt-4 text-lg font-semibold text-slate-800">{achievement.title}</div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{achievement.description}</p>
            </CardContent>
        </Card>
    );
}
