import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Clock3, Sparkles, Tag } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { blogPosts } from '../data/blogPosts';

const Blog = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(blogPosts.map((post) => post.category))], []);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchCategory = category === 'All' || post.category === category;
      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.some((paragraph) => paragraph.toLowerCase().includes(q));

      return matchCategory && matchQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-purple)] p-8 text-white shadow-[8px_8px_0_#000]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="display-comic text-4xl md:text-5xl">Club Blog</h1>
                <p className="mt-3 max-w-3xl text-lg font-extrabold text-white/95">
                  Weekly insights on placement prep, projects, resumes, and interview strategy.
                </p>
              </div>
              <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-cream)] px-4 py-3 text-black">
                <Sparkles size={18} />
                <span className="font-black">Fresh posts every week</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mb-6 grid gap-3 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts"
            className="rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-xl border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  item === category
                    ? 'bg-[var(--color-comic-purple)] text-white'
                    : 'bg-[var(--color-comic-yellow)] text-black'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-xs font-black uppercase tracking-wide text-black/70 md:col-span-2">
            {filteredPosts.length} post(s) found
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post, idx) => (
            <ScrollReveal key={post.title} delay={idx * 90}>
              <article className="comic-outline h-full rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="comic-outline-soft inline-flex items-center gap-1 rounded-lg bg-[var(--color-comic-orange)] px-3 py-1 text-xs font-black text-white">
                    <Tag size={12} />
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-black">
                    <CalendarDays size={14} />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-black">
                    <Clock3 size={14} />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="display-comic text-2xl leading-tight">{post.title}</h2>
                <p className="mt-4 text-base font-extrabold leading-snug text-black/80">{post.excerpt}</p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="comic-outline-soft mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-cyan)] px-4 py-2 text-sm font-black text-white"
                >
                  Read article
                  <ArrowUpRight size={16} />
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="mt-6 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-6 text-center text-sm font-black">
            No articles match your filters right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
