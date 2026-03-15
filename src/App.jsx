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
        </Routes>
      </main>
    </div>
  );
}

export default App;
