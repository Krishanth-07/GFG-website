import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, User, Trash2, Loader2, Download } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ScrollReveal from '../components/ScrollReveal';

const MENTOR_CHAT_STORAGE_KEY = 'gfg_mentor_chat_v2';
const MENTOR_NAME = 'PrepBuddy';

const SYSTEM_PROMPT = `You are PrepBuddy, an AI placement mentor for the GeeksforGeeks (GFG) Campus Body at RBIT (Rajiv Gandhi Institute of Technology, Bangalore).
You help students with:
- DSA roadmaps and problem-solving strategies
- Resume and profile improvement
- Project guidance and portfolio building
- Aptitude and reasoning preparation
- Software engineering interview preparation (HR + technical)
- Career planning for freshers and final-year students

Personality: You are friendly, encouraging, concise, and actionable. You give bullet-point plans when asked for roadmaps. You use simple language. You address the student as "you" and keep responses under 180 words unless a detailed plan is requested.
Always stay on topic (placement, coding, career). If asked unrelated questions, gently redirect to placement topics.`;

const initMessage = {
  role: 'mentor',
  text: `Hey! I'm ${MENTOR_NAME}, your GFG placement mentor. Ask me about DSA plans, resume tips, projects, aptitude prep, or interview strategy.`,
};

const quickPrompts = [
  'Create a 30-day DSA roadmap',
  'How do I improve my resume?',
  'Top HR interview questions for freshers',
  'Best projects to add for placements',
];

const weeklyPlanPrompt =
  'Create a personalized 7-day placement prep plan for me with daily tasks for DSA, aptitude, resume, and interview prep. Keep each day practical and beginner-friendly.';

