import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Flame, Medal, Orbit, Shield, TrendingUp } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import LeaderboardTable from "../components/LeaderboardTable";
import GalaxyLeaderboard from "../components/GalaxyLeaderboard";

const STORAGE_KEY = "gfg_leaderboard_state_v1";

const studentData = [
  { id: 1, name: "Alice Smith", score: 2450, rank: 1, problemsSolved: 146, streakDays: 22, weeklyDelta: 85, lastActive: "Today", isCurrentUser: true },
  { id: 2, name: "Bob Johnson", score: 2100, rank: 2, problemsSolved: 128, streakDays: 16, weeklyDelta: 64, lastActive: "Today" },
  { id: 3, name: "Charlie Davis", score: 1950, rank: 3, problemsSolved: 119, streakDays: 11, weeklyDelta: 40, lastActive: "Today" },
  { id: 4, name: "Diana King", score: 1800, rank: 4, problemsSolved: 102, streakDays: 9, weeklyDelta: 26, lastActive: "Today" },
  { id: 5, name: "Evan Wright", score: 1650, rank: 5, problemsSolved: 95, streakDays: 13, weeklyDelta: 48, lastActive: "Today" },
  { id: 6, name: "Fiona Ray", score: 1500, rank: 6, problemsSolved: 84, streakDays: 7, weeklyDelta: 18, lastActive: "Yesterday" },
  { id: 7, name: "George Lee", score: 1420, rank: 7, problemsSolved: 79, streakDays: 4, weeklyDelta: 12, lastActive: "Yesterday" },
  { id: 8, name: "Hannah Cole", score: 1350, rank: 8, problemsSolved: 74, streakDays: 3, weeklyDelta: -6, lastActive: "2 days ago" },
  { id: 9, name: "Ian Bell", score: 1200, rank: 9, problemsSolved: 67, streakDays: 2, weeklyDelta: -14, lastActive: "2 days ago" },
  { id: 10, name: "Julia Reed", score: 1150, rank: 10, problemsSolved: 63, streakDays: 1, weeklyDelta: -9, lastActive: "3 days ago" },
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const rankStudents = (students) => {
  const sorted = [...students].sort((a, b) => b.score - a.score);
  return sorted.map((student, idx) => ({ ...student, rank: idx + 1 }));
};

const getInitialLeaderboardState = () => {
  if (typeof window === "undefined") {
    return { students: rankStudents(studentData), challengeClaimDate: "" };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { students: rankStudents(studentData), challengeClaimDate: "" };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.students)) {
      return { students: rankStudents(studentData), challengeClaimDate: "" };
    }

    return {
      students: rankStudents(parsed.students),
      challengeClaimDate: parsed.challengeClaimDate || "",
    };
  } catch {
    return { students: rankStudents(studentData), challengeClaimDate: "" };
  }
};

const buildAchievementBadges = (student) => {
  const badges = [];

  if (student.streakDays >= 21) badges.push("Legend Flame");
  else if (student.streakDays >= 14) badges.push("Consistency Hero");
  else if (student.streakDays >= 7) badges.push("Streak Starter");

  if (student.weeklyDelta >= 60) badges.push("Momentum Beast");
  if (student.problemsSolved >= 140) badges.push("Problem Crusher");

  return badges;
};

