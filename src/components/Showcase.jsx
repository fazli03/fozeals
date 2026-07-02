import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, asset } from '../api';
import { useReveal } from '../hooks/useReveal';
import ToolBadge from './ToolBadge';

const delays = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-1'];
const isLarge = (i) => i % 4 === 0 || i % 4 === 3;
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function Showcase() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [sortDir, setSortDir] = useState('desc'); // 'desc' = terbaru dulu, 'asc' = terlama dulu
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  // urutkan berdasarkan bulan & tahun project dibuat
  const orderedProjects = useMemo(() => {
    const keyOf = (p) => (Number(p.year) || 0) * 12 + (Number(p.month) || 0);
    return [...projects].sort((a, b) =>
      sortDir === 'asc' ? keyOf(a) - keyOf(b) : keyOf(b) - keyOf(a)
    );
  }, [projects, sortDir]);

  // amati elemen .reveal lagi setelah project termuat
  useReveal([orderedProjects]);

  function handleSort(dir) {
    if (dir === sortDir) return;
    setIsSorting(true);
    setTimeout(() => {
      setSortDir(dir);
      setIsSorting(false);
    }, 220);
  }

  return (
    <section id="showcase">
      <div className="section-header reveal">
        <div>
          <button
            type="button"
            className={`section-eyebrow section-eyebrow-btn${sortDir === 'asc' ? ' active' : ''}`}
            onClick={() => handleSort('asc')}
            title="Urutkan dari project pertama dibuat"
          >
            Where It Began
          </button>
          <h2 className="section-title">Showcase</h2>
        </div>
        <button
          type="button"
          className={`section-count section-eyebrow-btn${sortDir === 'desc' ? ' active' : ''}`}
          onClick={() => handleSort('desc')}
          title="Urutkan dari project terbaru"
        >
          Recent Projects
        </button>
      </div>

      <div className={`showcase-grid${isSorting ? ' is-sorting' : ''}`} id="showcase-grid">
        {status === 'loading' && (
          <p className="showcase-loading">Memuat project...</p>
        )}
        {status === 'error' && (
          <p className="showcase-loading">Gagal memuat project.</p>
        )}
        {status === 'ready' && projects.length === 0 && (
          <p className="showcase-loading">Belum ada project.</p>
        )}

        {status === 'ready' &&
          orderedProjects.map((p, i) => {
            const large = isLarge(i) ? ' large' : '';
            const delay = delays[i % 4];
            const monthLabel = p.month ? MONTH_ABBR[p.month - 1] : '';
            const dateLabel = [monthLabel, p.year].filter(Boolean).join(' ');
            const cat = [p.category, dateLabel].filter(Boolean).join(' · ');

            return (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className={`showcase-item${large} reveal ${delay}`}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <img
                  src={asset(p.heroImage)}
                  alt={p.name}
                  className="showcase-img"
                />
                <div className="showcase-overlay">
                  <span className="showcase-cat">{cat}</span>
                  <h3 className="showcase-title">{p.name}</h3>
                  <div className="sc-tools">
                    {(p.tools || []).map((t) => (
                      <ToolBadge key={t} name={t} variant="dark" />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
}