const apiKey = String(import.meta.env.VITE_GEMINI_API_KEY || '')
  .trim()
  .replace(/^['\"]|['\"]$/g, '');
const genAI = apiKey && apiKey !== 'your_gemini_api_key_here'
  ? new GoogleGenerativeAI(apiKey)
  : null;
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

const MentorAI = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(MENTOR_CHAT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [initMessage];
    } catch {
      return [initMessage];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const persist = (msgs) => {
    try { localStorage.setItem(MENTOR_CHAT_STORAGE_KEY, JSON.stringify(msgs)); } catch {}
  };

  const getMentorReply = async (history, userText) => {
    if (!genAI) {
      return fallback(userText);
    }

    const recent = history.slice(-8)
      .map((m) => `${m.role === 'user' ? 'Student' : MENTOR_NAME}: ${m.text}`)
      .join('\n');
    const fullPrompt = [
      SYSTEM_PROMPT,
      '',
      'Recent chat context:',
      recent,
      '',
      `Student: ${userText}`,
      `${MENTOR_NAME}:`,
    ].join('\n');

    let lastError = null;
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        const text = result?.response?.text?.();
        if (text && text.trim()) return text.trim();
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('No valid Gemini response');
  };

  const fallback = (text) => {
    const t = text.toLowerCase();
    if (t.includes('resume')) return 'Resume tip: keep it one page. Use the format — Action + Tech + Result. Add 2 strong projects with GitHub links and quantified impact.';
    if (t.includes('dsa') || t.includes('roadmap')) return 'DSA plan (30 days): Arrays/Strings (5d) → Hashing + Patterns (4d) → LinkedList/Stack/Queue (5d) → Trees/Graphs (8d) → Mock contests + revision (8d). Aim for 4-6 problems/day on GFG Practice.';
    if (t.includes('aptitude')) return 'For aptitude: 45 min daily on Quant + LR. Take one sectional mock every 3 days. Keep a mistake notebook and revise it weekly.';
    if (t.includes('interview') || t.includes('hr')) return 'For HR: prepare STAR stories (leadership, conflict, failure). For technical: revise your best project architecture, and do 2 mock interviews/week.';
    if (t.includes('project')) return 'Best project tip: pick one deployable full-stack app with auth + CRUD + a unique feature. Write a clear README, add a live demo link, and quantify its impact in your resume.';
    return `To use AI-powered responses, add your Gemini API key to the .env file as VITE_GEMINI_API_KEY. Get a free key at aistudio.google.com/app/apikey`;
  };

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', text: content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    persist(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await getMentorReply(messages, content);
      const mentorMsg = { role: 'mentor', text: reply };
      const final = [...nextMessages, mentorMsg];
      setMessages(final);
      persist(final);
    } catch (err) {
      console.error('PrepBuddy API error:', err);
      const errMsg = {
        role: 'mentor',
        text: `${fallback(content)}\n\n(PrepBuddy used backup mode because live AI is temporarily unavailable.)`,
      };
      const final = [...nextMessages, errMsg];
      setMessages(final);
      persist(final);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([initMessage]);
    try { localStorage.removeItem(MENTOR_CHAT_STORAGE_KEY); } catch {}
  };

  const latestPlanMessage = [...messages].reverse().find((m) => {
    if (m.role !== 'mentor') return false;
    const t = m.text.toLowerCase();
    return t.includes('day 1') || t.includes('7-day') || t.includes('weekly plan') || t.includes('week plan');
  });

  const latestMentorMessage = [...messages].reverse().find((m) => m.role === 'mentor');

  const downloadPlan = () => {
    const run = async () => {
      const planText = latestPlanMessage?.text || latestMentorMessage?.text;
      if (!planText) return;

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 48;
      const marginY = 52;
      const contentWidth = pageWidth - marginX * 2;

      const title = `${MENTOR_NAME} Placement Plan`;
      const meta = `Generated on: ${new Date().toLocaleString()}`;
      const footer = 'Tip: Regenerate from the Weekly Plan button for a fresh schedule.';

      let y = marginY;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(title, marginX, y);

      y += 24;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(meta, marginX, y);

      y += 22;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(planText, contentWidth);
      const lineHeight = 16;

      for (const line of lines) {
        if (y > pageHeight - marginY - 30) {
          doc.addPage();
          y = marginY;
        }
        doc.text(line, marginX, y);
        y += lineHeight;
      }

      y += 10;
      if (y > pageHeight - marginY) {
        doc.addPage();
        y = marginY;
      }

      doc.setFontSize(9);
      doc.setTextColor(90);
      doc.text(footer, marginX, y);

      const timestamp = new Date().toISOString().slice(0, 10);
      doc.save(`prepbuddy-plan-${timestamp}.pdf`);
    };

    run().catch(() => {
      // Keep UX silent here; download is optional.
    });
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-white/60 bg-white/20">
                    <Bot size={24} />
                  </div>
                  <h1 className="display-comic text-4xl md:text-5xl">{MENTOR_NAME}</h1>
                </div>
                <p className="mt-1 max-w-3xl text-lg font-extrabold text-white/95">
                  Your AI placement mentor — DSA roadmaps, resume tips, project guidance & interview strategy.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-white/30 bg-white/15 px-4 py-3 text-white">
                <Sparkles size={18} />
                <span className="font-black">{genAI ? 'AI mode active' : 'Demo mode — add API key'}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

          <ScrollReveal delay={0}>
            <aside className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-5 flex flex-col gap-4">
              <div>
                <h2 className="display-comic text-2xl mb-3">Quick Prompts</h2>
                <div className="space-y-2">
                  {quickPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => sendMessage(prompt)} disabled={loading}
                      className="w-full rounded-xl border-[2.5px] border-black bg-white px-3 py-3 text-left text-sm font-black transition-colors hover:bg-[var(--color-comic-yellow)] disabled:opacity-50">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => sendMessage(weeklyPlanPrompt)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-purple)] px-3 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                Generate My Weekly Plan
              </button>
              <button
                onClick={downloadPlan}
                disabled={loading || !latestMentorMessage}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[2px] border-black bg-white px-3 py-2.5 text-sm font-black shadow-[2px_2px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <Download size={14} /> Download Plan
              </button>
              <button onClick={clearChat}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[2px] border-black bg-[var(--color-comic-yellow)] px-3 py-2.5 text-sm font-black hover:bg-white transition-colors">
                <Trash2 size={14} /> Clear chat
              </button>
              {!genAI && (
                <div className="rounded-xl border-[2px] border-black/20 bg-[var(--color-comic-yellow)] px-3 py-3 text-xs font-bold text-black/60 leading-relaxed">
                  <p className="font-black text-black/80 mb-1">Enable AI responses</p>
                  Get a free Gemini key at <span className="font-black text-black">aistudio.google.com</span> and add it to your <span className="font-black text-black">.env</span> file:
                  <code className="block mt-1.5 rounded bg-black/10 px-2 py-1 font-mono text-[10px] break-all">VITE_GEMINI_API_KEY=your_key</code>
                </div>
              )}
            </aside>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <section className="comic-outline rounded-[2rem] bg-[var(--color-comic-cream)] p-5 flex flex-col">

              <div ref={chatRef} className="flex-1 h-[460px] overflow-y-auto rounded-xl border-[3px] border-black bg-white p-4">
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl border-[2.5px] border-black px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[var(--color-comic-purple)] text-white'
                          : 'bg-[var(--color-comic-yellow)] text-black'
                      }`}>
                        <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wide opacity-70">
                          {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                          {msg.role === 'user' ? 'You' : MENTOR_NAME}
                        </div>
                        <p className="text-sm font-bold leading-snug whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] px-4 py-3">
                        <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase opacity-70">
                          <Bot size={10} /> {MENTOR_NAME}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-black/60">
                          <Loader2 size={14} className="animate-spin" /> Thinking...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-4 flex gap-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${MENTOR_NAME} anything about placements...`}
                  disabled={loading}
                  className="flex-1 rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-purple)] disabled:opacity-60"
                />
                <button type="submit" disabled={!input.trim() || loading}
                  className="inline-flex items-center gap-2 rounded-xl border-[3px] border-black bg-[var(--color-comic-purple)] px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
                  <Send size={15} />
                  Send
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
