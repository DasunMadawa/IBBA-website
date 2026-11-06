import { CalendarDays, UserRound } from "lucide-react";
import type { ArticleRecord } from "@/data/siteContent";
import { Link } from "wouter";
import { CategoryTag, LegacyContext, MediaFigure } from "./ContentPrimitives";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function ArticleCard({ article }: { article: ArticleRecord }) {
  return (
    <article className="article-card">
      <Link href={`/news/${article.slug}`} className="article-card-image">
        <img src={article.image} alt={article.imageAlt} loading="lazy" />
      </Link>
      <div className="article-card-body">
        <p className="article-meta">{formatDate(article.date)} · {article.categories.join(" · ")}</p>
        <h2><Link href={`/news/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        <Link className="text-link" href={`/news/${article.slug}`}>Read the archive record <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

export function LegacyArticle({ article }: { article: ArticleRecord }) {
  return (
    <article className="legacy-article site-container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/news-media">News & Media</Link><span aria-hidden="true">/</span><span aria-current="page">{article.title}</span>
      </nav>
      <header className="article-header">
        <p className="eyebrow">{article.recordLabel ?? "Legacy archive"}</p>
        <h1>{article.title}</h1>
        <div className="article-byline">
          <span><CalendarDays aria-hidden="true" />{formatDate(article.date)}</span>
          <span><UserRound aria-hidden="true" />{article.author}</span>
        </div>
        <div className="tag-row" aria-label="Categories">
          {article.categories.map(category => <CategoryTag key={category}>{category}</CategoryTag>)}
        </div>
      </header>
      <MediaFigure className="article-feature" src={article.image} alt={article.imageAlt} caption={article.caption} credit={article.credit} />
      <div className="article-layout">
        <div className="article-copy">
          {article.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {article.participatingOrganizations?.length ? <section className="article-downloads" aria-labelledby="participating-organizations-title"><h2 id="participating-organizations-title">Participating Organizations</h2><div>{article.participatingOrganizations.map(organization => <div className="legacy-context" key={organization}><h3>{organization}</h3><p>Profile forthcoming.</p></div>)}</div></section> : null}
        </div>
        <LegacyContext legacyUrl={article.legacyUrl} title={article.sourceTitle} linkLabel={article.sourceLinkLabel}>{article.sourceDescription}</LegacyContext>
      </div>
    </article>
  );
}
