import React, { useState } from "react";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const CONTACT_STORAGE_KEY = "gfg_contact_messages_v1";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitNote, setSubmitNote] = useState("");
  const [submissions, setSubmissions] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      nextErrors.name = "Please enter a valid full name.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const nextSubmissions = [payload, ...submissions].slice(0, 5);
    setSubmissions(nextSubmissions);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(nextSubmissions));
    }

    setSubmitNote("Message sent successfully. We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-8 shadow-[8px_8px_0_#000]">
          <h1 className="display-comic text-4xl md:text-5xl">Get In Touch</h1>
          <p className="mt-3 text-lg font-extrabold text-black/85">
            Have questions, partnership ideas, or want to join the core team? Send a quick message.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          <ScrollReveal delay={0}>
            <div className="comic-outline h-full rounded-[2rem] bg-[var(--color-comic-cream)] p-6 space-y-8">
              <div>
                <h2 className="display-comic text-3xl">Contact Info</h2>
                <p className="mt-2 text-base font-bold text-black/80">Reach out through any of these channels.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="comic-outline-soft h-12 w-12 rounded-xl bg-[var(--color-comic-cyan)] text-white flex items-center justify-center shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Email Us</h3>
                    <p className="font-bold">gfgcampus@college.edu</p>
                    <p className="mt-1 font-bold text-black/70">We usually reply within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="comic-outline-soft h-12 w-12 rounded-xl bg-[var(--color-comic-orange)] text-white flex items-center justify-center shrink-0">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Join Community</h3>
                    <a href="#" className="font-bold underline decoration-black underline-offset-4">Discord Server</a>
                    <p className="mt-1 font-bold text-black/70">Connect with 500+ student developers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="comic-outline-soft h-12 w-12 rounded-xl bg-[var(--color-comic-purple)] text-white flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Visit Us</h3>
                    <p className="font-bold">Computer Science Block, Room 304</p>
                    <p className="mt-1 font-bold text-black/70">Every Wednesday, 4 PM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="comic-outline rounded-[2rem] bg-[var(--color-comic-purple)] p-6 text-white">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-black uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border-[3px] border-black bg-[var(--color-comic-cream)] px-4 py-3 text-black placeholder:text-black/50 focus:outline-none"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-2 text-xs font-black text-red-200">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-black uppercase tracking-wider">College Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border-[3px] border-black bg-[var(--color-comic-cream)] px-4 py-3 text-black placeholder:text-black/50 focus:outline-none"
                    placeholder="john@college.edu"
                  />
                  {errors.email && <p className="mt-2 text-xs font-black text-red-200">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-black uppercase tracking-wider">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full resize-none rounded-xl border-[3px] border-black bg-[var(--color-comic-cream)] px-4 py-3 text-black placeholder:text-black/50 focus:outline-none"
                    placeholder="How can we help you?"
                  />
                  {errors.message && <p className="mt-2 text-xs font-black text-red-200">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="comic-outline w-full rounded-xl bg-[var(--color-comic-cream)] py-4 text-lg font-black text-black flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
                >
                  Join Coding Club
                  <Send size={20} />
                </button>

                {submitNote && (
                  <p className="rounded-lg border-[2px] border-black bg-[var(--color-comic-cream)] px-3 py-2 text-center text-xs font-black text-black">
                    {submitNote}
                  </p>
                )}
              </form>
            </div>
          </ScrollReveal>

        </div>

        {submissions.length > 0 && (
          <div className="mt-8 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-6">
            <h2 className="display-comic text-2xl">Recent Messages</h2>
            <div className="mt-4 space-y-3">
              {submissions.map((item) => (
                <div key={item.createdAt} className="rounded-xl border-[2px] border-black bg-white p-3">
                  <div className="text-sm font-black">{item.name} • {item.email}</div>
                  <div className="mt-1 text-xs font-bold text-black/70">{new Date(item.createdAt).toLocaleString()}</div>
                  <p className="mt-2 text-sm font-bold text-black/85">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
