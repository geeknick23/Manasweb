'use client';

import { SuccessStoryType } from '@/types/cards';
import { useInView } from '../hooks/useInView';
import { Card, CardContent } from './ui/card';

interface SuccessStoryCardProps {
    story: SuccessStoryType;
    index: number;
}

export default function SuccessStoryCard({ story, index }: SuccessStoryCardProps) {
    const { ref, isInView } = useInView(0.2);

    return (
        <Card
            ref={ref}
            className={`group rounded-[2rem] shadow-sm p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-2 border border-border/50 bg-white ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className="absolute top-6 right-6 text-8xl font-display text-slate-100 leading-none select-none">❝</div>
            <CardContent className="relative z-10 p-0 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-primary/20">
                        {story.author.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-lg">{story.author}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                            {story.location}
                        </p>
                    </div>
                </div>
                <p className="text-slate-700 italic leading-relaxed flex-grow text-lg">
                    &ldquo;{story.quote}&rdquo;
                </p>
            </CardContent>
        </Card>
    );
}
