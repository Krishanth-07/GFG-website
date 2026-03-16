import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trash2, ArrowLeft, Search, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ScrollReveal from '../../components/ScrollReveal';

const AdminStudents = () => {
  const { getAllStudents, deleteStudent } = useAuth();
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const all = getAllStudents();
  const students = query.trim()
    ? all.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase()) ||
        (s.rollNumber || '').toLowerCase().includes(query.toLowerCase())
      )
    : all;

  const handleDelete = (id) => {
    deleteStudent(id);
    setConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        <ScrollReveal>
          <div className="mb-6 flex items-center gap-3">
            <Link to="/admin/dashboard"
              className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-cream)] px-3 py-2 text-sm font-black shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
              <ArrowLeft size={14} /> Back
            </Link>
            <h1 className="display-comic text-2xl sm:text-3xl text-black">Registered Students</h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="mb-5 flex items-center gap-3 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-cream)] px-4 py-2.5 shadow-[3px_3px_0_#000]">
            <Search size={16} className="shrink-0 text-black/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or roll number..."
              className="flex-1 bg-transparent text-sm font-bold text-black placeholder:text-black/30 focus:outline-none"
            />
            <span className="text-xs font-black text-black/40">{students.length} / {all.length}</span>
          </div>
        </ScrollReveal>

        {students.length === 0 ? (
          <ScrollReveal delay={100}>
            <div className="rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-12 text-center shadow-[6px_6px_0_#000]">
              <GraduationCap size={40} className="mx-auto mb-3 text-black/30" />
              <p className="font-black text-black/50">{all.length === 0 ? 'No students registered yet.' : 'No students match your search.'}</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 40}>
                <div className="rounded-2xl border-[2.5px] border-black bg-[var(--color-comic-cream)] p-4 shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[2px] border-black bg-[var(--color-comic-purple)] text-white font-black text-sm">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-black truncate">{s.name}</p>
                      <p className="text-xs font-bold text-black/50 truncate">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {s.rollNumber && (
                      <span className="rounded-full border-[2px] border-black bg-[var(--color-comic-yellow)] px-2.5 py-0.5 text-xs font-black">{s.rollNumber}</span>
                    )}
                    {s.year && (
                      <span className="rounded-full border-[2px] border-black bg-[var(--color-comic-cyan)] px-2.5 py-0.5 text-xs font-black">{s.year}</span>
                    )}
                    {s.branch && (
                      <span className="rounded-full border-[2px] border-black bg-[var(--color-comic-orange)] px-2.5 py-0.5 text-xs font-black">{s.branch}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {confirmId === s.id ? (
                      <>
                        <span className="text-xs font-black text-black/60">Confirm delete?</span>
                        <button onClick={() => handleDelete(s.id)}
                          className="rounded-lg border-[2px] border-black bg-[var(--color-comic-red)] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">
                          Yes
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          className="rounded-lg border-[2px] border-black bg-[var(--color-comic-cream)] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">
                          No
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmId(s.id)}
                        className="flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-[var(--color-comic-yellow)] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform text-[var(--color-comic-red)]">
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
