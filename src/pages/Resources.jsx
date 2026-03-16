import React, { useMemo, useState } from 'react';
import { Code2, BookOpen, Terminal, ExternalLink, Rocket, Bookmark } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const RESOURCE_STORAGE_KEY = 'gfg_resource_bookmarks_v1';

const resourceCategories = [
  {
    title: 'Data Structures & Algorithms',
    icon: <Code2 size={24} />,
    color: 'text-gfg-green',
    bgColor: 'bg-gfg-green/10',
    borderColor: 'border-gfg-green/30',
    links: [
      {
        name: 'GfG DSA Self Paced',
        url: 'https://www.geeksforgeeks.org/courses/dsa-self-paced',
        desc: 'Comprehensive structured guide to DSA',
      },
      {
        name: 'LeetCode Top 100',
        url: 'https://leetcode.com/problem-list/top-topics',
        desc: 'Most frequently-asked interview questions',
      },
      {
        name: 'NeetCode 150',
        url: 'https://neetcode.io/roadmap',
        desc: 'Curated roadmap for problem solving',
      },
    ]
  },
  {
    title: 'Web Development',
    icon: <Terminal size={24} />,
    color: 'text-gfg-blue',
    bgColor: 'bg-gfg-blue/10',
    borderColor: 'border-gfg-blue/30',
    links: [
      {
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn',
        desc: 'Interactive full-stack web dev curriculum',
      },
      {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        desc: 'The definitive web platform reference',
      },
      {
        name: 'React Documentation',
        url: 'https://react.dev/learn',
        desc: 'Official React docs and interactive tutorials',
      },
    ]
  },
  {
    title: 'Competitive Programming',
    icon: <BookOpen size={24} />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    links: [
      {
        name: 'Codeforces',
        url: 'https://codeforces.com/',
        desc: 'Regular contests and a huge problemset',
      },
      {
        name: 'CodeChef',
        url: 'https://www.codechef.com/',
        desc: 'Monthly long challenges and cook-offs',
      },
      {
        name: 'CSES Problem Set',
        url: 'https://cses.fi/problemset/',
        desc: 'Standard algorithmic tasks with editorials',
      },
    ]
  }
];

const Resources = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(RESOURCE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const categories = useMemo(() => ['All', ...resourceCategories.map((c) => c.title)], []);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resourceCategories
      .filter((category) => selectedCategory === 'All' || category.title === selectedCategory)
      .map((category) => ({
        ...category,
        links: category.links.filter((link) => {
          if (!q) return true;
          return (
            link.name.toLowerCase().includes(q) ||
            link.desc.toLowerCase().includes(q) ||
            category.title.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((category) => category.links.length > 0);
  }, [query, selectedCategory]);

  const bookmarkCount = useMemo(() => Object.values(bookmarks).filter(Boolean).length, [bookmarks]);

  const toggleBookmark = (linkName) => {
    setBookmarks((prev) => {
      const next = { ...prev, [linkName]: !prev[linkName] };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-8 shadow-[8px_8px_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="display-comic text-4xl md:text-5xl">Resource Hangar</h1>
              <p className="mt-3 max-w-3xl text-lg font-extrabold text-black/85">
                Launch with curated learning stacks for DSA, Web Development, and Competitive Programming.
              </p>
            </div>
            <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-orange)] px-4 py-3 text-white">
              <Rocket size={18} />
              <span className="font-black">{bookmarkCount} bookmarked</span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources"
            className="rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  selectedCategory === category
                    ? 'bg-[var(--color-comic-purple)] text-white'
                    : 'bg-[var(--color-comic-yellow)] text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {filteredCategories.map((category, idx) => (
            <ScrollReveal key={idx} delay={idx * 130}>
            <div className="comic-outline h-full rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div
                className={`comic-outline-soft mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${category.bgColor} ${category.color}`}
              >
                {category.icon}
              </div>

              <h2 className="display-comic text-2xl leading-tight text-black">{category.title}</h2>

              <div className="mt-5 space-y-3">
                {category.links.map((link, linkIdx) => (
                  <div key={linkIdx} className="comic-outline-soft block rounded-xl bg-[var(--color-comic-yellow)] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-base font-black text-black hover:underline">
                        {link.name}
                        <ExternalLink size={16} className="text-black" />
                      </a>
                      <button
                        onClick={() => toggleBookmark(link.name)}
                        className={`rounded-lg border-[2px] border-black p-1.5 ${bookmarks[link.name] ? 'bg-[var(--color-comic-orange)] text-white' : 'bg-white text-black'}`}
                        aria-label={`Toggle bookmark for ${link.name}`}
                      >
                        <Bookmark size={14} fill={bookmarks[link.name] ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-black/80">{link.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="mt-6 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-6 text-center text-sm font-black">
            No resources found for your current search/filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
