import React from 'react';
import { Flag, Target, Users, Crown, Star } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const objectives = [
  'Build strong problem-solving foundations for placements and internships.',
  'Create a peer-learning ecosystem with weekly coding circles and review sessions.',
  'Promote project culture with practical development and presentation discipline.',
  'Enable career readiness through resume reviews, mocks, and recruiter-style challenges.',
];

const leaders = [
  { name: 'Aarav Mehta', role: 'Club Lead', focus: 'Operations + Placement Strategy' },
  { name: 'Ishita Rao', role: 'Technical Lead', focus: 'DSA Tracks + Contest Planning' },
  { name: 'Rohan Verma', role: 'Mentorship Lead', focus: 'Mock Interviews + Resume Labs' },
];

const members = [
  'Ananya S.', 'Neel P.', 'Shreya K.', 'Kunal T.', 'Priya D.', 'Ritika M.', 'Yash A.', 'Madhav R.',
];

const Club = () => {
  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-red)] p-8 text-white shadow-[8px_8px_0_#000]">
            <h1 className="display-comic text-4xl md:text-5xl">About The Club</h1>
            <p className="mt-3 max-w-3xl text-lg font-extrabold text-white/95">
              GeeksforGeeks Campus Body helps students become placement-ready through coding, projects, and mentorship.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <ScrollReveal delay={0}>
            <section className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-purple)] text-white">
                <Flag size={20} />
              </div>
              <h2 className="display-comic text-3xl">Mission</h2>
              <p className="mt-3 text-base font-extrabold text-black/80">
                To make every motivated student confident in coding interviews through structured practice, collaborative learning, and real-world project execution.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <section className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-cyan)] text-white">
                <Target size={20} />
              </div>
              <h2 className="display-comic text-3xl">Objectives</h2>
              <ul className="mt-3 space-y-2">
                {objectives.map((item) => (
                  <li key={item} className="text-base font-extrabold text-black/80">- {item}</li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ScrollReveal delay={0}>
            <section className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-orange)] text-white">
                <Crown size={20} />
              </div>
              <h2 className="display-comic text-3xl">Club Leaders</h2>
              <div className="mt-4 space-y-3">
                {leaders.map((leader) => (
                  <div key={leader.name} className="comic-outline-soft rounded-xl bg-white p-4">
                    <div className="text-lg font-black">{leader.name}</div>
                    <div className="text-sm font-black text-[var(--color-comic-purple)]">{leader.role}</div>
                    <div className="mt-1 text-sm font-bold text-black/75">{leader.focus}</div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <section className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-purple)] text-white">
                <Users size={20} />
              </div>
              <h2 className="display-comic text-3xl">Core Members</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {members.map((member) => (
                  <div key={member} className="comic-outline-soft rounded-xl bg-white px-3 py-3 text-sm font-black text-center">
                    <Star size={14} className="mx-auto mb-1" />
                    {member}
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Club;
