import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Brain, CalendarDays, Rocket, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

/* ── Animated counter ─────────────────────────────────────── */
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const el = countRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const pct = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(pct * (2 - pct) * end));
      if (pct < 1) window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

/* ── SVG decorations ──────────────────────────────────────── */
const StarSVG = ({ className = '' }) => (
  <svg viewBox="0 0 44 44" className={`w-10 h-10 ${className}`} aria-hidden="true">
    <polygon
      points="22,2 27,17 42,17 30,27 35,42 22,32 9,42 14,27 2,17 17,17"
      fill="#fff8ea" stroke="#101010" strokeWidth="2.5" strokeLinejoin="round"
    />
  </svg>
);

const DoodleLoop = ({ className = '' }) => (
  <svg viewBox="0 0 100 46" className={`w-24 h-12 ${className}`} aria-hidden="true">
    <path
      d="M6 23c10-20 24 20 34 0s24 20 34 0 14-7 20 0"
      fill="none"
      stroke="#101010"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 28c10-20 24 20 34 0s24 20 34 0 14-7 20 0"
      fill="none"
      stroke="#06b6d4"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DoodleSpark = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" className={`w-8 h-8 ${className}`} aria-hidden="true">
    <path d="M20 4v10M20 26v10M4 20h10M26 20h10" stroke="#101010" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="20" cy="20" r="4.2" fill="#facc15" stroke="#101010" strokeWidth="2" />
  </svg>
);

const GFGMiniLogo = () => (
  <svg viewBox="0 0 59.077 29.539" className="h-8 w-16" aria-hidden="true">
    <path
      d="M193.664,1471.966H169.257a9.748,9.748,0,0,1,17.129-5.146l3.55-3.57a14.77,14.77,0,0,0-25.724,8.716h-.085a14.77,14.77,0,0,0-25.724-8.716l3.55,3.57a9.748,9.748,0,0,1,17.129,5.146H134.674q-.043.565-.044,1.141a14.771,14.771,0,0,0,29.149,3.383h.778a14.769,14.769,0,0,0,29.149-3.383Q193.708,1472.531,193.664,1471.966ZM149.4,1482.855a9.749,9.749,0,0,1-9.151-6.385h18.3A9.75,9.75,0,0,1,149.4,1482.855Zm29.538,0a9.75,9.75,0,0,1-9.152-6.385h18.3A9.75,9.75,0,0,1,178.939,1482.855Z"
      transform="translate(-134.631 -1458.338)"
      fill="#2f8d46"
    />
  </svg>
);

const PlanetSVG = ({ className = '', id = 'p' }) => (
  <svg viewBox="0 0 130 130" className={className} aria-hidden="true">
    <clipPath id={`${id}-back`}><rect x="0" y="65" width="130" height="65" /></clipPath>
    <clipPath id={`${id}-front`}><rect x="0" y="0" width="130" height="65" /></clipPath>
    <ellipse cx="65" cy="65" rx="60" ry="18" fill="var(--color-comic-yellow)" stroke="#101010" strokeWidth="3" clipPath={`url(#${id}-back)`} />
    <circle cx="65" cy="65" r="37" fill="var(--color-comic-purple)" stroke="#101010" strokeWidth="3" />
    <circle cx="51" cy="55" r="9" fill="#1e40af" stroke="#101010" strokeWidth="2" />
    <circle cx="74" cy="72" r="5.5" fill="#1e40af" stroke="#101010" strokeWidth="2" />
    <circle cx="66" cy="43" r="4" fill="#1e40af" stroke="#101010" strokeWidth="2" />
    <ellipse cx="65" cy="65" rx="60" ry="18" fill="var(--color-comic-yellow)" stroke="#101010" strokeWidth="3" clipPath={`url(#${id}-front)`} />
  </svg>
);

