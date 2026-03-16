import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Edit3, Save, X, User, Mail,
  Github, Linkedin, FileText, GraduationCap, CheckCircle,
  Hash, BookOpen, Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';

const YEARS    = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCHES = ['CSE', 'CSE-AI', 'CSE-DS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'];

const Field = ({ icon: Icon, label, value, editing, name, type = 'text', onChange }) => {
  if (!editing) {
    return (
      <div className="flex items-start gap-3 rounded-xl border-[2px] border-black/20 bg-[var(--color-comic-yellow)] px-4 py-3">
        <span className="mt-0.5 shrink-0 text-[var(--color-comic-red)]"><Icon size={16} /></span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-black/50">{label}</p>
          <p className="mt-0.5 text-sm font-bold text-black break-words">
            {value || <span className="text-black/30 italic">Not set</span>}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-black uppercase tracking-wider text-black/50">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-comic-red)]"><Icon size={15} /></span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] pl-9 pr-4 py-2.5 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]"
        />
      </div>
    </div>
  );
};

const SelectField = ({ icon: Icon, label, value, editing, name, options, onChange }) => {
  if (!editing) {
    return (
      <div className="flex items-start gap-3 rounded-xl border-[2px] border-black/20 bg-[var(--color-comic-yellow)] px-4 py-3">
        <span className="mt-0.5 shrink-0 text-[var(--color-comic-red)]"><Icon size={16} /></span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-black/50">{label}</p>
          <p className="mt-0.5 text-sm font-bold text-black">{value || <span className="text-black/30 italic">Not set</span>}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-black uppercase tracking-wider text-black/50">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-comic-red)]"><Icon size={15} /></span>
        <select name={name} value={value} onChange={onChange}
          className="w-full appearance-none rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] pl-9 pr-4 py-2.5 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]">
          <option value="">Select...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [draft, setDraft] = useState({
    name:       currentUser?.name       ?? '',
    rollNumber: currentUser?.rollNumber ?? '',
    year:       currentUser?.year       ?? '',
    branch:     currentUser?.branch     ?? '',
    github:     currentUser?.github     ?? '',
    linkedin:   currentUser?.linkedin   ?? '',
    bio:        currentUser?.bio        ?? '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setDraft({
      name:       currentUser?.name       ?? '',
      rollNumber: currentUser?.rollNumber ?? '',
      year:       currentUser?.year       ?? '',
      branch:     currentUser?.branch     ?? '',
      github:     currentUser?.github     ?? '',
      linkedin:   currentUser?.linkedin   ?? '',
      bio:        currentUser?.bio        ?? '',
    });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/member/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        <ScrollReveal>
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-purple)] p-6 text-white shadow-[8px_8px_0_#000]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-[3px] border-white/60 bg-white/20">
                <GraduationCap size={30} className="text-white" />
              </div>
              <div>
                <h1 className="display-comic text-2xl sm:text-3xl leading-tight">{currentUser?.name}</h1>
                <p className="mt-0.5 text-sm font-bold text-white/80">{currentUser?.email}</p>
                {currentUser?.year && currentUser?.branch && (
                  <p className="mt-0.5 text-xs font-bold text-white/60">{currentUser.year} · {currentUser.branch}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border-[2.5px] border-white/60 bg-white/20 px-4 py-2.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-6 shadow-[6px_6px_0_#000]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="display-comic text-xl">My Profile</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-purple)] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleCancel}
                    className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] px-3 py-2 text-sm font-black shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                    <X size={14} /> Cancel
                  </button>
                  <button onClick={handleSave}
                    className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)] px-3 py-2 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                    <Save size={14} /> Save
                  </button>
                </div>
              )}
            </div>

            {saved && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border-[2px] border-[var(--color-comic-red)] bg-[var(--color-comic-red)]/10 px-3 py-2 text-sm font-bold text-[var(--color-comic-red)]">
                <CheckCircle size={16} /> Profile updated!
              </div>
            )}

            <div className="mb-4 flex items-start gap-3 rounded-xl border-[2px] border-black/10 bg-black/5 px-4 py-3">
              <span className="mt-0.5 shrink-0 text-black/40"><Mail size={16} /></span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-black/40">Email (locked)</p>
                <p className="mt-0.5 text-sm font-bold text-black/50">{currentUser?.email}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={User}     label="Full Name"    name="name"       value={editing ? draft.name       : currentUser?.name}       editing={editing} onChange={handleChange} />
              <Field icon={Hash}     label="Roll Number"  name="rollNumber" value={editing ? draft.rollNumber : currentUser?.rollNumber} editing={editing} onChange={handleChange} />
              <SelectField icon={Calendar} label="Year"   name="year"       value={editing ? draft.year       : currentUser?.year}       editing={editing} onChange={handleChange} options={YEARS} />
              <SelectField icon={BookOpen} label="Branch" name="branch"     value={editing ? draft.branch     : currentUser?.branch}     editing={editing} onChange={handleChange} options={BRANCHES} />
              <Field icon={Github}   label="GitHub URL"   name="github"     value={editing ? draft.github     : currentUser?.github}     editing={editing} onChange={handleChange} type="url" />
              <Field icon={Linkedin} label="LinkedIn URL" name="linkedin"   value={editing ? draft.linkedin   : currentUser?.linkedin}   editing={editing} onChange={handleChange} type="url" />
            </div>

            <div className="mt-3">
              {!editing ? (
                <div className="flex items-start gap-3 rounded-xl border-[2px] border-black/20 bg-[var(--color-comic-yellow)] px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-[var(--color-comic-red)]"><FileText size={16} /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider text-black/50">Bio</p>
                    <p className="mt-0.5 text-sm font-bold text-black break-words">
                      {currentUser?.bio || <span className="text-black/30 italic">Not set</span>}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase tracking-wider text-black/50">Bio</label>
                  <textarea name="bio" value={draft.bio} onChange={handleChange} rows={2}
                    placeholder="Short bio about yourself..."
                    className="w-full rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] px-4 py-2.5 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)] resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Leaderboard', path: '/leaderboard', color: 'bg-[var(--color-comic-purple)]' },
              { label: 'Events',      path: '/events',      color: 'bg-[var(--color-comic-orange)]' },
              { label: 'Resources',   path: '/resources',   color: 'bg-[var(--color-comic-cyan)]'   },
              { label: 'Blog',        path: '/blog',        color: 'bg-[var(--color-comic-red)]'    },
            ].map(({ label, path, color }) => (
              <Link key={path} to={path}
                className={`flex items-center justify-center rounded-2xl border-[3px] border-black ${color} py-3 text-sm font-black text-white shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5`}>
                {label}
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default StudentDashboard;
