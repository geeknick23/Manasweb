'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { api, Event } from '@/services/api';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await api.getAllEvents();
                setEvents(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleRSVP = (link: string) => {
        if (link) {
            window.open(link, '_blank');
        } else {
            alert("Registration link not available yet.");
        }
    };

    return (
        <>
            <section className="pt-32 pb-16 bg-white relative overflow-hidden">
                <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-200 rounded-full blur-3xl opacity-40"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">Upcoming <span className="text-primary">Events</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join us for workshops, community gatherings, and support sessions.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 shadow-card animate-pulse h-48"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                            {events.map((event) => (
                                <div key={event._id} className="bg-white rounded-3xl p-8 shadow-card flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-primary-50 rounded-2xl text-primary-700">
                                        <span className="text-sm font-bold uppercase">{event.month}</span>
                                        <span className="text-3xl font-display font-bold">{event.day}</span>
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{event.title}</h3>

                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1.5" />
                                                {event.startTime} - {event.endTime}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1.5" />
                                                {event.location}
                                            </div>
                                        </div>

                                        <p className="text-slate-600 mb-6">{event.description}</p>

                                        <button
                                            onClick={() => handleRSVP(event.registerLink)}
                                            className="inline-flex items-center px-6 py-2.5 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-colors"
                                        >
                                            RSVP Now
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {events.length === 0 && (
                                <div className="col-span-1 lg:col-span-2 text-center py-20 bg-white rounded-3xl shadow-sm">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">No Upcoming Events</h3>
                                    <p className="text-slate-600">Check back later for new workshops and gatherings.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