/* ── Slide data ───────────────────────────────────────────── */
const slides = [
  {
    sub: 'Campus special',
    label1: 'GFG ORBIT',
    label2: 'LAB',
    headline: ['BIGGER THAN', 'BUGS.', 'SHARPER THAN', 'A CONTEST.'],
    body: [
      'Build coding confidence with weekly events, practical resources, and project-first learning.',
      'Compete with your campus crew, track growth, and move faster with a clear roadmap.',
    ],
    primary: { label: 'Explore events', to: '/events' },
    secondary: { label: 'Open resources', to: '/resources' },
  },
  {
    sub: 'Happening this week',
    label1: 'EVENT',
    label2: 'ORBIT',
    headline: ['CONTESTS.', 'WORKSHOPS.', 'ONE PLACE.', 'YOUR CAMPUS.'],
    body: [
      'Hackathons, coding relays, and speaker sessions — something runs every week in your orbit.',
      'Each event earns you points and builds your profile. Show up and move up.',
    ],
    primary: { label: 'See all events', to: '/events' },
    secondary: { label: 'Leaderboard', to: '/leaderboard' },
  },
  {
    sub: 'Free for members',
    label1: 'RESOURCE',
    label2: 'BAY',
    headline: ['DSA SHEETS.', 'ROADMAPS.', 'MADE BY', 'YOUR PEERS.'],
    body: [
      'Curated topic-wise sheets, video picks, and peer notes that cut prep time in half.',
      'Community-driven and always updated — exactly what you need for your next coding round.',
    ],
    primary: { label: 'Open resources', to: '/resources' },
    secondary: { label: 'Join the club', to: '/contact' },
  },
];

