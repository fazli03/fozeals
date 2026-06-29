import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, asset } from "../api";
import Cursor from "../components/Cursor";
import ToolBadge from "../components/ToolBadge";

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");
  const [imgIndex, setImgIndex] = useState(0);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProject(slug)
      .then((p) => {
        setProject(p);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  if (status === "loading")
    return (
      <>
        <Cursor />
        <div style={S.center}>Memuat...</div>
      </>
    );

  if (status === "error")
    return (
      <>
        <Cursor />
        <div style={S.center}>
          Project tidak ditemukan.
          <button style={S.backLink} onClick={() => navigate("/")}>
            Kembali ke Portfolio
          </button>
        </div>
      </>
    );

  const {
    name,
    category,
    year,
    role,
    timeline,
    tools,
    problemStatement,
    psLabel,
    solutions,
    prototypeUrl,
    codeUrl,
    heroImage,
    pageImages,
  } = project;
  const images = pageImages?.length ? pageImages : heroImage ? [heroImage] : [];

  return (
    <div style={S.page}>
      <Cursor />

      {/* BACK */}
      <button
        style={{
          ...S.backBtn,
          opacity: backHover ? 1 : 0.5,
          transform: backHover ? "translateX(-6px)" : "translateX(0)",
          gap: backHover ? 12 : 8,
        }}
        onClick={() => navigate("/")}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13 8H3M7 4l-4 4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Kembali
      </button>

      {/* HERO IMAGE — full viewport height */}
      {heroImage && (
        <div style={S.heroWrap}>
          <img src={asset(heroImage)} alt={name} style={S.heroImg} />
          <div style={S.heroOverlay}>
            <div style={S.heroMeta}>
              <span style={S.heroEyebrow}>
                {category}
                {year ? ` · ${year}` : ""}
              </span>
              <h1 style={S.heroTitle}>{name}</h1>
            </div>
          </div>
        </div>
      )}

      <div style={S.content}>
        {/* Judul jika tidak ada hero image */}
        {!heroImage && (
          <>
            <div style={S.metaRow}>
              <span style={S.eyebrow}>{category}</span>
              <span style={S.eyebrow}>{year}</span>
            </div>
            <h1 style={S.title}>{name}</h1>
          </>
        )}

        {/* INFO GRID */}
        <div style={S.infoGrid}>
          {role && <InfoItem label="Role" value={role} />}
          {timeline && <InfoItem label="Timeline" value={timeline} />}
          {tools?.length > 0 && (
            <div>
              <p style={S.infoLabel}>Tools & Stack</p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {tools.map((t) => (
                  <ToolBadge key={t} name={t} />
                ))}
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              gridColumn: "1/-1",
              marginTop: 8,
            }}
          >
            {prototypeUrl && (
              <a
                href={prototypeUrl}
                target="_blank"
                rel="noreferrer"
                style={S.link}
              >
                Lihat Prototype ↗
              </a>
            )}
            {codeUrl && (
              <a href={codeUrl} target="_blank" rel="noreferrer" style={S.link}>
                Lihat Code ↗
              </a>
            )}
          </div>
        </div>

        {/* PROBLEM & SOLUTION */}
        {(problemStatement || solutions) && (
          <div style={S.section}>
            <div style={S.divider} />
            {problemStatement && (
              <div style={{ marginBottom: 48 }}>
                <p style={S.sectionLabel}>{psLabel || "Problem Statement"}</p>
                <p style={S.body}>{problemStatement}</p>
              </div>
            )}
            {solutions && (
              <div>
                <p style={S.sectionLabel}>Solusi</p>
                <p style={S.body}>{solutions}</p>
              </div>
            )}
          </div>
        )}

        {/* SCREENSHOT CAROUSEL */}
        {images.length > 0 && (
          <div style={S.section}>
            <div style={S.divider} />
            <p style={S.sectionLabel}>Screenshots</p>
            <div style={S.carousel}>
              <img
                src={asset(images[imgIndex])}
                alt={`Screenshot ${imgIndex + 1}`}
                style={S.carouselImg}
              />
              {images.length > 1 && (
                <div style={S.carouselNav}>
                  <button
                    style={S.navBtn}
                    onClick={() =>
                      setImgIndex(
                        (i) => (i - 1 + images.length) % images.length,
                      )
                    }
                  >
                    ←
                  </button>
                  <span style={S.navCount}>
                    {imgIndex + 1} / {images.length}
                  </span>
                  <button
                    style={S.navBtn}
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div style={S.thumbRow}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={asset(img)}
                    alt={`thumb ${i + 1}`}
                    onClick={() => setImgIndex(i)}
                    style={{
                      ...S.thumb,
                      opacity: i === imgIndex ? 1 : 0.4,
                      border:
                        i === imgIndex
                          ? "2px solid #ffc94d"
                          : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p style={S.infoLabel}>{label}</p>
      <p style={S.infoValue}>{value}</p>
    </div>
  );
}

const S = {
  page: {
    background: "var(--bg, #fffbf1)",
    color: "var(--text-main, #ffffff)",
    fontFamily: '"Space Grotesk", sans-serif',
    minHeight: "100vh",
    paddingBottom: 80,
  },
  center: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: '"DM Mono", monospace',
    fontSize: 12,
  },
  backBtn: {
    position: "fixed",
    top: 24,
    left: 48,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "transparent",
    border: "none",
    cursor: "none",
    fontFamily: '"DM Mono", monospace',
    fontSize: 14,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#212418",
    padding: "10px 16px",
    transition:
      "opacity 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), gap 0.3s ease",
  },
  backLink: {
    background: "transparent",
    border: "1px solid currentColor",
    padding: "8px 16px",
    cursor: "none",
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
  },

  heroWrap: {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: 600,
    overflow: "hidden",
  },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 60%, transparent 100%)",
    display: "flex",
    alignItems: "flex-end",
  },
  heroMeta: { padding: "48px 64px" },
  heroEyebrow: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#ffc94d",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: "clamp(40px, 7vw, 88px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    textTransform: "uppercase",
    lineHeight: 0.9,
    color: "#fffbf1",
  },

  content: { maxWidth: 900, margin: "0 auto", padding: "64px 48px 0" },
  metaRow: { display: "flex", gap: 16, marginBottom: 16 },
  eyebrow: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "var(--text-muted, #666)",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "clamp(36px, 6vw, 72px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    textTransform: "uppercase",
    lineHeight: 0.95,
    marginBottom: 48,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "32px 48px",
    marginBottom: 16,
    paddingTop: 40,
    borderTop: "1px solid var(--border, #e6e1d6)",
  },
  infoLabel: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "var(--text-muted, #666)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  infoValue: { fontSize: 14, fontWeight: 500 },

  link: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#ffc94d",
    textDecoration: "none",
    border: "1px solid #ffc94d",
    padding: "12px 20px",
    display: "inline-block",
  },
  section: { marginTop: 64 },
  divider: {
    height: 1,
    background: "var(--border, #e6e1d6)",
    marginBottom: 48,
  },
  sectionLabel: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 9,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--text-muted, #666)",
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 1.85,
    color: "var(--text-main, #0a0a0a)",
    opacity: 0.8,
    maxWidth: 700,
  },

  carousel: { background: "var(--surface-1, #f4efe5)" },
  carouselImg: {
    width: "100%",
    maxHeight: 640,
    objectFit: "contain",
    display: "block",
  },
  carouselNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 16,
  },
  navBtn: {
    background: "transparent",
    border: "1px solid var(--border, #e6e1d6)",
    padding: "8px 20px",
    cursor: "none",
    fontFamily: '"DM Mono", monospace',
    fontSize: 14,
  },
  navCount: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "var(--text-muted, #666)",
  },
  thumbRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
  thumb: {
    width: 72,
    height: 54,
    objectFit: "cover",
    cursor: "none",
    transition: "opacity 0.2s, border 0.2s",
  },
};
