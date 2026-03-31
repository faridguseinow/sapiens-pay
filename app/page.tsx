import Link from "next/link";
import { Parallax } from "./_components/parallax";

const partners = [
  "AzBrand",
  "Baku Growth",
  "Caspian Media",
  "Nova Digital",
  "MarketLab",
  "AdsPro",
  "RetailUp",
  "ScaleX",
];

export default function Home() {
  return (
    <main className="landing">
      <Parallax />

      <header className="header">
        <div className="container header__inner">
          <Link className="logo" href="/">
            Sapiens Pay
          </Link>
          <a className="link-draw" href="#muraciet">
            Muraciet et
          </a>
        </div>
      </header>

      <section className="hero section" id="home">
        <div className="container">
          <p className="tag" data-parallax data-speed="-0.03">
            Sapiens Pay
          </p>
          <h1>Reklam budcenizi bank komissiyalarina qurban vermeyin.</h1>
          <p className="lead">
            Meta, Google Ads ve TikTok reklam odenisleri ucun xarici bank
            kartlarinin resmi acilisi. Daha az xerc, daha cox netice.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#muraciet">
              Indi basla
            </a>
            <a className="btn btn--ghost link-draw" href="#ustunlukler">
              Ustunlukler
            </a>
          </div>
        </div>
        <div className="orb orb--one" data-parallax data-speed="0.08" />
        <div className="orb orb--two" data-parallax data-speed="0.12" />
      </section>

      <section className="section partners" id="emekdasliq">
        <div className="container">
          <h2>Azerbaycanda bir cox sirketle emekdasliq edirik</h2>
          <p className="partners__lead">
            Asagidaki loqolar placeholder formatindadir ve istediyiniz vaxt real
            brend loqolari ile evez oluna biler.
          </p>
        </div>

        <div className="marquee marquee--left">
          <div className="marquee__track">
            {[...partners, ...partners].map((name, index) => (
              <div className="partner-chip" key={`left-${name}-${index}`}>
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="marquee marquee--right">
          <div className="marquee__track">
            {[...partners.slice().reverse(), ...partners.slice().reverse()].map(
              (name, index) => (
                <div className="partner-chip" key={`right-${name}-${index}`}>
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section" id="ustunlukler">
        <div className="container">
          <h2>Niye Sapiens Pay</h2>
          <ul className="grid">
            <li className="card" data-parallax data-speed="0.03">
              <h3>Tam resmi proses</h3>
              <p>Baki ofisinde seffaf ve guvenli sekilde butun merheleler.</p>
            </li>
            <li className="card" data-parallax data-speed="0.05">
              <h3>Maksimum qenaet</h3>
              <p>Davamli komissiya odemek evezine, bir defe duzgun sistem qur.</p>
            </li>
            <li className="card" data-parallax data-speed="0.04">
              <h3>Biznese fokus</h3>
              <p>Qenaet olunan budceni yeniden reklama ve satisa yonelt.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section contact" id="elaqe">
        <div className="container contact__inner">
          <div>
            <h2>Bize mesaj gonderin</h2>
            <p className="partners__lead">
              Forma hazirdir. Backend inteqrasiyasi novbeti merhelede qosulacaq.
            </p>
          </div>

          <form className="contact-form" action="#" method="post">
            <label>
              Ad ve soyad
              <input type="text" name="fullname" placeholder="Adiniz" required />
            </label>
            <label>
              E-poct
              <input
                type="email"
                name="email"
                placeholder="mail@example.com"
                required
              />
            </label>
            <label>
              Telefon
              <input type="tel" name="phone" placeholder="+994 xx xxx xx xx" />
            </label>
            <label>
              Mesaj
              <textarea
                name="message"
                rows={5}
                placeholder="Biznesiniz ve sorgunuz haqqinda qisa melumat yazin"
                required
              />
            </label>
            <button type="submit" className="btn btn--primary">
              Gonder
            </button>
          </form>
        </div>
      </section>

      <section className="section section--cta" id="muraciet">
        <div className="container cta">
          <p>Min defe komissiya odemekdense bir defe resmi kart sahibi ol.</p>
          <a className="btn btn--primary" href="mailto:info@sapiens-pay.com">
            Bizimle elaqe
          </a>
        </div>
      </section>
    </main>
  );
}