/* ── Home page ────────────────────────────────────────────── */
const Home = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const changeSlide = (dir) => {
    setFading(true);
    setTimeout(() => {
      setSlideIdx(s => (s + dir + slides.length) % slides.length);
      setFading(false);
    }, 180);
  };

  const goTo = (i) => {
    if (i === slideIdx) return;
    setFading(true);
    setTimeout(() => { setSlideIdx(i); setFading(false); }, 180);
  };

  const s = slides[slideIdx];

  const orbitCards = [
    { icon: <CalendarDays size={28} />, title: 'Event Orbit', text: 'Weekly contests, workshops, and coding jams in one rotation.', tone: 'bg-[var(--color-comic-red)]', to: '/events' },
    { icon: <BookOpen size={28} />, title: 'Resource Bay', text: 'Curated DSA sheets, roadmaps, and peer notes for fast prep.', tone: 'bg-[var(--color-comic-cream)]', to: '/resources' },
    { icon: <Trophy size={28} />, title: 'Rank Radar', text: 'Track campus progress, contest wins, and leaderboard momentum.', tone: 'bg-[var(--color-comic-purple)] text-white', to: '/leaderboard' },
  ];

  const steps = [
    'Join the club and pick your coding lane.',
    'Attend workshops and solve guided sheets.',
    'Build projects and compete with the community.',
    'Climb the leaderboard with your crew.',
  ];

  const quoteOfTheDay = 'Success in coding is not about speed first, it is about consistency every single day.';

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-comic-yellow)] text-[var(--color-comic-ink)]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b-[3px] border-black">

        {/* SVG stars */}
        <div className="absolute left-[2%] top-[4%] z-10 hidden lg:block rotate-[-8deg] animate-[float-slow_8s_ease-in-out_infinite]">
          <DoodleLoop />
        </div>
        <div className="absolute left-[15%] top-[9%] z-10 hidden lg:block rotate-[8deg] animate-[float-slow_10s_ease-in-out_infinite_0.6s]">
          <DoodleSpark />
        </div>
        <div className="absolute left-[10%] top-[4%] z-10 hidden xl:block rotate-[-6deg] animate-[float-slow_12s_ease-in-out_infinite_1.2s]">
          <DoodleSpark className="w-6 h-6" />
        </div>
        <div className="absolute left-[6%] top-[18%] hidden lg:block animate-[float-slow_9s_ease-in-out_infinite]">
          <StarSVG />
        </div>
        <div className="absolute right-[12%] top-[26%] animate-[float-slow_13s_ease-in-out_infinite_1.2s]">
          <StarSVG className="w-8 h-8" />
        </div>
        <div className="absolute left-[8%] bottom-[14%] animate-[float-slow_11s_ease-in-out_infinite_2.5s]">
          <StarSVG className="w-7 h-7" />
        </div>
        <div className="absolute right-[5%] bottom-[22%] hidden xl:block animate-[float-slow_15s_ease-in-out_infinite_0.8s]">
          <StarSVG className="w-6 h-6" />
        </div>

        {/* SVG planets replacing the plain circles */}
        <div className="absolute right-[-3.5rem] top-14 animate-[float-slow_16s_ease-in-out_infinite_0.4s]">
          <PlanetSVG id="pa" className="w-40 h-40 opacity-95" />
        </div>
        <div className="absolute left-[-2.5rem] bottom-6 animate-[float-slow_18s_ease-in-out_infinite_3s]">
          <PlanetSVG id="pb" className="w-28 h-28 opacity-85" />
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_360px] lg:items-center lg:px-8 lg:py-14">

          {/* Left — slides */}
          <div className="order-2 lg:order-1">
            <div className={`comic-burst max-w-[260px] p-8 text-center lg:p-10 transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-base font-black uppercase tracking-wide text-[var(--color-comic-purple)]">{s.sub}</div>
              <div className="display-comic mt-3 text-4xl leading-[0.95] text-[var(--color-comic-purple)]">{s.label1}</div>
              <div className="display-comic text-4xl leading-[0.95] text-[var(--color-comic-purple)]">{s.label2}</div>
            </div>

            <div className="mt-5 grid max-w-[280px] gap-4">
              <div className="comic-outline rounded-2xl bg-[var(--color-comic-cream)] p-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-comic-orange)] px-3 py-1 text-xs font-black text-white">
                  <Brain size={14} />
                  Aptitude Of The Day
                </div>
                <p className="mt-3 text-sm font-extrabold leading-snug">
                  A train covers 300 km in 5 hours. What is its speed in m/s?
                </p>
                <div className="mt-3 inline-flex rounded-lg border-[2px] border-black bg-white px-2 py-1 text-xs font-black">
                  Answer: 16.67 m/s
                </div>
              </div>

              <div className="comic-outline rounded-2xl bg-white p-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-comic-purple)]">
                  Quote Of The Day
                </div>
                <p className="mt-3 text-sm font-extrabold leading-snug text-black/85">
                  “{quoteOfTheDay}”
                </p>
                <div className="mt-3 inline-flex rounded-lg border-[2px] border-black bg-[var(--color-comic-yellow)] px-2 py-1 text-xs font-black">
                  Keep showing up.
                </div>
              </div>
            </div>
          </div>

          {/* Center — static floating tray */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[560px] aspect-[1.05] animate-[float-slow_10s_ease-in-out_infinite]">
              <div className="comic-outline-soft absolute right-[2%] top-[4%] z-0 flex w-[52%] aspect-square items-center justify-center overflow-hidden rounded-full bg-[var(--color-comic-purple)] p-0">
                <div className="flex h-[96%] w-[96%] items-center justify-center rounded-full border-[6px] border-white bg-white p-1">
                  <img
                    src="/college-emblem.png"
                    alt="College logo"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="comic-outline absolute left-[9%] top-[18%] h-[58%] w-[64%] rotate-[-14deg] rounded-[2.6rem] bg-[var(--color-comic-red)] p-5">
                <div className="relative h-full w-full rounded-[2rem] border-[3px] border-black bg-[#25a24a] p-4">
                  <div className="absolute left-4 top-4 h-8 w-8 rounded-full border-[3px] border-black bg-[#45c06a]" />
                  <div className="absolute bottom-4 left-5 h-16 w-16 rounded-[1.4rem] border-[3px] border-black bg-[#45c06a]" />
                  <div className="comic-outline-soft absolute left-[20%] top-[20%] flex h-28 w-28 rotate-[10deg] items-center justify-center rounded-full bg-[var(--color-comic-cream)]">
                    <Rocket size={46} />
                  </div>
                  <div className="comic-outline-soft absolute right-[9%] top-[12%] flex h-24 w-24 rotate-[6deg] items-center justify-center rounded-[1.5rem] bg-[var(--color-comic-orange)] text-white">
                    <CalendarDays size={40} />
                  </div>
                  <div className="comic-outline-soft absolute bottom-[10%] right-[15%] flex h-28 w-28 rotate-[12deg] items-center justify-center rounded-full bg-[var(--color-comic-cream)] px-2">
                    <GFGMiniLogo />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — slides */}
          <div className={`order-3 transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="display-comic text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              {s.headline.map((line, i) => (
                <React.Fragment key={i}>{line}{i < s.headline.length - 1 && <br />}</React.Fragment>
              ))}
            </div>

            <div className="mt-8 grid gap-5 text-lg font-extrabold leading-tight sm:grid-cols-2">
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to={s.primary.to}
                className="comic-outline inline-flex items-center gap-2 rounded-2xl bg-[var(--color-comic-cream)] px-6 py-4 text-lg font-black transition-transform hover:-translate-y-1"
              >
                {s.primary.label}
                <ArrowRight size={20} />
              </Link>
              <Link
                to={s.secondary.to}
                className={`comic-outline inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-lg font-black text-[var(--color-comic-cream)] transition-transform hover:-translate-y-1 ${
                  s.secondary.label === 'Leaderboard'
                    ? 'bg-[var(--color-comic-purple)]'
                    : 'bg-[var(--color-comic-red)]'
                }`}
              >
                {s.secondary.label}
              </Link>
            </div>

            {/* Slider controls */}
            <div className="mt-12 flex items-center gap-5">
              <button
                onClick={() => changeSlide(-1)}
                aria-label="Previous slide"
                className="comic-outline flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-comic-cream)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <ArrowLeft size={22} />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-3 rounded-full border-[2.5px] border-black transition-all duration-300 ${i === slideIdx ? 'w-10 bg-black' : 'w-3 bg-[var(--color-comic-cream)] hover:bg-[var(--color-comic-red)]'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => changeSlide(1)}
                aria-label="Next slide"
                className="comic-outline flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-comic-cream)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>

        <div className="pb-6 text-center text-4xl font-black">⌄</div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b-[3px] border-black bg-[var(--color-comic-purple)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="display-comic text-4xl text-[var(--color-comic-cream)] sm:text-5xl">HOW IT WORKS</div>
          </ScrollReveal>
          <div className="mt-8 grid gap-5 md:grid-cols-[repeat(4,minmax(0,1fr))]">
            {steps.map((step, index) => (
              <ScrollReveal key={step} delay={index * 100}>
                <div className="comic-outline h-full rounded-[2rem] bg-[var(--color-comic-cream)] p-5">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-black bg-[var(--color-comic-yellow)] text-xl font-black">
                    {index + 1}
                  </div>
                  <p className="text-lg font-extrabold leading-tight text-black">{step}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cosmic coding menu ── */}
      <section className="bg-[var(--color-comic-yellow)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <div className="text-lg font-black uppercase tracking-[0.2em]">Club modules</div>
                <div className="display-comic mt-2 text-4xl sm:text-5xl">Cosmic coding menu</div>
              </div>
              <div className="hidden max-w-md text-right text-lg font-extrabold leading-tight lg:block">
                Pick your module, join the orbit, and level up every week with your campus crew.
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {orbitCards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 120}>
                <Link to={card.to} className="block h-full" aria-label={`Open ${card.title}`}>
                  <div className={`comic-outline h-full rounded-[2rem] p-7 ${card.tone}`}>
                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-[var(--color-comic-yellow)] text-black">
                      {card.icon}
                    </div>
                    <h3 className="display-comic text-2xl leading-tight">{card.title}</h3>
                    <p className="mt-4 text-lg font-extrabold leading-tight">{card.text}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { end: 500, suffix: '+', label: 'Active members' },
              { end: 45,  suffix: '',   label: 'Events conducted' },
              { end: 10,  suffix: 'k+', label: 'Problems solved' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6 text-center">
                  <div className="text-5xl font-black"><AnimatedCounter end={stat.end} suffix={stat.suffix} /></div>
                  <div className="mt-2 text-lg font-extrabold uppercase tracking-wide">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
