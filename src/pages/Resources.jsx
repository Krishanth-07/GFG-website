import React from 'react';
import { Code2, BookOpen, Terminal, ExternalLink, Rocket } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

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
              <span className="font-black">Build mode</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {resourceCategories.map((category, idx) => (
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
                  <a
                    key={linkIdx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="comic-outline-soft block rounded-xl bg-[var(--color-comic-yellow)] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-base font-black text-black">
                        {link.name}
                      </h3>
                      <ExternalLink
                        size={16}
                        className="text-black"
                      />
                    </div>
                    <p className="text-sm font-bold text-black/80">{link.desc}</p>
                  </a>
                ))}
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
