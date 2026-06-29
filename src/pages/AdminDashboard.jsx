import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getProjects, saveProject, deleteProject } from '../api';

const EMPTY = {
  dbId: null, id: '', name: '', category: '', year: '', role: '',
  timeline: '', tools: '', problemStatement: '', solutions: '',
  prototypeUrl: '', codeUrl: '', heroImage: '', pageImages: [],
};

export default function AdminDashboard() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState({ msg: '', type: '' });

  async function load() {
    setLoading(true);
    try { setProjects(await getProjects()); }
    catch { showToast('Gagal memuat data.', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function showToast(msg, type = '') {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  }

  function openAdd() {
    setForm(EMPTY);
    setModal(true);
  }

  function openEdit(p) {
    setForm({
      dbId: p.dbId, id: p.id, name: p.name || '',
      category: p.category || '', year: p.year || '',
      role: p.role || '', timeline: p.timeline || '',
      tools: (p.tools || []).join(', '),
      problemStatement: p.problemStatement || '',
      solutions: p.solutions || '',
      prototypeUrl: p.prototypeUrl || '',
      codeUrl: p.codeUrl || '',
      heroImage: p.heroImage || '',
      pageImages: p.pageImages || [],
    });
    setModal(true);
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    if (!form.name.trim()) { showToast('Nama project wajib diisi.', 'error'); return; }
    setSaving(true);
    try {
      await saveProject({
        ...form,
        tools: form.tools.split(',').map(t => t.trim()).filter(Boolean),
      });
      setModal(false);
      await load();
      showToast(form.dbId ? 'Project diperbarui.' : 'Project ditambahkan.', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(dbId, name) {
    try {
      await deleteProject(dbId);
      await load();
      showToast(`"${name}" dihapus.`, 'error');
    } catch (err) {
      showToast(err.message || 'Gagal menghapus.', 'error');
    }
    setConfirmId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.sans, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={S.nav}>
        <span style={S.navLogo}>Portfolio — Admin</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/" style={S.navLink}>← Portfolio</a>
          <button onClick={handleLogout} style={S.navLogout}>Logout</button>
        </div>
      </nav>

      <main style={S.main}>
        <div style={S.header}>
          <div>
            <p style={S.eyebrow}>Content Management</p>
            <h1 style={S.h1}>Projects</h1>
          </div>
          <button style={S.btnPrimary} onClick={openAdd}>+ Tambah Project</button>
        </div>

        {loading && <p style={S.muted}>Memuat data...</p>}

        {!loading && projects.length === 0 && (
          <div style={S.empty}>
            <p style={S.muted}>Belum ada project</p>
            <button style={S.btnPrimary} onClick={openAdd}>Tambah Pertama</button>
          </div>
        )}

        {!loading && projects.map((p, i) => (
          <div key={p.dbId} style={S.row}>
            <span style={S.num}>P—{String(i + 1).padStart(2, '0')}</span>
            <div style={{ flex: 1 }}>
              <h3 style={S.rowName}>{p.name}</h3>
              <div style={S.meta}>
                <span>{p.category || '—'}</span>
                <span>·</span>
                <span>{p.year || '—'}</span>
                <span>·</span>
                <span>{(p.pageImages || []).length} gambar</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={S.btnEdit} onClick={() => openEdit(p)}>Edit</button>
              <button style={S.btnDanger} onClick={() => setConfirmId({ dbId: p.dbId, name: p.name })}>Hapus</button>
            </div>
          </div>
        ))}
      </main>

      {/* MODAL FORM */}
      {modal && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div style={S.modalBox}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>{form.dbId ? 'Edit Project' : 'Tambah Project'}</h2>
              <button style={S.closeBtn} onClick={() => setModal(false)}>✕</button>
            </div>

            <div style={S.modalBody}>
              <Field label="Nama Project *"><input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="cth. FitStudio App" /></Field>
              <div style={S.grid2}>
                <Field label="Kategori"><input style={S.input} value={form.category} onChange={e => set('category', e.target.value)} placeholder="UI/UX Design" /></Field>
                <Field label="Tahun"><input style={S.input} value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024" /></Field>
                <Field label="Role"><input style={S.input} value={form.role} onChange={e => set('role', e.target.value)} placeholder="UI/UX Designer" /></Field>
                <Field label="Timeline"><input style={S.input} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Jan – Mar 2024" /></Field>
              </div>
              <Field label="Tools & Stack (pisahkan koma)"><input style={S.input} value={form.tools} onChange={e => set('tools', e.target.value)} placeholder="Figma, Next.js, Tailwind" /></Field>
              <Field label="Problem Statement"><textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} value={form.problemStatement} onChange={e => set('problemStatement', e.target.value)} /></Field>
              <Field label="Solusi"><textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} value={form.solutions} onChange={e => set('solutions', e.target.value)} /></Field>
              <div style={S.grid2}>
                <Field label="URL Prototype"><input style={S.input} value={form.prototypeUrl} onChange={e => set('prototypeUrl', e.target.value)} placeholder="https://figma.com/..." /></Field>
                <Field label="URL Code / Live"><input style={S.input} value={form.codeUrl} onChange={e => set('codeUrl', e.target.value)} placeholder="https://github.com/..." /></Field>
              </div>
              <Field label="URL Hero Image"><input style={S.input} value={form.heroImage} onChange={e => set('heroImage', e.target.value)} placeholder="https://..." /></Field>

              <p style={S.sectionLabel}>Screenshot Halaman (URL)</p>
              {form.pageImages.map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    style={{ ...S.input, flex: 1, border: `1px solid ${C.border}`, padding: '8px 12px' }}
                    value={url}
                    onChange={e => {
                      const imgs = [...form.pageImages];
                      imgs[i] = e.target.value;
                      set('pageImages', imgs);
                    }}
                    placeholder="https://..."
                  />
                  <button style={S.btnDanger} onClick={() => set('pageImages', form.pageImages.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
              <button style={S.btnGhost} onClick={() => set('pageImages', [...form.pageImages, ''])}>+ Tambah URL Gambar</button>
            </div>

            <div style={S.modalFooter}>
              <button style={S.btnGhost} onClick={() => setModal(false)}>Batal</button>
              <button style={S.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* KONFIRMASI HAPUS */}
      {confirmId && (
        <div style={S.overlay}>
          <div style={{ ...S.modalBox, maxWidth: 400, padding: 48, textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 12 }}>Hapus Project?</h3>
            <p style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, marginBottom: 32 }}>"{confirmId.name}" akan dihapus permanen.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button style={S.btnGhost} onClick={() => setConfirmId(null)}>Batal</button>
              <button style={S.btnDanger} onClick={() => handleDelete(confirmId.dbId, confirmId.name)}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.msg && (
        <div style={{ ...S.toast, background: toast.type === 'success' ? '#27ae60' : toast.type === 'error' ? '#c0392b' : C.text }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 0 }}>
      <label style={{ display: 'block', fontFamily: C.mono, fontSize: 9, letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase', padding: '16px 0 6px' }}>{label}</label>
      {children}
    </div>
  );
}

const C = {
  bg: '#0a0a0a', surface: '#141414', border: '#242424',
  text: '#fffbf1', muted: '#666', accent: '#ffc94d',
  mono: '"DM Mono", monospace', sans: '"Space Grotesk", sans-serif',
};

const S = {
  nav:        { position: 'sticky', top: 0, zIndex: 100, background: C.text, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)' },
  navLogo:    { fontFamily: C.mono, fontSize: 11, letterSpacing: '0.18em', color: C.bg, textTransform: 'uppercase' },
  navLink:    { fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', textDecoration: 'none', textTransform: 'uppercase', color: '#666' },
  navLogout:  { fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', border: 'none', cursor: 'pointer', color: '#c0392b' },
  main:       { maxWidth: 1100, margin: '0 auto', padding: '64px 48px' },
  header:     { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 64, paddingBottom: 32, borderBottom: `1px solid ${C.border}` },
  eyebrow:    { fontFamily: C.mono, fontSize: 10, letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase', marginBottom: 12 },
  h1:         { fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 0.95 },
  row:        { display: 'flex', alignItems: 'center', gap: 24, padding: '24px 0', borderBottom: `1px solid ${C.border}` },
  num:        { fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', color: C.muted, minWidth: 40 },
  rowName:    { fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: 4 },
  meta:       { display: 'flex', gap: 12, fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: '0.1em' },
  muted:      { fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: '0.15em', padding: '32px 0' },
  empty:      { padding: 80, textAlign: 'center', border: `1px dashed ${C.border}` },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 8, background: C.text, color: C.bg, fontFamily: C.mono, fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '16px 32px', border: 'none', cursor: 'pointer' },
  btnGhost:   { background: 'transparent', color: C.muted, fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '12px 20px', border: `1px solid ${C.border}`, cursor: 'pointer' },
  btnEdit:    { background: 'transparent', color: C.text, fontFamily: C.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 16px', border: `1px solid ${C.border}`, cursor: 'pointer' },
  btnDanger:  { background: 'transparent', color: '#c0392b', fontFamily: C.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 16px', border: '1px solid #c0392b', cursor: 'pointer' },
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.8)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 24px', overflowY: 'auto' },
  modalBox:   { background: C.bg, width: '100%', maxWidth: 760, border: `1px solid ${C.border}`, margin: 'auto' },
  modalHeader:{ padding: '32px 40px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: C.bg, zIndex: 10 },
  modalTitle: { fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase' },
  closeBtn:   { width: 36, height: 36, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBody:  { padding: '0 40px 24px' },
  modalFooter:{ padding: '28px 40px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 12, background: C.surface },
  input:      { width: '100%', background: 'transparent', border: 'none', outline: 'none', color: C.text, fontFamily: C.sans, fontSize: 14, paddingBottom: 16 },
  grid2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' },
  sectionLabel:{ fontFamily: C.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.accent, padding: '24px 0 12px' },
  toast:      { position: 'fixed', bottom: 32, right: 32, color: '#fff', fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '16px 24px', zIndex: 9999 },
};
