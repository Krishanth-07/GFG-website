import React, { useMemo, useState } from "react";
import { Medal, Orbit, Shield } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import LeaderboardTable from "../components/LeaderboardTable";
import GalaxyLeaderboard from "../components/GalaxyLeaderboard";

const studentData = [
  { id: 1,  name: "Alice Smith",   score: 2450, rank: 1,  problemsSolved: 146 },
  { id: 2,  name: "Bob Johnson",   score: 2100, rank: 2,  problemsSolved: 128 },
  { id: 3,  name: "Charlie Davis", score: 1950, rank: 3,  problemsSolved: 119 },
  { id: 4,  name: "Diana King",    score: 1800, rank: 4,  problemsSolved: 102 },
  { id: 5,  name: "Evan Wright",   score: 1650, rank: 5,  problemsSolved: 95 },
  { id: 6,  name: "Fiona Ray",     score: 1500, rank: 6,  problemsSolved: 84 },
  { id: 7,  name: "George Lee",    score: 1420, rank: 7,  problemsSolved: 79 },
  { id: 8,  name: "Hannah Cole",   score: 1350, rank: 8,  problemsSolved: 74 },
  { id: 9,  name: "Ian Bell",      score: 1200, rank: 9,  problemsSolved: 67 },
  { id: 10, name: "Julia Reed",    score: 1150, rank: 10, problemsSolved: 63 },
];

const Leaderboard = () => {
  const [mode, setMode] = useState("table");

  const topStudents = useMemo(() => {
    return [...studentData].sort((a, b) => a.rank - b.rank);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-purple)] p-8 text-white shadow-[8px_8px_0_#000]">
          <h1 className="display-comic text-4xl md:text-5xl">Campus Leaderboard</h1>
          <p className="mt-3 max-w-3xl text-lg font-extrabold text-white/95">
            Top coders in the GFG community. Scores blend practice consistency and contest performance.
          </p>
        </div>

        <ScrollReveal>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setMode((prev) => (prev === "table" ? "galaxy" : "table"))}
              className="comic-outline inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-purple)] px-5 py-3 text-sm font-black text-white"
            >
              <Orbit size={16} />
              {mode === "table" ? "Galaxy View" : "Table View"}
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          {mode === "table" ? (
            <LeaderboardTable students={topStudents} />
          ) : (
            <GalaxyLeaderboard students={topStudents} />
          )}
        </ScrollReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ScrollReveal delay={0}>
            <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-yellow)]">
                <Shield size={20} />
              </div>
              <h3 className="display-comic text-2xl">Scoring model</h3>
              <p className="mt-3 text-base font-extrabold text-black/85">60% problem-solving consistency and 40% contest + project performance.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={130}>
            <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-yellow)]">
                <Medal size={20} />
              </div>
              <h3 className="display-comic text-2xl">Monthly reset</h3>
              <p className="mt-3 text-base font-extrabold text-black/85">Leaderboard snapshots refresh monthly to reward consistent growth and not only one-time spikes.</p>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
