export default function Footer() {
  const email = "fazli.maulana.035@gmail.com";
  const subject = "Hi Fazli — Let's Collaborate";
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent(subject)}`;

  return (
    <footer>
      <span className="footer-copy">
        © 2026 Fazli Maulana — All Rights Reserved
      </span>
      <ul className="footer-links">
        <li>
          <a
            href={gmailCompose}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-email"
          >
            fazli.maulana.035@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://github.com/fazli03"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
}
