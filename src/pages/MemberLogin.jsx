import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogIn, UserPlus, Eye, EyeOff, Lock, Mail, User,
  BookOpen, Calendar, Hash, ShieldCheck, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const YEARS    = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCHES = ['CSE', 'CSE-AI', 'CSE-DS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'];

const TextField = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, required, autoComplete }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-black uppercase tracking-widest text-black/60">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"><Icon size={15} /></span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} autoComplete={autoComplete}
        className="w-full rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] pl-9 pr-4 py-2.5 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]" />
    </div>
  </div>
);

const PwField = ({ label, value, onChange, placeholder, required, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-black uppercase tracking-widest text-black/60">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"><Lock size={15} /></span>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} required={required} autoComplete={autoComplete}
          className="w-full rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] pl-9 pr-10 py-2.5 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]" />
        <button type="button" onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70" tabIndex={-1}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

const SelectField = ({ icon: Icon, label, value, onChange, options, required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-black uppercase tracking-widest text-black/60">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"><Icon size={15} /></span>
      <select value={value} onChange={onChange} required={required}
        className="w-full appearance-none rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] pl-9 pr-4 py-2.5 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]">
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  </div>
);

const ErrorBanner = ({ msg }) => msg ? (
  <p className="rounded-xl border-[2px] border-[var(--color-comic-red)] bg-[var(--color-comic-red)]/10 px-3 py-2 text-sm font-bold text-[var(--color-comic-red)]">{msg}</p>
) : null;

const StudentLoginForm = ({ onSwitch }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const submit = (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const r = login(form); setLoading(false);
    if (!r.ok) { setError(r.error); return; }
    if (r.isAdmin) { setError('Use Admin tab to log in as admin.'); return; }
    navigate('/student/dashboard');
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@college.in" required autoComplete="username" />
      <PwField label="Password" value={form.password} onChange={set('password')} placeholder="Password" required autoComplete="current-password" />
      <ErrorBanner msg={error} />
      <button type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[var(--color-comic-red)] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        <LogIn size={16} />{loading ? 'Signing in...' : 'Log In'}
      </button>
      <p className="text-center text-xs font-bold text-black/50">No account?{' '}
        <button type="button" onClick={onSwitch} className="font-black text-[var(--color-comic-purple)] underline underline-offset-2">Register here</button>
      </p>
    </form>
  );
};

const StudentRegisterForm = ({ onSwitch }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNumber: '', year: '', branch: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const submit = (e) => {
    e.preventDefault(); setError('');
    if (!form.year || !form.branch) { setError('Please select your year and branch.'); return; }
    setLoading(true);
    const r = register(form); setLoading(false);
    if (!r.ok) { setError(r.error); return; }
    navigate('/student/dashboard');
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <TextField icon={User} label="Full Name" value={form.name} onChange={set('name')} placeholder="Aarav Mehta" required />
      <TextField icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@college.in" required />
      <PwField label="Password (min 6 chars)" value={form.password} onChange={set('password')} placeholder="Min. 6 chars" required />
      <TextField icon={Hash} label="Roll Number" value={form.rollNumber} onChange={set('rollNumber')} placeholder="21CS001" required />
      <div className="grid grid-cols-2 gap-3">
        <SelectField icon={Calendar} label="Year" value={form.year} onChange={set('year')} options={YEARS} required />
        <SelectField icon={BookOpen} label="Branch" value={form.branch} onChange={set('branch')} options={BRANCHES} required />
      </div>
      <ErrorBanner msg={error} />
      <button type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[var(--color-comic-purple)] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        <UserPlus size={16} />{loading ? 'Creating account...' : 'Register'}
      </button>
      <p className="text-center text-xs font-bold text-black/50">Already registered?{' '}
        <button type="button" onClick={onSwitch} className="font-black text-[var(--color-comic-red)] underline underline-offset-2">Log in</button>
      </p>
    </form>
  );
};

const AdminLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const submit = (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const r = login(form); setLoading(false);
    if (!r.ok) { setError('Invalid admin credentials.'); return; }
    if (!r.isAdmin) { setError('This account does not have admin access.'); return; }
    navigate('/admin/dashboard');
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField icon={Mail} label="Admin Email" type="email" value={form.email} onChange={set('email')} placeholder="admin@gfgrbit.in" required autoComplete="username" />
      <PwField label="Password" value={form.password} onChange={set('password')} placeholder="Admin password" required autoComplete="current-password" />
      <ErrorBanner msg={error} />
      <button type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[var(--color-comic-red)] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        <ShieldCheck size={16} />{loading ? 'Signing in...' : 'Admin Sign In'}
      </button>
    </form>
  );
};

const MemberLogin = () => {
  const [portal, setPortal] = useState('student');
  const [studentMode, setStudentMode] = useState('login');

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="display-comic text-3xl sm:text-4xl text-black">GFG Portal</h1>
          <p className="mt-1 text-sm font-bold text-black/50">GFG Campus Body - RBIT</p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-2xl border-[3px] border-black overflow-hidden shadow-[4px_4px_0_#000]">
          <button onClick={() => setPortal('student')}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-black transition-colors ${portal === 'student' ? 'bg-[var(--color-comic-purple)] text-white' : 'bg-[var(--color-comic-cream)] text-black/60 hover:text-black'}`}>
            <GraduationCap size={16} /> Student
          </button>
          <button onClick={() => setPortal('admin')}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-black transition-colors ${portal === 'admin' ? 'bg-[var(--color-comic-red)] text-white' : 'bg-[var(--color-comic-cream)] text-black/60 hover:text-black'}`}>
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        <div className="rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-6 sm:p-8 shadow-[8px_8px_0_#000]">
          {portal === 'student' ? (
            <>
              <div className="mb-5 grid grid-cols-2 rounded-xl border-[2.5px] border-black overflow-hidden">
                {['login', 'register'].map((m) => (
                  <button key={m} onClick={() => setStudentMode(m)}
                    className={`py-2 text-xs font-black uppercase tracking-wider transition-colors ${studentMode === m ? 'bg-[var(--color-comic-purple)] text-white' : 'bg-[var(--color-comic-yellow)] text-black/60 hover:text-black'}`}>
                    {m === 'login' ? 'Log In' : 'Register'}
                  </button>
                ))}
              </div>
              {studentMode === 'login'
                ? <StudentLoginForm onSwitch={() => setStudentMode('register')} />
                : <StudentRegisterForm onSwitch={() => setStudentMode('login')} />}
            </>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)]">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-black">Admin Access Only</p>
                  <p className="text-xs font-bold text-black/50">Authorised personnel only</p>
                </div>
              </div>
              <AdminLoginForm />
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-black/40">
          <Link to="/" className="hover:underline">Back to homepage</Link>
        </p>
      </div>
    </div>
  );
};

export default MemberLogin;
