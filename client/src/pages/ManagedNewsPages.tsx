import React from "react";
import { CategoryTag, DocumentCard, LegacyContext, MediaFigure } from "@/components/site/ContentPrimitives";
import { ArticleCard, LegacyArticle } from "@/components/site/LegacyArticle";
import { PageHero } from "@/components/site/PageHero";
import { SecureYouTubeEmbed } from "@/components/site/SecureYouTubeEmbed";
import { articles, externalPress, newsClippings } from "@/data/siteContent";
import { legacyMedia, legacyPages, legacyPosts } from "@/data/legacyArchive.generated";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ExternalLink, FileText, ImageIcon, Loader2 } from "lucide-react";
import { Link } from "wouter";

function formatDate(value: string | number | null) {
  if (!value) return "Date not recorded";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function filenameFromUrl(url: string) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() || "Legacy document");
  } catch {
    return "Legacy document";
  }
}

function LegacyPostArticle({ post }: { post: (typeof legacyPosts)[number] }) {
  const verifiedCaption = post.featuredMediaCaption || post.featuredMediaDescription || undefined;
  return <article className="legacy-article">
    <header className="article-header site-container">
      <p className="eyebrow">Legacy archive</p>
      <h1>{post.title}</h1>
      <p className="article-byline">{formatDate(post.publishedAt)} · {post.authorName}</p>
      <div className="category-row">{post.categories.map(category => <CategoryTag key={category}>{category}</CategoryTag>)}</div>
    </header>
    {post.featuredMediaUrl ? <div className="article-feature site-container"><MediaFigure src={post.featuredMediaUrl} alt={post.featuredMediaAlt ?? ""} caption={verifiedCaption} />{!verifiedCaption ? <p className="media-metadata-notice">The original media record did not include a verified caption or description; none has been invented for this archival presentation.</p> : null}</div> : null}
    <div className="article-layout site-container">
      <div className="article-body">
        <p className="lead">{post.excerpt}</p>
        {post.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {post.documentUrls.length ? <section className="article-downloads" aria-labelledby="legacy-downloads-title"><h2 id="legacy-downloads-title">Downloads from the original record</h2><div>{post.documentUrls.map(url => <DocumentCard key={url} title={filenameFromUrl(url)} type="Legacy document" url={url} context="Document linked from the original IBAA publication." />)}</div></section> : null}
      </div>
      <LegacyContext legacyUrl={post.legacyUrl}>This archival presentation preserves the original title, publication date, author attribution, taxonomy, source media, document links, and WordPress path. The wording remains a historical record and has not been silently rewritten.</LegacyContext>
    </div>
  </article>;
}

export function ManagedNewsMediaPage() {
  const managed = trpc.content.listPublished.useQuery();
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category")?.toLowerCase();
  const tag = params.get("tag")?.toLowerCase();
  const author = params.get("author")?.toLowerCase();
  const format = params.get("format")?.toLowerCase();
  const legacyIndex = legacyPosts.filter(post => {
    if (category && !post.categories.some(value => value.toLowerCase() === category)) return false;
    if (tag && !(post.tags as readonly string[]).some(value => value.toLowerCase() === tag)) return false;
    if (author && !post.authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(author)) return false;
    if (format === "video" && !post.linkedUrls.some(url => /youtu\.be|youtube\.com/.test(url))) return false;
    return true;
  });
  const activeFilter = category ? `Category: ${category}` : tag ? `Tag: ${tag}` : author ? "Author: Allen Tsaur" : format ? `Format: ${format}` : null;

  return <>
    <PageHero eyebrow="News & Media" title="A living public record" intro="Current publishing and preserved legacy content, presented with original dates, categories, imagery, and source context." />
    <section className="site-container news-page">
      {managed.isLoading ? <div className="managed-loading"><Loader2 className="animate-spin" />Loading current publications</div> : null}
      {managed.isError ? <div className="notice-panel"><div><h2>Current publications are temporarily unavailable</h2><p>The verified legacy archive remains available below.</p></div></div> : null}
      <div className="article-grid">
        {managed.data?.map(entry => <article className="article-card" key={entry.id}>{entry.featuredMedia ? <Link className="article-card-image" href={`/news/${entry.slug}`}><img src={entry.featuredMedia.url} alt={entry.featuredMedia.altText ?? ""} loading="lazy" /></Link> : null}<div className="article-card-body"><p className="article-meta">{formatDate(entry.publishedAt)} · {entry.categories.join(" · ") || entry.contentType}</p><h2><Link href={`/news/${entry.slug}`}>{entry.title}</Link></h2><p>{entry.excerpt}</p><Link className="text-link" href={`/news/${entry.slug}`}>Read the entry <ArrowRight /></Link></div></article>)}
        {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
      </div>

      <section className="legacy-index news-clippings" aria-labelledby="news-clippings-title">
        <div className="section-heading split-heading"><div><p className="eyebrow">News clippings</p><h2 id="news-clippings-title">IBAA in public coverage</h2></div><p>Short source summaries link to the original publications; full articles are not reproduced here.</p></div>
        <div className="legacy-index-list">{newsClippings.map(item => <article key={item.url}><time dateTime={item.date}>{item.dateLabel}</time><div><p>{item.source}</p><h3><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></h3><span>{item.summary}</span></div><a aria-label={`Open original source: ${item.title}`} href={item.url} target="_blank" rel="noreferrer"><ExternalLink /></a></article>)}</div>
      </section>

      <section className="legacy-index" aria-labelledby="legacy-index-title">
        <div className="section-heading split-heading"><div><p className="eyebrow">Complete legacy article index</p><h2 id="legacy-index-title">IBAA.org publications, 2017–2026</h2></div><p>All 29 public WordPress posts are retained with original dates, authorship, categories, text, source media, document links, and legacy URLs.</p></div>
        {activeFilter ? <div className="archive-filter-context"><strong>{activeFilter}</strong><span>{legacyIndex.length} matching archive records</span><Link href="/news-media">Clear filter</Link></div> : null}
        <div className="legacy-index-list">{legacyIndex.map(post => <article key={post.id}><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time><div><p>{post.categories.join(" · ") || "Archive"}</p><h3><Link href={`/news/${post.slug}`}>{post.title}</Link></h3><span>{post.excerpt}</span></div><Link aria-label={`Read ${post.title}`} href={`/news/${post.slug}`}><ArrowRight /></Link></article>)}</div>
      </section>

      <div className="press-archive"><div className="section-heading"><p className="eyebrow">Press archive</p><h2>IBAA in external media</h2></div>{["2024", "2023", "2021"].map(year => <section key={year}><h3>{year}</h3><div>{externalPress.filter(item => item.year === year).map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span>{item.date}</span><strong>{item.title}</strong><em>{item.publisher}</em><ExternalLink /></a>)}</div></section>)}</div>
    </section>
  </>;
}

export function ManagedArticleRoute({ slug }: { slug: string }) {
  const managed = trpc.content.bySlug.useQuery({ slug });
  const legacyFeature = articles.find(item => item.slug === slug);
  const legacyPost = legacyPosts.find(item => item.slug === slug);
  if (legacyFeature) return <LegacyArticle article={legacyFeature} />;
  if (legacyPost) return <LegacyPostArticle post={legacyPost} />;
  if (managed.isLoading) return <div className="managed-article-loading"><Loader2 className="animate-spin" /><span>Loading publication</span></div>;
  if (!managed.data) return <section className="site-container content-section"><div className="empty-state"><h1>Publication not found</h1><p>This entry may be unpublished or its URL may have changed.</p><Link className="button-primary" href="/news-media">Return to News & Media</Link></div></section>;
  const entry = managed.data;
  return <article className="legacy-article"><header className="article-header site-container"><p className="eyebrow">{entry.contentType === "media" ? "Media" : "News"}</p><h1>{entry.title}</h1><p className="article-byline">{formatDate(entry.publishedAt)} · {entry.authorName}</p><div className="category-row">{entry.categories.map(category => <CategoryTag key={category}>{category}</CategoryTag>)}</div></header>{entry.featuredMedia ? <div className="article-feature site-container"><MediaFigure src={entry.featuredMedia.url} alt={entry.featuredMedia.altText ?? ""} caption={entry.featuredMedia.caption ?? ""} /></div> : null}<div className="article-layout site-container"><div className="article-body"><p className="lead">{entry.excerpt}</p>{entry.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{entry.youtubeUrl && entry.youtubeTitle ? <SecureYouTubeEmbed url={entry.youtubeUrl} title={entry.youtubeTitle} className="article-video" /> : null}{entry.attachments.length ? <section className="article-downloads" aria-labelledby="article-downloads-title"><h2 id="article-downloads-title">Downloads</h2><div>{entry.attachments.map(asset => <DocumentCard key={asset.id} title={asset.originalName} type="PDF document" url={asset.url} context={asset.caption || "Downloadable resource attached to this publication."} />)}</div></section> : null}</div>{entry.legacyUrl ? <LegacyContext legacyUrl={entry.legacyUrl}>This managed entry retains the original IBAA URL as part of its migration context.</LegacyContext> : null}</div></article>;
}

export function LegacyInfoPage({ slug }: { slug: string }) {
  const page = legacyPages.find(record => record.slug === slug);
  if (!page) return <section className="site-container content-section"><div className="empty-state"><h1>Legacy page not found</h1><Link className="button-primary" href="/">Return home</Link></div></section>;
  if (slug === "mission") return <div className="mission-page"><PageHero eyebrow="About IBAA" title={page.title} intro={page.body[0]} /><section className="site-container editorial-section"><div className="editorial-main mission-prose">{page.body.map((paragraph, index) => <p className={index === 0 ? "lead" : undefined} key={index}>{paragraph}</p>)}</div></section></div>;
  return <><PageHero eyebrow="IBAA Legacy Page" title={page.title} intro={page.excerpt} /><section className="site-container editorial-section"><div className="editorial-main">{page.body.map((paragraph, index) => <p className={index === 0 ? "lead" : undefined} key={index}>{paragraph}</p>)}{page.documentUrls.length ? <div className="resources-grid">{page.documentUrls.map(url => <DocumentCard key={url} title={filenameFromUrl(url)} type="Legacy document" url={url} context={`Document preserved from ${page.title}.`} />)}</div> : null}</div><LegacyContext legacyUrl={page.legacyUrl}>This page preserves the original IBAA content and WordPress path while its topic is integrated into the rebuilt information architecture.</LegacyContext></section></>;
}

export function LegacyMediaPage({ archiveSlug }: { archiveSlug: string }) {
  const id = Number.parseInt(archiveSlug.split("-")[0] ?? "", 10);
  const asset = legacyMedia.find(record => record.id === id);
  if (!asset) return <section className="site-container content-section"><div className="empty-state"><h1>Legacy media not found</h1><p>The attachment may be one of the two inaccessible positions documented in the source API anomaly report.</p><Link className="button-primary" href="/resources">View resources</Link></div></section>;
  const isImage = asset.mediaType === "image";
  return <><PageHero eyebrow="Legacy Media Record" title={asset.title} intro="A preserved attachment record from the former IBAA WordPress media library." /><section className="site-container legacy-media-page"><div>{isImage ? <figure><img src={asset.sourceUrl} alt={asset.altText} /><figcaption>{asset.caption || asset.description || (asset.altText ? "Original IBAA media." : "The legacy library did not supply descriptive alternative text for this image.")}</figcaption></figure> : <div className="legacy-file-panel"><FileText /><h2>{asset.mimeType}</h2><a className="button-primary" href={asset.sourceUrl} target="_blank" rel="noreferrer">Open original file</a></div>}</div><aside><LegacyContext legacyUrl={asset.legacyAttachmentUrl}>This attachment record preserves its original media-library path, upload date, dimensions, MIME type, and source URL.</LegacyContext><dl><div><dt>Published</dt><dd>{formatDate(asset.publishedAt)}</dd></div><div><dt>File type</dt><dd>{asset.mimeType}</dd></div>{asset.width && asset.height ? <div><dt>Dimensions</dt><dd>{asset.width} × {asset.height}</dd></div> : null}<div><dt>Original source</dt><dd><a href={asset.originalUploadUrl} target="_blank" rel="noreferrer">Open source <ExternalLink /></a></dd></div></dl></aside></section></>;
}
