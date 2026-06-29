import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, asset } from '../api';
import { useReveal } from '../hooks/useReveal';
import ToolBadge from './ToolBadge';

const delays = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-1'];
const isLarge = (i) => i % 4 === 0 || i % 4 === 3;

export default function Showcase() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  // amati elemen .reveal lagi setelah project termuat
  useReveal([projects]);

  return (
    <section id="showcase">
      <div className="section-header reveal">
        <div>
          <p className="section-eyebrow">Selected Project</p>
          <h2 className="section-title">Showcase</h2>
        </div>
        <span className="section-count">Recent Projects</span>
      </div>

      <div className="showcase-grid" id="showcase-grid">
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
          projects.map((p, i) => {
            const large = isLarge(i) ? ' large' : '';
            const delay = delays[i % 4];
            const cat = [p.category, p.year].filter(Boolean).join(' · ');

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
