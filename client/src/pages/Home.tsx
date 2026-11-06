import { ArrowRight, BookOpenText, Building2, CalendarDays, Globe2, HeartHandshake } from "lucide-react";
import { Link } from "wouter";
import { ArticleCard } from "@/components/site/LegacyArticle";
import { media, articles } from "@/data/siteContent";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <img className="hero-image" src={media.whiteHouse2026} alt="IBAA monastic and lay leaders gathered at the White House complex in Washington, DC." width="1200" height="800" fetchPriority="high" decoding="async" />
        <div className="hero-overlay" />
        <div className="site-container hero-content">
          <p className="eyebrow light">International Buddhist Association of America</p>
          <h1>Uniting America’s<br />Buddhist Traditions</h1>
          <p>IBAA brings Theravada, Mahayana, and Vajrayana communities together to promote, preserve, and protect the Buddha-Dharma.</p>
          <div className="hero-actions">
            <Link className="button-primary light-button" href="/about">Discover IBAA <ArrowRight aria-hidden="true" /></Link>
            <Link className="button-secondary light-outline" href="/join">Join our community</Link>
          </div>
        </div>
        <p className="hero-caption">IBAA leaders at the White House complex, April 2026. Official White House photo by Patrick B. Ruddy.</p>
      </section>

      <section className="mission-band">
        <div className="site-container mission-grid">
          <div>
            <p className="eyebrow">A national Buddhist voice</p>
            <h2>Many traditions. One shared commitment.</h2>
          </div>
          <p>IBAA is a non-sectarian umbrella organization dedicated to collaboration among Buddhist communities in the United States. We create spaces for study, public service, interfaith partnership, and national representation.</p>
        </div>
      </section>

      <section className="traditions-section site-container">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">The Buddhist family</p><h2>Three-tradition umbrella, many living worlds</h2></div>
          <p>Theravada, Mahayana, and Vajrayana are a useful IBAA framework—not sealed or exhaustive categories. Our work honors diversity within and across them.</p>
        </div>
        <div className="tradition-grid">
          <article><span>01</span><h3>Theravada</h3><p>Pali traditions shaped by diverse monastic and lay communities across Sri Lanka, Southeast Asia, South Asia, and the world.</p></article>
          <article><span>02</span><h3>Mahayana</h3><p>A broad family including Pure Land, Chan, Seon, Zen, Thiền, Tiantai, Huayan, Nichiren, and many other living contexts.</p></article>
          <article><span>03</span><h3>Vajrayana</h3><p>Esoteric paths within wider Mahayana histories, especially prominent in Tibetan and Himalayan traditions and present beyond Tibet.</p></article>
        </div>
        <div className="traditions-action"><Link className="text-link" href="/buddhist-traditions">Explore Buddhist traditions <ArrowRight /></Link></div>
      </section>

      <section className="feature-story">
        <div className="site-container feature-story-grid">
          <figure><img src={media.whiteHouse2024} alt="Buddhist representatives at the fourth White House Vesak celebration in 2024." loading="lazy" /><figcaption>Fourth White House Vesak observance, 2024.</figcaption></figure>
          <div>
            <p className="eyebrow light">National leadership</p>
            <h2>Representing Buddhist communities in the nation’s public life</h2>
            <p>IBAA’s White House Vesak participation and inter-Buddhist delegations reflect a continuing commitment to national cooperation, religious understanding, and public service.</p>
            <Link className="text-link light-link" href="/annual-delegates">Explore annual delegations <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="programs-preview site-container">
        <div className="section-heading"><p className="eyebrow">Our work</p><h2>Practice, learning, and service</h2></div>
        <div className="program-grid">
          <Link href="/study-circles"><BookOpenText aria-hidden="true" /><h3>Dharma Study Circles</h3><p>Rotating gatherings hosted by Buddhist communities for teaching, conversation, and fellowship.</p><span>Explore the program <ArrowRight /></span></Link>
          <Link href="/programs/youth"><HeartHandshake aria-hidden="true" /><h3>Youth & Next Generations</h3><p>Resources and programs that help young Buddhists connect practice, identity, and service.</p><span>View youth resources <ArrowRight /></span></Link>
          <Link href="/programs"><Globe2 aria-hidden="true" /><h3>Interfaith & Pilgrimage</h3><p>Building relationships across traditions and connecting communities to sacred places and shared action.</p><span>See all programs <ArrowRight /></span></Link>
        </div>
      </section>

      <section className="study-feature">
        <div className="site-container study-feature-grid">
          <div className="study-copy"><p className="eyebrow">Dharma Study Circles</p><h2>Learning across communities</h2><p>Study Circles create a recurring place for Buddhist communities to host one another, share teaching, and build durable relationships across traditions.</p><div className="study-facts"><span><CalendarDays />Recurring gatherings</span><span><Building2 />Hosted by local temples</span></div><Link className="button-primary" href="/study-circles">View Study Circles</Link></div>
          <figure><img src={media.studyCircle2026} alt="Participants gathered inside Drikung Kagyu Temple for an IBAA Dharma Study Circle in August 2026." loading="lazy" /><figcaption>Drikung Kagyu Temple, August 15, 2026.</figcaption></figure>
        </div>
      </section>

      <section className="news-preview site-container">
        <div className="section-heading with-link"><div><p className="eyebrow">From the archive</p><h2>News & public record</h2></div><Link className="text-link" href="/news-media">View all news <ArrowRight /></Link></div>
        <div className="article-grid">{articles.map(article => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>

      <section className="participate-band">
        <div className="site-container participate-grid">
          <div><p className="eyebrow light">Participate</p><h2>Strengthen Buddhist community in America</h2><p>Join IBAA, connect a temple, support a program, or help preserve a national Buddhist archive for the next generation.</p></div>
          <div className="participate-actions"><Link className="button-primary light-button" href="/join">Join IBAA</Link><Link className="button-secondary light-outline" href="/donate">Support our work</Link></div>
        </div>
      </section>
    </>
  );
}
