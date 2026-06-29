export default function Footer() {
  const mailto =
    "mailto:fazli.maulana.035@gmail.com?subject=Hi%20Fazli%20%E2%80%94%20Let's%20Collaborate";

  return (
    <footer>
      <span className="footer-copy">
        © 2026 Fazli Maulana — All Rights Reserved
      </span>
      <ul className="footer-links">
        <li><a href={mailto}>Email</a></li>
        <li>
          <a href="https://github.com/fazli03" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
}
