const TOOLS = {
  Figma: { slug: "figma", color: "F24E1E" },
  Webflow: { slug: "webflow", color: "4353FF" },
  Laravel: { slug: "laravel", color: "FF2D20" },
  PHP: { slug: "php", color: "777BB4" },
  Filament: { slug: "filament", color: "FDAE4B" },
  Notion: { slug: "notion", color: "000000" },
  Illustrator: { slug: "adobeillustrator", color: "FF9A00" },
  Photoshop: { slug: "adobephotoshop", color: "31A8FF" },
  "After Effects": { slug: "adobeaftereffects", color: "9999FF" },
  "Premiere Pro": { slug: "adobepremierepro", color: "9999FF" },
  Sketch: { slug: "sketch", color: "F7B500" },
  Framer: { slug: "framer", color: "0055FF" },
  "Next.js": { slug: "nextdotjs", color: "000000" },
  React: { slug: "react", color: "61DAFB" },
  Vue: { slug: "vuedotjs", color: "4FC08D" },
  "Tailwind CSS": { slug: "tailwindcss", color: "06B6D4" },
  TypeScript: { slug: "typescript", color: "3178C6" },
  JavaScript: { slug: "javascript", color: "F7DF1E" },
  Python: { slug: "python", color: "3776AB" },
  Docker: { slug: "docker", color: "2496ED" },
  MySQL: { slug: "mysql", color: "4479A1" },
  PostgreSQL: { slug: "postgresql", color: "4169E1" },
  Supabase: { slug: "supabase", color: "3ECF8E" },
  Firebase: { slug: "firebase", color: "FFCA28" },
  Git: { slug: "git", color: "F05032" },
  GitHub: { slug: "github", color: "181717" },
  Vercel: { slug: "vercel", color: "000000" },
  Vite: { slug: "vite", color: "646CFF" },
  "Node.js": { slug: "nodedotjs", color: "339933" },
  Express: { slug: "express", color: "000000" },
  MongoDB: { slug: "mongodb", color: "47A248" },
};

function findTool(name) {
  const key = Object.keys(TOOLS).find((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  );
  return key ? TOOLS[key] : null;
}

// variant="dark"  → dipakai di showcase overlay (ikon putih)
// variant="light" → dipakai di halaman detail (ikon warna asli brand)
export default function ToolBadge({ name, variant = "light" }) {
  const tool = findTool(name);
  const isDark = variant === "dark";
  const iconSrc = tool
    ? `https://cdn.simpleicons.org/${tool.slug}/${isDark ? "ffffff" : tool.color}`
    : null;

  return (
    <span className={isDark ? "sc-tool-badge" : "sc-tool-badge-dark"}>
      {iconSrc && (
        <img
          src={iconSrc}
          width="20"
          height="20"
          alt={name}
          style={{ display: "inline-block", verticalAlign: "middle" }}
        />
      )}
      <span>{name}</span>
    </span>
  );
}
