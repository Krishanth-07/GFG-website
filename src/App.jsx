import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Leaderboard from './pages/Leaderboard';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Club from './pages/Club';
import MentorAI from './pages/MentorAI';
import NotFound from './pages/NotFound';
import MemberLogin from './pages/MemberLogin';
import MemberDashboard from './pages/MemberDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminBlog from './pages/admin/AdminBlog';
import AdminEvents from './pages/admin/AdminEvents';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isDark, setIsDark] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <AuthProvider>
      <div className="app-shell min-h-screen flex flex-col">
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/club" element={<Club />} />
            <Route path="/mentor" element={<MentorAI />} />
            <Route path="/member/login" element={<MemberLogin />} />
            <Route path="/member/dashboard" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><AdminStudents /></AdminRoute>} />
            <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
