export default function Marquee() {
  const items = [
    'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Web Development',
    'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Web Development',
  ];

  return (
    <div className="marquee-track" aria-hidden="true">
      <div className="marquee-inner">
        {items.map((label, i) => (
          <span className="marquee-item" key={i}>
            {label} <span>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
