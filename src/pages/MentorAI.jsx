import React, { useMemo, useState } from 'react';
import { Bot, Send, Sparkles, User, Trash2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const MENTOR_CHAT_STORAGE_KEY = 'gfg_mentor_chat_v1';

const initialMentorMessage = [
  {
    role: 'mentor',
    text: 'Hi, I am your placement mentor bot. Ask me about DSA plan, resume, projects, aptitude, and interview prep.',
  },
];

const quickPrompts = [
  'Create a 30-day DSA roadmap',
  'How do I improve resume bullets?',
  'Top HR interview questions for freshers',
  'How to balance aptitude and coding prep?',
];

const buildMentorReply = (input) => {
  const text = input.toLowerCase();

  if (text.includes('resume')) {
    return 'Resume tip: keep one page, use impact bullets in this format -> Action + Tech + Result. Add 2 strong projects, links, and quantified outcomes.';
  }
  if (text.includes('dsa') || text.includes('roadmap')) {
    return 'DSA plan: 1) Arrays/Strings (5 days), 2) Hashing + Sliding Window (4 days), 3) LinkedList/Stack/Queue (5 days), 4) Trees/Graphs (8 days), 5) Mock contests + revision (8 days). Solve 4-6 problems/day.';
  }
  if (text.includes('aptitude')) {
    return 'For aptitude: spend 45 min daily on Quant + LR, and keep one sectional mock every 3 days. Track weak topics in a mistake notebook and revise weekly.';
  }
  if (text.includes('interview') || text.includes('hr')) {
    return 'Interview prep: prepare STAR stories (leadership, conflict, failure, ownership), revise project architecture, and practice 2 mock interviews every week.';
  }
  if (text.includes('project')) {
    return 'Project advice: choose one deployable project with auth + CRUD + analytics. Add a clean README, architecture diagram, and measurable impact in resume bullets.';
  }

  return 'Mentor suggestion: set a weekly target for coding, aptitude, and resume improvement. If you tell me your current year + target company type, I can give a custom plan.';
};

const MentorAI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return initialMentorMessage;
    try {
      const raw = window.localStorage.getItem(MENTOR_CHAT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : initialMentorMessage;
    } catch {
      return initialMentorMessage;
    }
  });

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const sendMessage = (value) => {
    const content = value.trim();
    if (!content) return;

    const mentorReply = buildMentorReply(content);

    setMessages((prev) => {
      const next = [
      ...prev,
      { role: 'user', text: content },
      { role: 'mentor', text: mentorReply },
      ];

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(MENTOR_CHAT_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
    setInput('');
  };

  const clearChat = () => {
    setMessages(initialMentorMessage);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MENTOR_CHAT_STORAGE_KEY, JSON.stringify(initialMentorMessage));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-purple)] p-8 text-white shadow-[8px_8px_0_#000]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="display-comic text-4xl md:text-5xl">AI Placement Mentor</h1>
                <p className="mt-3 max-w-3xl text-lg font-extrabold text-white/95">
                  Your student mentor assistant for placements: DSA roadmap, resume improvement, project planning, and interview strategy.
                </p>
              </div>
              <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-cream)] px-4 py-3 text-black">
                <Sparkles size={18} />
                <span className="font-black">Mentor mode active</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ScrollReveal delay={0}>
            <aside className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-5">
              <h2 className="display-comic text-2xl">Quick Prompts</h2>
              <button
                onClick={clearChat}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border-[2px] border-black bg-white px-3 py-2 text-xs font-black uppercase"
              >
                <Trash2 size={13} />
                Clear chat
              </button>
              <div className="mt-4 space-y-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="comic-outline-soft w-full rounded-xl bg-white px-3 py-3 text-left text-sm font-black hover:bg-[var(--color-comic-yellow)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </aside>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <section className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-5">
              <div className="h-[430px] overflow-y-auto rounded-xl border-[3px] border-black bg-white p-4">
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={`${msg.role}-${idx}`}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl border-[3px] border-black px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[var(--color-comic-cyan)] text-white'
                          : 'bg-[var(--color-comic-yellow)] text-black'
                      }`}>
                        <div className="mb-1 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide">
                          {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                          {msg.role === 'user' ? 'You' : 'Mentor'}
                        </div>
                        <p className="text-sm font-bold leading-snug">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-4 flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your placement mentor..."
                  className="flex-1 rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-bold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="comic-outline inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-purple)] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send
                  <Send size={15} />
                </button>
              </form>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default MentorAI;
