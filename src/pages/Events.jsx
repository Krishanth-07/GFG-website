import React, { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Users, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const EVENT_STORAGE_KEY = 'gfg_events_registration_v1';

const eventsData = [
  {
    id: 1,
    title: 'Geek-a-Thon 2024',
    type: 'Hackathon',
    date: 'April 15-16, 2024',
    time: '48 Hours',
    location: 'Main Auditorium',
    description: 'Our flagship annual hackathon. Build innovative solutions, win amazing prizes, and get a chance to be featured on GeeksforGeeks.',
    participants: 150,
    registrationOpen: true,
  },
  {
    id: 2,
    title: 'DSA Weekly Contest #45',
    type: 'Coding Contest',
    date: 'March 20, 2024',
    time: '2:00 PM - 4:00 PM',
    location: 'Online (GfG Practice)',
    description: 'Test your algorithmic skills in this week\'s competitive programming contest. Open to all skill levels.',
    participants: 320,
    registrationOpen: true,
  },
  {
    id: 3,
    title: 'Web Dev Zero to Hero',
    type: 'Workshop',
    date: 'March 25, 2024',
    time: '5:00 PM - 7:00 PM',
    location: 'Lab 3, CS Block',
    description: 'A hands-on workshop covering React, Tailwind CSS, and Node.js. Build a full-stack project from scratch.',
    participants: 60,
    registrationOpen: false,
  }
];

const EventCard = ({ event, isRegistered, onRegister }) => (
  <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6 transition-transform hover:-translate-y-1">
    <div className="mb-5 flex items-start justify-between gap-3">
      <span className={`rounded-full border-[3px] border-black px-3 py-1 text-xs font-black uppercase ${
          event.type === 'Hackathon' ? 'bg-[var(--color-comic-purple)] text-white' :
          event.type === 'Coding Contest' ? 'bg-[var(--color-comic-cyan)] text-black' :
          'bg-[#4de27a] text-black'
        }`}>
          {event.type}
        </span>
        <div className="flex items-center gap-1 text-sm font-extrabold text-black">
          <Users size={14} />
          {event.participants}+
        </div>
      </div>

      <h3 className="display-comic text-2xl leading-tight text-black">
        {event.title}
      </h3>

      <p className="mt-3 min-h-16 text-base font-bold leading-snug text-black/85">
        {event.description}
      </p>

      <div className="my-6 space-y-2 rounded-2xl border-[3px] border-black bg-[var(--color-comic-yellow)] p-4">
        <div className="flex items-center gap-3 text-sm font-black text-black">
          <Calendar size={16} />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-black text-black">
          <Clock size={16} />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-black text-black">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
      </div>

      <button
        onClick={() => onRegister(event.id)}
        className={`comic-outline-soft w-full rounded-xl py-3 text-base font-black flex items-center justify-center gap-2 ${
          event.registrationOpen && !isRegistered
            ? 'bg-[var(--color-comic-red)] text-white'
            : isRegistered
            ? 'bg-[var(--color-comic-purple)] text-white'
            : 'bg-slate-300 text-slate-600 cursor-not-allowed'
        }`}
        disabled={!event.registrationOpen || isRegistered}
      >
        {isRegistered ? (
          'Registered'
        ) : event.registrationOpen ? (
          <>
            Register Now
            <ExternalLink size={18} />
          </>
        ) : 'Registration Closed'}
      </button>
  </div>
);

const Events = () => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [registrations, setRegistrations] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const eventTypes = useMemo(() => {
    return ['All', ...new Set(eventsData.map((event) => event.type))];
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesType = typeFilter === 'All' || event.type === typeFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [query, typeFilter]);

  const registeredCount = useMemo(() => {
    return Object.values(registrations).filter(Boolean).length;
  }, [registrations]);

  const handleRegister = (eventId) => {
    setRegistrations((prev) => {
      const next = { ...prev, [eventId]: true };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl relative">
        <div className="comic-star left-6 top-4 hidden md:flex" />
        <div className="comic-star right-8 top-16 flex" />
        <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-purple)] p-8 text-[var(--color-comic-cream)] shadow-[8px_8px_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="display-comic text-4xl leading-[0.95] md:text-5xl">Upcoming Events</h1>
              <p className="mt-3 max-w-3xl text-lg font-extrabold">
                Join hackathons, coding contests, and workshops. Pick your mission and launch your next skill jump.
              </p>
            </div>
            <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-cream)] px-4 py-3 text-black">
              <Sparkles size={18} />
              <span className="font-black">{registeredCount} event(s) registered</span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, location, or keyword"
            className="rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`rounded-xl border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  typeFilter === type
                    ? 'bg-[var(--color-comic-red)] text-white'
                    : 'bg-[var(--color-comic-yellow)] text-black'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event, idx) => (
            <ScrollReveal key={event.id} delay={idx * 130}>
              <EventCard
                event={event}
                isRegistered={Boolean(registrations[event.id])}
                onRegister={handleRegister}
              />
            </ScrollReveal>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="mt-6 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-6 text-center text-sm font-black">
            No events match your current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
