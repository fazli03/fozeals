import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0,
      raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const loop = () => {  
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    // cleanup wajib: lepas listener & hentikan animasi saat komponen lepas
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={dotRef}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Telinga */}
          <circle cx="20" cy="25" r="15" fill="#0A0A0A" />
          <circle cx="80" cy="25" r="15" fill="#0A0A0A" />
          {/* Kepala */}
          <circle
            cx="50"
            cy="55"
            r="40"
            fill="#FFFBF1"
            stroke="#0A0A0A"
            strokeWidth="4"
          />
          {/* Area Mata */}
          <ellipse
            cx="32"
            cy="50"
            rx="12"
            ry="16"
            fill="#0A0A0A"
            transform="rotate(-20 32 50)"
          />
          <ellipse
            cx="68"
            cy="50"
            rx="12"
            ry="16"
            fill="#0A0A0A"
            transform="rotate(20 68 50)"
          />
          {/* Pupil */}
          <circle cx="34" cy="46" r="4" fill="#FFC94D" />
          <circle cx="66" cy="46" r="4" fill="#FFC94D" />
          {/* Hidung */}
          <ellipse cx="50" cy="70" rx="6" ry="4" fill="#0A0A0A" />
        </svg>
      </div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
}
