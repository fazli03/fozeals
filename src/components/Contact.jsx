export default function Contact() {
  const mailto =
    "mailto:fazli.maulana.035@gmail.com?subject=Hi%20Fazli%20%E2%80%94%20Let's%20Collaborate";

  return (
    <section id="inquiries">
      <div className="contact-inner reveal">
        <p className="section-eyebrow">Contact</p>
        <h2 className="contact-heading">Get in Touch</h2>
        <p className="contact-desc">
          Available for freelance and collaborative work. Let's build something
          extraordinary.
        </p>
        <a href={mailto} className="contact-email">
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
