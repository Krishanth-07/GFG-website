import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Edit3, Trash2, Save, X, BookOpen } from 'lucide-react';
import { getBlogPosts, saveBlogPosts } from '../../data/contentStore';
import ScrollReveal from '../../components/ScrollReveal';

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORIES = ['DSA', 'Web Dev', 'Competitive Programming', 'Interview Prep', 'Open Source', 'Tools', 'Career', 'Other'];

const emptyForm = () => ({
  title: '', category: '', readTime: '', date: '', excerpt: '', content: '',
});

const FormFields = ({ form, setForm }) => {
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const inp = 'w-full rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] px-3 py-2 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]';
  const lbl = 'text-xs font-black uppercase tracking-widest text-black/50 mb-1';
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-col">
        <label className={lbl}>Title *</label>
        <input className={inp} value={form.title} onChange={set('title')} placeholder="Post title" required />
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Category</label>
        <select className={inp} value={form.category} onChange={set('category')}>
          <option value="">Select...</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Read Time</label>
        <input className={inp} value={form.readTime} onChange={set('readTime')} placeholder="5 min read" />
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Date</label>
        <input className={inp} type="date" value={form.date} onChange={set('date')} />
      </div>
      <div className="sm:col-span-2 flex flex-col">
        <label className={lbl}>Excerpt *</label>
        <textarea className={`${inp} resize-none`} rows={2} value={form.excerpt} onChange={set('excerpt')} placeholder="Short description shown in the blog list..." required />
      </div>
      <div className="sm:col-span-2 flex flex-col">
        <label className={lbl}>Content (one paragraph per line)</label>
        <textarea className={`${inp} resize-y`} rows={6} value={form.content} onChange={set('content')} placeholder={"Paragraph 1...\nParagraph 2...\nParagraph 3..."} />
      </div>
    </div>
  );
};

const AdminBlog = () => {
  const [posts, setPosts] = useState(() => getBlogPosts());
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);

  const persist = (updated) => {
    setPosts(updated);
    saveBlogPosts(updated);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.excerpt.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      slug: slugify(addForm.title),
      title: addForm.title.trim(),
      category: addForm.category || 'Other',
      readTime: addForm.readTime || '5 min read',
      date: addForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      excerpt: addForm.excerpt.trim(),
      content: addForm.content ? addForm.content.split('\n').filter(Boolean) : [],
      author: { name: 'GFG Admin', role: 'Admin' },
    };
    persist([newPost, ...posts]);
    setAddForm(emptyForm());
    setShowAdd(false);
  };

  const startEdit = (post) => {
    setEditId(post.id);
    setEditForm({
      title: post.title,
      category: post.category || '',
      readTime: post.readTime || '',
      date: post.date || '',
      excerpt: post.excerpt || '',
      content: Array.isArray(post.content) ? post.content.join('\n') : (post.content || ''),
    });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const updated = posts.map((p) =>
      p.id === editId
        ? {
            ...p,
            title: editForm.title.trim(),
            slug: slugify(editForm.title),
            category: editForm.category,
            readTime: editForm.readTime,
            date: editForm.date,
            excerpt: editForm.excerpt.trim(),
            content: editForm.content ? editForm.content.split('\n').filter(Boolean) : [],
          }
        : p
    );
    persist(updated);
    setEditId(null);
  };

  const handleDelete = (id) => {
    persist(posts.filter((p) => p.id !== id));
    setConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        <ScrollReveal>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link to="/admin/dashboard"
              className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-cream)] px-3 py-2 text-sm font-black shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
              <ArrowLeft size={14} /> Back
            </Link>
            <h1 className="display-comic text-2xl sm:text-3xl text-black flex-1">Manage Blog</h1>
            <button onClick={() => { setShowAdd((s) => !s); setEditId(null); }}
              className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
              {showAdd ? <X size={14} /> : <PlusCircle size={14} />}
              {showAdd ? 'Cancel' : 'Add Post'}
            </button>
          </div>
        </ScrollReveal>

        {showAdd && (
          <ScrollReveal>
            <form onSubmit={handleAdd} className="mb-6 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-6 shadow-[6px_6px_0_#000]">
              <h2 className="display-comic text-xl mb-4">New Blog Post</h2>
              <FormFields form={addForm} setForm={setAddForm} />
              <button type="submit"
                className="mt-4 flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)] px-5 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                <Save size={14} /> Publish Post
              </button>
            </form>
          </ScrollReveal>
        )}

        <div className="flex flex-col gap-3">
          {posts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 30}>
              {editId === post.id ? (
                <form onSubmit={handleEditSave} className="rounded-2xl border-[2.5px] border-black bg-[var(--color-comic-cream)] p-5 shadow-[4px_4px_0_#000]">
                  <FormFields form={editForm} setForm={setEditForm} />
                  <div className="mt-4 flex gap-2">
                    <button type="submit"
                      className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                      <Save size={14} /> Save
                    </button>
                    <button type="button" onClick={() => setEditId(null)}
                      className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border-[2.5px] border-black bg-[var(--color-comic-cream)] p-4 shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-black bg-[var(--color-comic-red)]">
                      <BookOpen size={14} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-black truncate">{post.title}</p>
                      <p className="text-xs font-bold text-black/50">{post.category} · {post.readTime} · {post.date}</p>
                      <p className="text-xs text-black/40 truncate">{post.excerpt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {confirmId === post.id ? (
                      <>
                        <span className="text-xs font-black text-black/60">Delete?</span>
                        <button onClick={() => handleDelete(post.id)}
                          className="rounded-lg border-[2px] border-black bg-[var(--color-comic-red)] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">Yes</button>
                        <button onClick={() => setConfirmId(null)}
                          className="rounded-lg border-[2px] border-black bg-[var(--color-comic-cream)] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">No</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { startEdit(post); setShowAdd(false); }}
                          className="flex items-center gap-1 rounded-lg border-[2px] border-black bg-[var(--color-comic-purple)] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">
                          <Edit3 size={12} /> Edit
                        </button>
                        <button onClick={() => setConfirmId(post.id)}
                          className="flex items-center gap-1 rounded-lg border-[2px] border-black bg-[var(--color-comic-yellow)] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform text-[var(--color-comic-red)]">
                          <Trash2 size={12} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
