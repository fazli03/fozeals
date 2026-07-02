import fzlImg from "../assets/fzl.png";

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-left">
        <p className="hero-tag">Portfolio 2026 — Jakarta, Indonesia</p>

        <div className="hero-lockup">
          <h1 className="hero-name">
            <span className="line">Fazli</span>
            <span className="line line-2">Maulana</span>
          </h1>
        </div>

        <div className="hero-rule"></div>
        <p className="hero-desc">
          Designing thoughtful digital products through research, strategy, and
          user-centered experiences that create value for both users and
          businesses.
        </p>
      </div>

      <div className="hero-right">
        <div className="hero-img-wrap">
          <img src={fzlImg} alt="Fazli Maulana" />
        </div>
        <span className="hero-img-label">Profile — Jakarta</span>
      </div>
    </section>
  );
}
