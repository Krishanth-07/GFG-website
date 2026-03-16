// ── Content Store ─────────────────────────────────────────────────────────────
// Admin-editable content is persisted in localStorage and falls back to the
// static data below. The Blog and Events pages read from here so admin edits
// are reflected immediately without touching source files.

// ── Default blog posts ────────────────────────────────────────────────────────
const DEFAULT_BLOG_POSTS = [
  {
    id: 'b1',
    slug: 'placement-prep-90-days',
    title: 'How To Start Placement Prep In 90 Days',
    category: 'Placement',
    readTime: '6 min read',
    date: 'Mar 10, 2026',
    excerpt: 'A realistic 3-phase plan for DSA, aptitude, projects, and mock interviews for campus placements.',
    content: [
      'Start with a baseline: one mock aptitude test, two easy coding problems, and one interview-style self introduction.',
      'In phase one (weeks 1-4), focus on consistency over difficulty. Solve easy-medium DSA daily, build formula memory for aptitude, and fix resume basics.',
      'In phase two (weeks 5-8), increase pressure with timed sets, topic-mix practice, and weekly mock interviews.',
      'In phase three (weeks 9-12), shift toward interview simulation. Prioritize revision sheets, company pattern practice, and rapid debugging drills.',
    ],
  },
  {
    id: 'b2',
    slug: 'resume-mistakes-recruiters-reject',
    title: 'Resume Mistakes Recruiters Reject In 10 Seconds',
    category: 'Career',
    readTime: '5 min read',
    date: 'Mar 08, 2026',
    excerpt: 'Actionable fixes for weak bullet points, poor structure, and missing impact metrics in student resumes.',
    content: [
      'Most student resumes fail because they list tasks, not impact. Rewrite points using action + result + measurable metric.',
      'Avoid long objective paragraphs. Keep a compact summary and use the saved space for projects and achievements.',
      'Prioritize recent and relevant work. Recruiters scan quickly, so move your strongest section to the top half of page one.',
      'Always tailor your skills section to role keywords. Generic skill dumps reduce your interview conversion rate.',
    ],
  },
  {
    id: 'b3',
    slug: 'aptitude-coding-balance-weekly-plan',
    title: 'Aptitude + Coding Balance: Weekly Timetable',
    category: 'Strategy',
    readTime: '4 min read',
    date: 'Mar 05, 2026',
    excerpt: 'A simple schedule that keeps both coding rounds and aptitude prep strong without burnout.',
    content: [
      'Use a 5+1+1 weekly rhythm: five focused prep days, one mixed revision day, and one low-intensity recovery day.',
      'Split prep sessions: 60-90 minutes coding, 45 minutes aptitude, and 20 minutes error log review.',
      'Do not skip revision logs. Your mistake notebook should be your highest-return asset in the final month.',
      'Track progress by solved quality, not just quantity. Depth in patterns beats random problem volume.',
    ],
  },
  {
    id: 'b4',
    slug: 'projects-that-help-interviews',
    title: 'Project Ideas That Actually Help In Interviews',
    category: 'Projects',
    readTime: '7 min read',
    date: 'Mar 02, 2026',
    excerpt: 'Interview-friendly project ideas with scope, stack suggestions, and what to showcase in demos.',
    content: [
      'Choose projects that demonstrate clear trade-offs: scalability, reliability, or UX decisions. Interviewers value reasoning.',
      'Keep scope practical. A well-finished project with clean architecture performs better than an unfinished mega idea.',
      'Prepare a 90-second demo flow. Show problem, approach, architecture, and one technical challenge you solved.',
      'Write a strong README with setup, system design sketch, and known limitations. This signals engineering maturity.',
    ],
  },
];

// ── Default events ────────────────────────────────────────────────────────────
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Geek-a-Thon 2024',
    type: 'Hackathon',
    date: 'April 15-16, 2024',
    time: '48 Hours',
    location: 'Main Auditorium',
    description: 'Our flagship annual hackathon. Build innovative solutions, win amazing prizes, and get a chance to be featured on GeeksforGeeks.',
    participants: 150,
    registrationOpen: true,
  },
  {
    id: 2,
    title: 'DSA Weekly Contest #45',
    type: 'Coding Contest',
    date: 'March 20, 2024',
    time: '2:00 PM - 4:00 PM',
    location: 'Online (GfG Practice)',
    description: "Test your algorithmic skills in this week's competitive programming contest. Open to all skill levels.",
    participants: 320,
    registrationOpen: true,
  },
  {
    id: 3,
    title: 'Web Dev Zero to Hero',
    type: 'Workshop',
    date: 'March 25, 2024',
    time: '5:00 PM - 7:00 PM',
    location: 'Lab 3, CS Block',
    description: 'A hands-on workshop covering React, Tailwind CSS, and Node.js. Build a full-stack project from scratch.',
    participants: 60,
    registrationOpen: false,
  },
];

const BLOG_KEY   = 'gfg_content_blog_v1';
const EVENTS_KEY = 'gfg_content_events_v1';

export const getBlogPosts = () => {
  try {
    const raw = localStorage.getItem(BLOG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_BLOG_POSTS;
  } catch {
    return DEFAULT_BLOG_POSTS;
  }
};

export const saveBlogPosts = (posts) =>
  localStorage.setItem(BLOG_KEY, JSON.stringify(posts));

export const getEvents = () => {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const saveEvents = (events) =>
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

export const resetBlogPosts = () => localStorage.removeItem(BLOG_KEY);
export const resetEvents    = () => localStorage.removeItem(EVENTS_KEY);