const Leaderboard = () => {
  const initialState = useMemo(() => getInitialLeaderboardState(), []);
  const [mode, setMode] = useState("table");
  const [streakFilter, setStreakFilter] = useState(0);
  const [students, setStudents] = useState(initialState.students);
  const [challengeClaimDate, setChallengeClaimDate] = useState(initialState.challengeClaimDate);
  const [challengeNote, setChallengeNote] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ students, challengeClaimDate })
    );
  }, [students, challengeClaimDate]);

  const topStudents = useMemo(() => {
    return [...students]
      .filter((student) => student.streakDays >= streakFilter)
      .sort((a, b) => a.rank - b.rank);
  }, [students, streakFilter]);

  const leaderboardStats = useMemo(() => {
    const longestStreak = Math.max(...students.map((student) => student.streakDays));
    const avgStreak = Math.round(students.reduce((sum, student) => sum + student.streakDays, 0) / students.length);
    const activeStreakers = students.filter((student) => student.streakDays >= 7).length;
    const topMomentum = [...students].sort((a, b) => b.weeklyDelta - a.weeklyDelta).slice(0, 3);

    return {
      longestStreak,
      avgStreak,
      activeStreakers,
      topMomentum,
    };
  }, [students]);

  const myProfile = useMemo(() => {
    return students.find((student) => student.isCurrentUser) || students[0];
  }, [students]);

  const myBadges = useMemo(() => buildAchievementBadges(myProfile), [myProfile]);

  const challengeDoneToday = challengeClaimDate === getTodayKey();

  const handleDailyChallenge = () => {
    if (challengeDoneToday) {
      setChallengeNote("Challenge already completed today. Come back tomorrow for the next booster.");
      return;
    }

    const todayKey = getTodayKey();
    const next = students.map((student) => {
      if (!student.isCurrentUser) return student;

      return {
        ...student,
        score: student.score + 35,
        weeklyDelta: student.weeklyDelta + 35,
        streakDays: student.streakDays + 1,
        problemsSolved: student.problemsSolved + 4,
        lastActive: "Today",
      };
    });

    setStudents(rankStudents(next));
    setChallengeClaimDate(todayKey);
    setChallengeNote("Daily challenge completed. Bonus +35 added and streak extended.");
  };

  useEffect(() => {
    if (!challengeNote) return;

    const timer = setTimeout(() => setChallengeNote(""), 3600);
    return () => clearTimeout(timer);
  }, [challengeNote]);

  const streakFilters = [
    { label: "All", minDays: 0 },
    { label: "7+ days", minDays: 7 },
    { label: "14+ days", minDays: 14 },
  ];

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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {streakFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setStreakFilter(filter.minDays)}
                  className={`comic-outline-soft rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ${
                    streakFilter === filter.minDays
                      ? "bg-[var(--color-comic-red)] text-white"
                      : "bg-[var(--color-comic-cream)] text-black"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Flame size={14} />
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>

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
          <div className="mb-6 grid gap-4 rounded-[1.6rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-5 shadow-[6px_6px_0_#000] md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/70">My Orbit</p>
              <h2 className="display-comic mt-1 text-3xl">{myProfile.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-black">
                <span className="rounded-lg border-[2px] border-black bg-[var(--color-comic-yellow)] px-2 py-1">Rank #{myProfile.rank}</span>
                <span className="rounded-lg border-[2px] border-black bg-[#fff7ed] px-2 py-1">{myProfile.streakDays} day streak</span>
                <span className="rounded-lg border-[2px] border-black bg-[#dcfce7] px-2 py-1">Weekly +{myProfile.weeklyDelta}</span>
              </div>
              <p className="mt-3 text-sm font-extrabold text-black/80">
                {myProfile.streakDays >= 7
                  ? "You are in safe streak zone. Keep one solved problem daily to preserve momentum."
                  : "Your streak is fragile right now. Solve at least one problem today to avoid reset risk."}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/70">Unlocked Badges</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {myBadges.length > 0 ? (
                  myBadges.map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1 rounded-lg border-[2px] border-black bg-white px-2 py-1 text-xs font-black">
                      <BadgeCheck size={13} />
                      {badge}
                    </span>
                  ))
                ) : (
                  <span className="rounded-lg border-[2px] border-black bg-white px-2 py-1 text-xs font-black">
                    No badges yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          {mode === "table" ? (
            <LeaderboardTable students={topStudents} />
          ) : (
            <GalaxyLeaderboard students={topStudents} />
          )}
        </ScrollReveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ScrollReveal delay={0}>
            <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-yellow)]">
                <Flame size={20} />
              </div>
              <h3 className="display-comic text-2xl">Streak Pulse</h3>
              <p className="mt-3 text-base font-extrabold text-black/85">
                {leaderboardStats.activeStreakers} students are on a 7+ day streak. Average consistency is {leaderboardStats.avgStreak} days.
              </p>
              <p className="mt-3 inline-flex rounded-lg border-[2px] border-black bg-[var(--color-comic-red)] px-3 py-1 text-xs font-black uppercase text-white">
                Longest streak: {leaderboardStats.longestStreak} days
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-yellow)]">
                <TrendingUp size={20} />
              </div>
              <h3 className="display-comic text-2xl">Momentum Movers</h3>
              <ul className="mt-3 space-y-2 text-sm font-black">
                {leaderboardStats.topMomentum.map((student) => (
                  <li key={student.id} className="flex items-center justify-between rounded-lg border-[2px] border-black bg-white px-3 py-2">
                    <span>{student.name}</span>
                    <span className="rounded-md bg-[var(--color-comic-purple)] px-2 py-1 text-white">+{student.weeklyDelta}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[var(--color-comic-yellow)]">
                <Medal size={20} />
              </div>
              <h3 className="display-comic text-2xl">Daily Challenge</h3>
              <p className="mt-3 text-sm font-extrabold text-black/85">
                Solve 3 array + 1 graph problem today to claim a "Consistency Booster" and +35 bonus score.
              </p>
              <button
                onClick={handleDailyChallenge}
                className={`comic-outline-soft mt-4 rounded-lg px-3 py-2 text-xs font-black uppercase text-white ${
                  challengeDoneToday ? "cursor-not-allowed bg-slate-400" : "bg-[var(--color-comic-orange)]"
                }`}
              >
                {challengeDoneToday ? "Completed today" : "Complete challenge"}
              </button>
              {challengeNote && <p className="mt-3 text-xs font-black text-black/75">{challengeNote}</p>}
            </div>
          </ScrollReveal>
        </div>

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
