import { Suspense } from "react";
import MainNews from "../components/MainNews";
// import Marquee from "../components/Marquee";
import NewsCard from "../components/NewsCard";
import MostRead from "../components/MostRead";



interface INewsArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
}

interface INewsSection {
  curationId: string;
  title: string;
  articles: INewsArticle[];
}

async function NewsSections() {
  const res = await fetch(
    "https://news-api-v2.vercel.app/api/news/sections"
  );

  if (!res.ok) {
    throw new Error("Failed to load news sections");
  }

  const data = await res.json();
  const sections: INewsSection[] = data.data;
  const [mainSection, ...otherSections] = sections;

  return (
    <>
      {mainSection && <MainNews news={mainSection.articles} />}

      <div className="mt-5 grid gap-5">
        {otherSections.map((section) => (
          <section key={section.curationId}>
            <h2 className="border-b-2 border-red-700 pb-1 font-bold">
              {section.title}
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-4">
              {section.articles.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div >
     

      <div className="mt-5 mx-auto grid max-w-7xl grid-cols-3 items-start gap-5">
        <main className="col-span-2">
          <Suspense fallback={<p>Loading news...</p>}>
            <NewsSections />
          </Suspense>
        </main>

        <aside className="col-span-1">
          <Suspense fallback={<p>Loading most read...</p>}>
            <MostRead />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}