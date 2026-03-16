import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-8 text-center shadow-[8px_8px_0_#000]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-comic-purple)]">404</p>
        <h1 className="display-comic mt-2 text-5xl">Page Lost In Orbit</h1>
        <p className="mt-4 text-base font-extrabold text-black/80">
          The route you opened does not exist yet. Head back to the home page and continue exploring.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl border-[3px] border-black bg-[var(--color-comic-purple)] px-5 py-3 text-sm font-black uppercase text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
