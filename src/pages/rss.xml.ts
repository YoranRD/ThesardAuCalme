import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { brandDisplayName, siteDefaultDescription } from "../config/site";

export async function GET(context: { site: URL | undefined }) {
  const [videos, guides, articles] = await Promise.all([
    getCollection("videos", ({ data }) => data.lang === "fr"),
    getCollection("guides", ({ data }) => data.lang === "fr"),
    getCollection("articles", ({ data }) => data.lang === "fr" && data.status === "published")
  ]);

  const items = [
    ...videos.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/videos/${entry.slug}/`
    })),
    ...guides.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/guides/${entry.slug}/`
    })),
    ...articles.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/articles/${entry.slug}/`
    }))
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: `${brandDisplayName} | RSS`,
    description: siteDefaultDescription,
    site: context.site,
    items
  });
}
