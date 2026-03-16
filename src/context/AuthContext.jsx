import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Admin credentials (hardcoded — move to a real backend for production) ──────
const ADMIN_EMAIL    = 'admin@gfgrbit.in';
const ADMIN_PASSWORD = 'GFG@rbit2026';

// ── Students DB ───────────────────────────────────────────────────────────────
const STUDENTS_DB_KEY = 'gfg_students_db_v2';

const loadStudents = () => {
  try {
    const raw = localStorage.getItem(STUDENTS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const persistStudents = (students) =>
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));

const ADMIN_PROFILE_KEY = 'gfg_admin_profile_v1';
const SESSION_KEY       = 'gfg_auth_session_v1';

const DEFAULT_ADMIN = {
  id: 'admin',
  name: 'Admin',
  email: ADMIN_EMAIL,
  isAdmin: true,
  github: '',
  linkedin: '',
  bio: '',
  joinedAt: '2026-01-01T00:00:00.000Z',
};

// ── Admin helpers ─────────────────────────────────────────────────────────────
const getAdminProfile = () => {
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
    return raw ? { ...DEFAULT_ADMIN, ...JSON.parse(raw) } : { ...DEFAULT_ADMIN };
  } catch {
    return { ...DEFAULT_ADMIN };
  }
};

const saveAdminProfile = (profile) => {
  const { id: _i, email: _e, isAdmin: _a, joinedAt: _j, ...editable } = profile;
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(editable));
};

// ── Session helpers ───────────────────────────────────────────────────────────
const getSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveSession  = (user) => sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
const clearSession = () => sessionStorage.removeItem(SESSION_KEY);

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getSession();
    if (!session) return null;
    if (session.isAdmin) return { ...getAdminProfile(), ...session };
    // restore student from DB
    const students = loadStudents();
    const student  = students.find((s) => s.id === session.id);
    if (!student) return null;
    const { password: _p, ...safe } = student;
    return safe;
  });

  /** Student registration. Returns { ok, error } */
  const register = useCallback(({ name, email, password, rollNumber, year, branch }) => {
    const students = loadStudents();
    if (students.find((s) => s.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
    const newStudent = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      rollNumber: rollNumber.trim(),
      year,
      branch,
      github: '',
      linkedin: '',
      bio: '',
      joinedAt: new Date().toISOString(),
    };
    persistStudents([...students, newStudent]);
    const { password: _p, ...safe } = newStudent;
    saveSession(safe);
    setCurrentUser(safe);
    return { ok: true };
  }, []);

  /** Login — checks admin first, then student DB. Returns { ok, error, isAdmin } */
  const login = useCallback(({ email, password }) => {
    // Admin check
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const profile = getAdminProfile();
      saveSession(profile);
      setCurrentUser(profile);
      return { ok: true, isAdmin: true };
    }
    // Student check
    const students = loadStudents();
    const student  = students.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase() && s.password === password
    );
    if (!student) return { ok: false, error: 'Invalid email or password.' };
    const { password: _p, ...safe } = student;
    saveSession(safe);
    setCurrentUser(safe);
    return { ok: true, isAdmin: false };
  }, []);

  /** Update current user's editable profile */
  const updateProfile = useCallback((updates) => {
    if (currentUser?.isAdmin) {
      const profile = getAdminProfile();
      const { id: _i, email: _e, isAdmin: _a, joinedAt: _j, ...safeUpdates } = updates;
      const updated = { ...profile, ...safeUpdates };
      saveAdminProfile(updated);
      saveSession(updated);
      setCurrentUser(updated);
    } else {
      const students = loadStudents();
      const idx      = students.findIndex((s) => s.id === currentUser?.id);
      if (idx === -1) return { ok: false, error: 'Student not found.' };
      const { password: _p, id: _id, email: _e, joinedAt: _j, ...safeUpdates } = updates;
      const updated  = { ...students[idx], ...safeUpdates };
      students[idx]  = updated;
      persistStudents(students);
      const { password: __p, ...safe } = updated;
      saveSession(safe);
      setCurrentUser(safe);
    }
    return { ok: true };
  }, [currentUser]);

  /** Admin-only: get all registered students (passwords stripped) */
  const getAllStudents = useCallback(() =>
    loadStudents().map(({ password: _p, ...safe }) => safe), []);

  /** Admin-only: remove a student */
  const deleteStudent = useCallback((id) => {
    persistStudents(loadStudents().filter((s) => s.id !== id));
  }, []);

  /** Logout */
  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser, register, login, logout, updateProfile,
      getAllStudents, deleteStudent,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
