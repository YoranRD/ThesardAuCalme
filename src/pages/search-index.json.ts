import { getCollection } from "astro:content";
import { assertPageRoutesAreUnique } from "../lib/pages";

interface SearchEntry {
  type: "guide" | "video" | "page" | "article" | "tool-review";
  lang: "fr" | "en";
  title: string;
  summary: string;
  tags: string[];
  date?: string;
  path: string;
}

const byMostRecent = (a: SearchEntry, b: SearchEntry): number => {
  const aTime = a.date ? new Date(a.date).getTime() : 0;
  const bTime = b.date ? new Date(b.date).getTime() : 0;
  return bTime - aTime;
};

export async function GET() {
  const guides = await getCollection("guides");
  const videos = await getCollection("videos");
  const pages = await getCollection("pages");
  const articles = await getCollection("articles");
  const toolReviews = await getCollection("toolReviews");

  assertPageRoutesAreUnique(pages);

  const guideEntries: SearchEntry[] = guides.map((guide) => ({
    type: "guide",
    lang: guide.data.lang,
    title: guide.data.title,
    summary: guide.data.summary,
    tags: guide.data.tags,
    date: guide.data.date.toISOString(),
    path: `/guides/${guide.slug}/`
  }));

  const videoEntries: SearchEntry[] = videos.map((video) => ({
    type: "video",
    lang: video.data.lang,
    title: video.data.title,
    summary: video.data.summary,
    tags: video.data.tags,
    date: video.data.date.toISOString(),
    path: `/videos/${video.slug}/`
  }));

  const pageEntries: SearchEntry[] = pages.map((page) => ({
    type: "page",
    lang: page.data.lang,
    title: page.data.title,
    summary: page.data.summary,
    tags: page.data.tags,
    path: page.data.route
  }));

  const articleEntries: SearchEntry[] = articles.map((article) => ({
    type: "article",
    lang: article.data.lang,
    title: article.data.title,
    summary: article.data.summary,
    tags: article.data.tags,
    date: article.data.date.toISOString(),
    path: `/articles/${article.slug}/`
  }));

  const reviewEntries: SearchEntry[] = toolReviews.map((review) => ({
    type: "tool-review",
    lang: review.data.lang,
    title: review.data.title,
    summary: review.data.summary,
    tags: review.data.tags,
    path: `/outils/avis/${review.slug}/`
  }));

  const payload = [...guideEntries, ...videoEntries, ...pageEntries, ...articleEntries, ...reviewEntries].sort(byMostRecent);

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
