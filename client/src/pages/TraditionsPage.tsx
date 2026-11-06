import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { MediaFigure } from "@/components/site/ContentPrimitives";
import { PageHero } from "@/components/site/PageHero";
import { media, practicePaths, traditionSources, traditionWorlds } from "@/data/siteContent";

function SourceLinks({ ids }: { ids: number[] }) {
  return (
    <sup className="source-links" aria-label={`Sources ${ids.join(", ")}`}>
      {ids.map((id, index) => (
        <span key={id}>
          {index > 0 ? " " : null}
          <a href={`#tradition-source-${id}`}>{id}</a>
        </span>
      ))}
    </sup>
  );
}

export default function TraditionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Buddhist Traditions"
        title="One Dharma, many living worlds"
        intro="An accessible introduction to Buddhism’s shared foundations, overlapping historical families, regional lineages, practices, and contemporary communities."
        aside={<a className="button-primary" href="#living-worlds">Explore living worlds</a>}
      />

      <section className="traditions-intro site-container" aria-labelledby="traditions-framework-title">
        <div>
          <p className="eyebrow">A framework for understanding</p>
          <h2 id="traditions-framework-title">IBAA’s three-tradition umbrella is a beginning—not a boundary</h2>
        </div>
        <div>
          <p className="lead">IBAA brings Theravada, Mahayana, and Vajrayana communities together as equal partners. These names are useful for national cooperation, but they are not three sealed or internally uniform denominations.</p>
          <p>Vajrayana developed within wider Mahayana histories, and Buddhist communities are also shaped by region, language, scripture, lineage, ritual, migration, and local culture.<SourceLinks ids={[1, 2]} /> This page therefore moves from a simple umbrella to a more faithful picture of living diversity.</p>
        </div>
      </section>

      <section className="shared-ground" aria-labelledby="shared-ground-title">
        <div className="site-container shared-ground-grid">
          <div>
            <p className="eyebrow light">Widely shared ground</p>
            <h2 id="shared-ground-title">Teachings held through different languages and forms</h2>
          </div>
          <div>
            <p>Many Buddhist traditions orient themselves around the Buddha, Dharma, and Sangha; the reality of suffering and the possibility of liberation; ethical conduct; wisdom and compassion; karma and rebirth; and disciplines of mind and heart.<SourceLinks ids={[3]} /></p>
            <p>No short statement applies identically to every community. The differences are not errors to erase; they are part of Buddhism’s history as teachings have been translated, practiced, and renewed across cultures.</p>
          </div>
        </div>
      </section>

      <section className="umbrella-section site-container" aria-labelledby="umbrella-title">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">IBAA’s shared table</p><h2 id="umbrella-title">Three broad traditions, held without hierarchy</h2></div>
          <p>Each panel names a broad family, not a complete definition. Living communities and lineages describe themselves in their own terms.</p>
        </div>
        <div className="umbrella-grid">
          <article>
            <MediaFigure src={media.theravadaThailand} alt="Monastics in saffron robes and lay attendees seated together at Wat Khung Taphao in Thailand." caption="Wat Khung Taphao, Uttaradit Province, Thailand, 2009. Photo: Tevaprapas, CC BY 3.0." />
            <div><span>01</span><h3>Theravada</h3><p>A living family rooted in the Pali textual tradition and shaped by diverse communities across Sri Lanka, mainland Southeast Asia, South Asia, and the world.<SourceLinks ids={[1, 3]} /></p><a href="#theravada-worlds">Explore Theravada worlds</a></div>
          </article>
          <article>
            <MediaFigure src={media.mahayanaChionIn} alt="Monastics ring the large temple bell at Chion-in during the New Year ceremony in Kyoto." caption="New Year bell ceremony at Chion-in, Kyoto, 2019. Photo: Leung Ming Ho (Michael), CC BY-SA 4.0." />
            <div><span>02</span><h3>Mahayana</h3><p>A broad family of bodhisattva-centered traditions with many scriptures, schools, and practices across Central, East, and Southeast Asia and global communities.<SourceLinks ids={[1, 3]} /></p><a href="#east-asian-worlds">Explore Mahayana worlds</a></div>
          </article>
          <article>
            <MediaFigure src={media.studyCircle2026} alt="IBAA Dharma Study Circle participants seated inside Drikung Kagyu Temple in Virginia." caption="IBAA Study Circle at Drikung Kagyu Temple, Virginia, 2026." />
            <div><span>03</span><h3>Vajrayana</h3><p>Tantric and esoteric paths practiced especially in Tibetan and Himalayan traditions, with related histories and living forms beyond Tibet.<SourceLinks ids={[1, 2]} /></p><a href="#vajrayana-worlds">Explore Vajrayana and esoteric worlds</a></div>
          </article>
        </div>
        <p className="license-note">The first photograph is licensed <a href="https://creativecommons.org/licenses/by/3.0" target="_blank" rel="noreferrer">CC BY 3.0</a>; the second is licensed <a href="https://creativecommons.org/licenses/by-sa/4.0" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Their captions name specific communities and do not treat one scene as representative of an entire tradition.</p>
      </section>

      <section id="living-worlds" className="living-worlds" aria-labelledby="living-worlds-title">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div><p className="eyebrow light">A wider field</p><h2 id="living-worlds-title">Selected living worlds within and across the umbrella</h2></div>
            <p>No list can be exhaustive. These groupings are an editorial guide to meaningful diversity, not a map of fixed borders.</p>
          </div>
          <div className="worlds-grid">
            {traditionWorlds.map((world, index) => (
              <article id={world.id} key={world.id}>
                <div className="world-number">{String(index + 1).padStart(2, "0")}</div>
                <p className="eyebrow light">{world.label}</p>
                <h3>{world.title}</h3>
                <p>{world.summary}<SourceLinks ids={world.sourceIds} /></p>
                <div className="context-list" aria-label={`Selected contexts within ${world.label}`}>{world.contexts.map(context => <span key={context}>{context}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="practice-spectrum site-container" aria-labelledby="practice-spectrum-title">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Paths of practice</p><h2 id="practice-spectrum-title">Buddhist life is larger than one practice</h2></div>
          <p>Silent meditation is important in many communities, but it should not stand in for the whole of Buddhist religious life.<SourceLinks ids={[3, 4]} /></p>
        </div>
        <div className="practice-grid">{practicePaths.map((path, index) => <article key={path.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{path.title}</h3><p>{path.text}</p></article>)}</div>
      </section>

      <section className="traditions-review" aria-labelledby="traditions-review-title">
        <div className="site-container traditions-review-grid">
          <div><p className="eyebrow light">Living editorial work</p><h2 id="traditions-review-title">Accuracy requires community review</h2><p>This educational page is a carefully sourced foundation, not a substitute for tradition-specific voices. Before launch, IBAA will invite monastic and lay advisers from its three broad traditions and diasporic community life to review terminology, balance, and self-description.</p></div>
          <aside><h3>Our commitments</h3><p>We do not rank traditions, use “Hinayana” as a label for living communities, reduce Buddhism to meditation, or treat one country, school, or teacher as representative of all.</p><Link className="text-link light-link" href="/contact">Offer editorial feedback <ArrowRight /></Link></aside>
        </div>
      </section>

      <section className="tradition-sources site-container" aria-labelledby="tradition-sources-title">
        <div className="section-heading"><p className="eyebrow">Editorial sources</p><h2 id="tradition-sources-title">Research behind this introduction</h2></div>
        <p className="source-intro">Academic, museum, reference, and tradition-authored sources are used together. Tradition-authored material is treated as self-representation and not as the sole authority for contested history.</p>
        <ol>{traditionSources.map(source => <li id={`tradition-source-${source.id}`} key={source.id}><span>{source.id}</span><div><a href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink /></a><p>{source.publisher}</p></div></li>)}</ol>
      </section>
    </>
  );
}
