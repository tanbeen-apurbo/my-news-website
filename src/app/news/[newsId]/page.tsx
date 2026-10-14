import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ArticleDescription {
  blocks?: Array<{
    model?: {
      blocks?: Array<{
        model?: {
          text?: string;
        };
      }>;
    };
  }>;
}

interface ArticleBodyBlock {
  type: string;
  text?: string;
  url?: string;
  width?: number;
  height?: number;
  caption?: string;
  altText?: string;
  copyrightHolder?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  description?: string | ArticleDescription;
  link?: string;
  firstPublished?: string;
  lastPublished?: string;
  byline?: Array<{
    name: string;
    role?: string;
  }>;
  topics?: Array<{
    id: string;
    name: string;
  }>;
  tags?: string[];
  imageUrl?: string;
  body?: ArticleBodyBlock[];
  wordCount?: number;
  source?: string;
  sourceUrl?: string;
}

interface NewsDetailsProps {
  params: Promise<{
    newsId: string;
  }>;
}

interface NewsResponse {
  success?: boolean;
  data?: NewsArticle;
}

export default function NewsDetails({ params }: NewsDetailsProps) {
  return (
    <Suspense fallback={<NewsDetailsSkeleton />}>
      <NewsArticleContent params={params} />
    </Suspense>
  );
}

async function NewsArticleContent({ params }: NewsDetailsProps) {
  const { newsId } = await params;

  const res = await fetch(
    `https://news-api-v2.vercel.app/api/article/${encodeURIComponent(newsId)}`
  );

  if (!res.ok) {
    notFound();
  }

  const response: NewsResponse = await res.json();

  if (!response.data) {
    notFound();
  }

  const news = response.data;

  const description =
    typeof news.description === "string"
      ? news.description
      : news.description?.blocks
          ?.flatMap(
            (block) =>
              block.model?.blocks?.map(
                (paragraph) => paragraph.model?.text ?? ""
              ) ?? []
          )
          .filter(Boolean)
          .join(" ") ?? "";

  const authorNames =
    news.byline?.map((author) => author.name).filter(Boolean).join(" · ") ?? "";

  const tags =
    news.tags?.length
      ? news.tags
      : news.topics?.map((topic) => topic.name) ?? [];

  const publishedDate = news.firstPublished
    ? new Date(news.firstPublished)
    : null;

  const publishedLabel =
    publishedDate && !Number.isNaN(publishedDate.getTime())
      ? new Intl.DateTimeFormat("bn-BD", {
          dateStyle: "long",
          timeZone: "Asia/Dhaka",
        }).format(publishedDate)
      : null;

  const readingMinutes = news.wordCount
    ? Math.max(1, Math.ceil(news.wordCount / 200))
    : null;

  const sourceUrl = news.sourceUrl || news.link;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-red-700">
            প্রচ্ছদ
          </Link>
          <span aria-hidden="true">/</span>
          <span className="line-clamp-1 text-slate-700">সংবাদ বিস্তারিত</span>
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <header className="px-5 pb-6 pt-7 sm:px-9 sm:pt-10">
              {tags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {news.title}
              </h1>

              {description && (
                <p className="mt-5 border-l-4 border-red-600 pl-4 text-lg leading-8 text-slate-600 sm:text-xl">
                  {description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-sm text-slate-500">
                {authorNames && (
                  <span className="font-semibold text-slate-800">
                    {authorNames}
                  </span>
                )}

                {news.source && <span>{news.source}</span>}

                {publishedLabel && (
                  <time dateTime={news.firstPublished ?? undefined}>
                    {publishedLabel}
                  </time>
                )}

                {readingMinutes && (
                  <span>
                    {new Intl.NumberFormat("bn-BD").format(readingMinutes)} মিনিটের পাঠ
                  </span>
                )}
              </div>
            </header>

            {news.imageUrl && (
              <figure className="px-4 sm:px-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 850px"
                    className="object-cover"
                  />
                </div>
              </figure>
            )}

            <ArticleBody
              blocks={news.body ?? []}
              heroImageUrl={news.imageUrl}
              articleTitle={news.title}
            />

            <footer className="mx-5 flex flex-col gap-4 border-t border-slate-100 py-6 sm:mx-9 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                সূত্র:{" "}
                <span className="font-semibold text-slate-800">
                  {news.source ?? "সংবাদমাধ্যম"}
                </span>
              </p>

              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  মূল প্রতিবেদন পড়ুন
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </footer>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-8">
            <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-red-300">
                এই প্রতিবেদন
              </p>
              <h2 className="mt-3 text-xl font-bold leading-snug">
                {news.title}
              </h2>
              {readingMinutes && (
                <p className="mt-4 text-sm text-slate-300">
                  পড়তে সময় লাগবে{" "}
                  {new Intl.NumberFormat("bn-BD").format(readingMinutes)} মিনিট
                </p>
              )}
            </section>

            {tags.length > 0 && (
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  বিষয়
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function ArticleBody({
  blocks,
  heroImageUrl,
  articleTitle,
}: {
  blocks: ArticleBodyBlock[];
  heroImageUrl?: string;
  articleTitle: string;
}) {
  return (
    <div className="px-5 pb-8 pt-7 sm:px-9">
      <div className="mx-auto max-w-3xl space-y-6">
        {blocks.map((block, index) => {
          if (block.type === "text" && block.text) {
            return (
              <p
                key={`text-${index}`}
                className="whitespace-pre-line text-base leading-8 text-slate-700 sm:text-lg sm:leading-9"
              >
                {block.text}
              </p>
            );
          }

          if (block.type === "subheading" && block.text) {
            return (
              <h2
                key={`heading-${index}`}
                className="border-l-4 border-red-600 pl-4 pt-3 text-2xl font-bold leading-snug text-slate-950 sm:text-3xl"
              >
                {block.text}
              </h2>
            );
          }

          if (block.type === "image" && block.url) {
            if (index === 0 && block.url === heroImageUrl) {
              return null;
            }

            return (
              <figure key={`image-${index}`} className="py-2">
                {/* <Image
                  src={block.url}
                  alt={block.altText || block.caption || articleTitle}
                  width={block.width || 1200}
                  height={block.height || 675}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full rounded-2xl bg-slate-100 object-cover"
                /> */}

                {(block.caption || block.copyrightHolder) && (
                  <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                    {block.caption}
                    {block.caption && block.copyrightHolder && " · "}
                    {block.copyrightHolder}
                  </figcaption>
                )}
              </figure>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

function NewsDetailsSkeleton() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen bg-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-slate-200" />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="animate-pulse rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-9">
            <div className="h-5 w-28 rounded-full bg-red-100" />
            <div className="mt-6 h-10 w-full rounded bg-slate-200" />
            <div className="mt-3 h-10 w-4/5 rounded bg-slate-200" />
            <div className="mt-6 h-20 rounded bg-slate-100" />
            <div className="mt-6 aspect-[16/9] rounded-2xl bg-slate-200" />
            <div className="mt-8 space-y-3">
              <div className="h-5 rounded bg-slate-100" />
              <div className="h-5 rounded bg-slate-100" />
              <div className="h-5 w-3/4 rounded bg-slate-100" />
            </div>
          </section>

          <aside className="hidden space-y-5 lg:block">
            <div className="h-48 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-36 animate-pulse rounded-3xl bg-slate-200" />
          </aside>
        </div>
      </div>
    </main>
  );
}