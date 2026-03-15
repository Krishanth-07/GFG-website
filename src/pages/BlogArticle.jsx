import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Tag } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { blogPosts } from '../data/blogPosts';

const BlogArticle = () => {
  const { slug } = useParams();
  const article = blogPosts.find((post) => post.slug === slug);

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

            <div className="mt-7 space-y-4 text-base font-extrabold leading-7 text-black/85">
              {article.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default BlogArticle;
