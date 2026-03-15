import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Clock3, Sparkles, Tag } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { blogPosts } from '../data/blogPosts';

const Blog = () => {
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

        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((post, idx) => (
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
      </div>
    </div>
  );
};

export default Blog;
