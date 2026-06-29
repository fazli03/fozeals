import { useEffect } from 'react';

// Satu observer dipakai bersama semua section.
let observer;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // PENTING: 'is-visible' ini cuma tebakan. Samakan dengan kelas
            // yang dipakai style.css-mu untuk MENAMPILKAN elemen .reveal
            // (bisa jadi 'visible', 'active', 'in-view', dll).
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }
  return observer;
}

// deps: kalau ada data async (mis. project) yang baru muncul, kirim sebagai
// dependency supaya elemen .reveal baru ikut diamati setelah render ulang.
export function useReveal(deps = []) {
  useEffect(() => {
    const obs = getObserver();
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
