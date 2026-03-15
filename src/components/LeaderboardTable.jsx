import React from 'react';
import { Flame, Medal, TrendingUp, Trophy } from 'lucide-react';

const getStreakBadge = (days) => {
  if (days >= 21) return { label: 'Legend', tone: 'bg-[#14532d] text-white' };
  if (days >= 14) return { label: 'Hot', tone: 'bg-[#16a34a] text-white' };
  if (days >= 7) return { label: 'Alive', tone: 'bg-[#22c55e] text-white' };
  return { label: 'Warming', tone: 'bg-[#e2e8f0] text-black' };
};

const LeaderboardTable = ({ students }) => {
  return (
    <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-4 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="rounded-l-xl border-[3px] border-black bg-[var(--color-comic-yellow)] px-4 py-3 text-sm font-black uppercase">Rank</th>
              <th className="border-y-[3px] border-black bg-[var(--color-comic-yellow)] px-4 py-3 text-sm font-black uppercase">Name</th>
              <th className="border-y-[3px] border-black bg-[var(--color-comic-yellow)] px-4 py-3 text-sm font-black uppercase text-center">Problems Solved</th>
              <th className="border-y-[3px] border-black bg-[var(--color-comic-yellow)] px-4 py-3 text-sm font-black uppercase text-center">Streak</th>
              <th className="border-y-[3px] border-black bg-[var(--color-comic-yellow)] px-4 py-3 text-sm font-black uppercase text-center">Weekly</th>
              <th className="rounded-r-xl border-[3px] border-black bg-[var(--color-comic-yellow)] px-4 py-3 text-sm font-black uppercase text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const streakBadge = getStreakBadge(student.streakDays);
              const weeklyPositive = student.weeklyDelta >= 0;

              return (
                <tr key={student.id} className="hover:bg-black/[0.03]">
                  <td className="border-b-[2px] border-black/20 px-4 py-4">
                    <span className="comic-outline-soft inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-comic-cream)] text-sm font-black">
                      {student.rank}
                    </span>
                  </td>
                  <td className="border-b-[2px] border-black/20 px-4 py-4 text-base font-black">
                    <span className="inline-flex items-center gap-2">
                      {student.rank <= 3 ? <Trophy size={16} /> : <Medal size={16} />}
                      {student.name}
                    </span>
                  </td>
                  <td className="border-b-[2px] border-black/20 px-4 py-4 text-center text-base font-black">
                    {student.problemsSolved}
                  </td>
                  <td className="border-b-[2px] border-black/20 px-4 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-black bg-[#fff7ed] px-2 py-1 text-xs font-black">
                        <Flame size={12} />
                        {student.streakDays} days
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${streakBadge.tone}`}>
                        {streakBadge.label}
                      </span>
                    </div>
                  </td>
                  <td className="border-b-[2px] border-black/20 px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg border-[2px] border-black px-2 py-1 text-xs font-black ${
                        weeklyPositive ? 'bg-[#dcfce7]' : 'bg-[#fee2e2]'
                      }`}
                    >
                      <TrendingUp size={12} />
                      {weeklyPositive ? '+' : ''}
                      {student.weeklyDelta}
                    </span>
                  </td>
                  <td className="border-b-[2px] border-black/20 px-4 py-4 text-right">
                    <span className="comic-outline-soft inline-block rounded-xl bg-[var(--color-comic-red)] px-4 py-2 text-base font-black text-white">
                      {student.score}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
