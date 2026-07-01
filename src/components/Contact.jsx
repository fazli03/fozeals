export default function Contact() {
  const email = "fazli.maulana.035@gmail.com";
  const subject = "Hi Fazli — Let's Collaborate";
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent(subject)}`;

  return (
    <section id="inquiries">
      <div className="contact-inner reveal">
        <p className="section-eyebrow">Contact</p>
        <h2 className="contact-heading">Get in Touch</h2>
        <p className="contact-desc">
          Available for freelance and collaborative work. Let's build something
          extraordinary.
        </p>
        <a
          href={gmailCompose}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-email"
        >
          fazli.maulana.035@gmail.com
        </a>
        <div className="contact-links">
          <a href="https://github.com/fazli03" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
