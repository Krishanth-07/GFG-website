import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Tag, Heart, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { blogPosts } from '../data/blogPosts';

const BLOG_STATE_KEY = 'gfg_blog_state_v1';

const BlogArticle = () => {
  const { slug } = useParams();
  const article = blogPosts.find((post) => post.slug === slug);
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return { likes: {}, progress: {} };
    try {
      const raw = window.localStorage.getItem(BLOG_STATE_KEY);
      return raw ? JSON.parse(raw) : { likes: {}, progress: {} };
    } catch {
      return { likes: {}, progress: {} };
    }
  });

  const articleIndex = useMemo(() => blogPosts.findIndex((post) => post.slug === slug), [slug]);
  const prevArticle = articleIndex > 0 ? blogPosts[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < blogPosts.length - 1 ? blogPosts[articleIndex + 1] : null;

  const persistState = (next) => {
    setState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BLOG_STATE_KEY, JSON.stringify(next));
    }
  };

  const toggleLike = () => {
    if (!article) return;
    const next = {
      ...state,
      likes: {
        ...state.likes,
        [article.slug]: !state.likes[article.slug],
      },
    };
    persistState(next);
  };

  const markProgress = () => {
    if (!article) return;
    const next = {
      ...state,
      progress: {
        ...state.progress,
        [article.slug]: {
          done: true,
          completedAt: new Date().toISOString(),
        },
      },
    };
    persistState(next);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-8 shadow-[8px_8px_0_#000]">
          <h1 className="display-comic text-4xl">Article Not Found</h1>
          <p className="mt-3 text-base font-extrabold text-black/80">
            The article you are trying to open does not exist.
          </p>
          <Link
            to="/blog"
            className="comic-outline-soft mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-purple)] px-4 py-2 text-sm font-black text-white"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <article className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-8 shadow-[10px_10px_0_#000]">
            <Link
              to="/blog"
              className="comic-outline-soft mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="comic-outline-soft inline-flex items-center gap-1 rounded-lg bg-[var(--color-comic-orange)] px-3 py-1 text-xs font-black text-white">
                <Tag size={12} />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-black">
                <CalendarDays size={14} />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-black">
                <Clock3 size={14} />
                {article.readTime}
              </span>
            </div>

            <h1 className="display-comic text-4xl leading-tight md:text-5xl">{article.title}</h1>
            <p className="mt-4 text-lg font-extrabold text-black/80">{article.excerpt}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={toggleLike}
                className={`inline-flex items-center gap-2 rounded-lg border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  state.likes[article.slug] ? 'bg-[var(--color-comic-red)] text-white' : 'bg-white text-black'
                }`}
              >
                <Heart size={14} fill={state.likes[article.slug] ? 'currentColor' : 'none'} />
                {state.likes[article.slug] ? 'Liked' : 'Like article'}
              </button>
              <button
                onClick={markProgress}
                className={`inline-flex items-center gap-2 rounded-lg border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  state.progress[article.slug]?.done ? 'bg-[var(--color-comic-purple)] text-white' : 'bg-white text-black'
                }`}
              >
                {state.progress[article.slug]?.done ? 'Completed' : 'Mark as read'}
              </button>
            </div>

            <div className="mt-7 space-y-4 text-base font-extrabold leading-7 text-black/85">
              {article.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {prevArticle ? (
                <Link
                  to={`/blog/${prevArticle.slug}`}
                  className="inline-flex items-center justify-between rounded-xl border-[2px] border-black bg-white px-4 py-3 text-sm font-black"
                >
                  <span className="inline-flex items-center gap-2"><ArrowLeft size={14} /> Previous</span>
                  <span className="truncate pl-3">{prevArticle.title}</span>
                </Link>
              ) : (
                <div className="rounded-xl border-[2px] border-dashed border-black/40 bg-white/50 px-4 py-3 text-sm font-black text-black/60">
                  No previous article
                </div>
              )}

              {nextArticle ? (
                <Link
                  to={`/blog/${nextArticle.slug}`}
                  className="inline-flex items-center justify-between rounded-xl border-[2px] border-black bg-white px-4 py-3 text-sm font-black"
                >
                  <span className="truncate pr-3">{nextArticle.title}</span>
                  <span className="inline-flex items-center gap-2">Next <ArrowRight size={14} /></span>
                </Link>
              ) : (
                <div className="rounded-xl border-[2px] border-dashed border-black/40 bg-white/50 px-4 py-3 text-sm font-black text-black/60">
                  No next article
                </div>
              )}
            </div>
          </article>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default BlogArticle;
