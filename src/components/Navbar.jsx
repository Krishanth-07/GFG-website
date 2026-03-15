import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

const GFGLogo = ({ className = "w-11 h-11 mb-1" }) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
    <circle cx="28" cy="28" r="11" fill="var(--color-comic-red)" stroke="#101010" strokeWidth="2.5" />
    <ellipse cx="28" cy="28" rx="23" ry="7.5" fill="none" stroke="#101010" strokeWidth="2.5" transform="rotate(-35 28 28)" />
    <circle cx="28" cy="4" r="3.5" fill="var(--color-comic-cream)" stroke="#101010" strokeWidth="1.5" />
  </svg>
);

const Navbar = ({ isDark, onToggleTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const allLinks = [
    { name: "Home",        path: "/" },
    { name: "Events",      path: "/events" },
    { name: "Resources",   path: "/resources" },
    { name: "Club",        path: "/club" },
    { name: "Blog",        path: "/blog" },
    { name: "Contact",     path: "/contact" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Mentor AI",   path: "/mentor" },
  ];

  const leftLinks  = allLinks.slice(0, 4);
  const rightLinks = allLinks.slice(4, 8);

  const mkLink = (link) => {
    const active = location.pathname === link.path;
    return (
      <Link
        key={link.name}
        to={link.path}
        className={`whitespace-nowrap font-extrabold text-black transition-transform hover:-translate-y-0.5 ${active ? "underline decoration-[3px] underline-offset-8" : ""}`}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b-[3px] border-black bg-[var(--color-comic-yellow)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid py-3 grid-cols-[auto_1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-[var(--color-comic-cream)] shadow-[4px_4px_0_#000] md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex w-full items-center justify-evenly text-[0.95rem]">
            {leftLinks.map(mkLink)}
          </div>

          <Link to="/" className="justify-self-center flex flex-col items-center text-center leading-none text-black">
            <div className="display-comic text-[2.2rem] sm:text-[2.5rem] leading-none flex items-center gap-1">
              <span>GFG</span>
              <GFGLogo className="h-10 w-10 sm:h-11 sm:w-11 -mt-1" />
              <span>RBIT</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <img
                src="/college-logo-new.png?v=20260315"
                alt="College logo"
                className={`h-10 w-auto scale-110 origin-left ${isDark ? "invert" : "mix-blend-multiply"}`}
                loading="eager"
              />
              <div className="text-[0.75rem] font-black tracking-[0.3em] uppercase">Campus Body</div>
            </div>
          </Link>

          <div className="hidden md:flex w-full items-center justify-evenly text-[0.95rem]">
            {rightLinks.map(mkLink)}
            <button
              onClick={onToggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-black bg-[var(--color-comic-cream)] shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[30rem] border-t-[3px] border-black" : "max-h-0"}`}
      >
        <div className="space-y-2 bg-[var(--color-comic-yellow)] px-4 py-4">
          <button
            onClick={onToggleTheme}
            className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] px-4 py-3 text-base font-black shadow-[4px_4px_0_#000]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          {allLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-2xl border-[3px] border-black px-4 py-3 text-base font-black shadow-[4px_4px_0_#000] transition-transform ${active ? "bg-[var(--color-comic-red)] text-white" : "bg-[var(--color-comic-cream)] text-black"}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
