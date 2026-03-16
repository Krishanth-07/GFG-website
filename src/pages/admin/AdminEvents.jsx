import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Edit3, Trash2, Save, X, CalendarDays } from 'lucide-react';
import { getEvents, saveEvents } from '../../data/contentStore';
import ScrollReveal from '../../components/ScrollReveal';

const EVENT_TYPES = ['Hackathon', 'Coding Contest', 'Workshop', 'Seminar', 'Meetup', 'Other'];

const emptyForm = () => ({
  title: '', type: '', date: '', time: '', location: '', description: '', participants: '', registrationOpen: true,
});

const FormFields = ({ form, setForm }) => {
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const inp = 'w-full rounded-xl border-[2.5px] border-black bg-[var(--color-comic-yellow)] px-3 py-2 text-sm font-bold text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-comic-red)]';
  const lbl = 'text-xs font-black uppercase tracking-widest text-black/50 mb-1';
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-col">
        <label className={lbl}>Title *</label>
        <input className={inp} value={form.title} onChange={set('title')} placeholder="Event title" required />
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Type</label>
        <select className={inp} value={form.type} onChange={set('type')}>
          <option value="">Select...</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Date</label>
        <input className={inp} value={form.date} onChange={set('date')} placeholder="April 15-16, 2025" />
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Time</label>
        <input className={inp} value={form.time} onChange={set('time')} placeholder="2:00 PM - 4:00 PM" />
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Location</label>
        <input className={inp} value={form.location} onChange={set('location')} placeholder="Lab 3, CS Block" />
      </div>
      <div className="flex flex-col">
        <label className={lbl}>Expected Participants</label>
        <input className={inp} type="number" min="0" value={form.participants} onChange={set('participants')} placeholder="100" />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <input id="regOpen" type="checkbox" checked={!!form.registrationOpen}
          onChange={(e) => setForm((p) => ({ ...p, registrationOpen: e.target.checked }))}
          className="h-4 w-4 rounded border-2 border-black accent-[var(--color-comic-red)]" />
        <label htmlFor="regOpen" className="text-sm font-black text-black/70 cursor-pointer">Registration Open</label>
      </div>
      <div className="sm:col-span-2 flex flex-col">
        <label className={lbl}>Description *</label>
        <textarea className={`${inp} resize-none`} rows={2} value={form.description} onChange={set('description')} placeholder="Brief description of the event..." required />
      </div>
    </div>
  );
};

const typeColor = (t) => {
  if (t === 'Hackathon') return 'bg-[var(--color-comic-purple)] text-white';
  if (t === 'Coding Contest') return 'bg-[var(--color-comic-cyan)] text-black';
  if (t === 'Workshop') return 'bg-[#4de27a] text-black';
  return 'bg-[var(--color-comic-orange)] text-black';
};

const AdminEvents = () => {
  const [events, setEvents] = useState(() => getEvents());
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);

  const persist = (updated) => {
    setEvents(updated);
    saveEvents(updated);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.description.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: addForm.title.trim(),
      type: addForm.type || 'Other',
      date: addForm.date || '',
      time: addForm.time || '',
      location: addForm.location || '',
      description: addForm.description.trim(),
      participants: parseInt(addForm.participants) || 0,
      registrationOpen: !!addForm.registrationOpen,
    };
    persist([newEvent, ...events]);
    setAddForm(emptyForm());
    setShowAdd(false);
  };

  const startEdit = (ev) => {
    setEditId(ev.id);
    setEditForm({
      title: ev.title, type: ev.type || '', date: ev.date || '',
      time: ev.time || '', location: ev.location || '', description: ev.description || '',
      participants: String(ev.participants || ''), registrationOpen: !!ev.registrationOpen,
    });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const updated = events.map((ev) =>
      ev.id === editId
        ? {
            ...ev,
            title: editForm.title.trim(),
            type: editForm.type,
            date: editForm.date,
            time: editForm.time,
            location: editForm.location,
            description: editForm.description.trim(),
            participants: parseInt(editForm.participants) || 0,
            registrationOpen: !!editForm.registrationOpen,
          }
        : ev
    );
    persist(updated);
    setEditId(null);
  };

  const handleDelete = (id) => {
    persist(events.filter((ev) => ev.id !== id));
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
            <h1 className="display-comic text-2xl sm:text-3xl text-black flex-1">Manage Events</h1>
            <button onClick={() => { setShowAdd((s) => !s); setEditId(null); }}
              className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
              {showAdd ? <X size={14} /> : <PlusCircle size={14} />}
              {showAdd ? 'Cancel' : 'Add Event'}
            </button>
          </div>
        </ScrollReveal>

        {showAdd && (
          <ScrollReveal>
            <form onSubmit={handleAdd} className="mb-6 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-6 shadow-[6px_6px_0_#000]">
              <h2 className="display-comic text-xl mb-4">New Event</h2>
              <FormFields form={addForm} setForm={setAddForm} />
              <button type="submit"
                className="mt-4 flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[var(--color-comic-red)] px-5 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5">
                <Save size={14} /> Add Event
              </button>
            </form>
          </ScrollReveal>
        )}

        <div className="flex flex-col gap-3">
          {events.map((ev, i) => (
            <ScrollReveal key={ev.id} delay={i * 30}>
              {editId === ev.id ? (
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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-black bg-[var(--color-comic-cyan)]">
                      <CalendarDays size={14} className="text-black" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-black truncate">{ev.title}</p>
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {ev.type && <span className={`rounded-full border border-black px-2 py-0 text-[10px] font-black ${typeColor(ev.type)}`}>{ev.type}</span>}
                        {ev.date && <span className="text-xs font-bold text-black/50">{ev.date}</span>}
                        <span className={`text-[10px] font-black px-2 rounded-full border border-black ${ev.registrationOpen ? 'bg-[#4de27a] text-black' : 'bg-slate-200 text-slate-500'}`}>
                          {ev.registrationOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {confirmId === ev.id ? (
                      <>
                        <span className="text-xs font-black text-black/60">Delete?</span>
                        <button onClick={() => handleDelete(ev.id)}
                          className="rounded-lg border-[2px] border-black bg-[var(--color-comic-red)] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">Yes</button>
                        <button onClick={() => setConfirmId(null)}
                          className="rounded-lg border-[2px] border-black bg-[var(--color-comic-cream)] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">No</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { startEdit(ev); setShowAdd(false); }}
                          className="flex items-center gap-1 rounded-lg border-[2px] border-black bg-[var(--color-comic-purple)] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0_#000] hover:-translate-y-0.5 transition-transform">
                          <Edit3 size={12} /> Edit
                        </button>
                        <button onClick={() => setConfirmId(ev.id)}
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

export default AdminEvents;
