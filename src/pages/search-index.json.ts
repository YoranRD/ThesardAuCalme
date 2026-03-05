import { getCollection } from "astro:content";
import type { SearchEntry } from "../lib/search-client";
import { assertPageRoutesAreUnique } from "../lib/pages";

const byMostRecent = (a: SearchEntry, b: SearchEntry): number => {
  const aTime = a.date ? new Date(a.date).getTime() : 0;
  const bTime = b.date ? new Date(b.date).getTime() : 0;
  return bTime - aTime;
};

const staticHubEntries: SearchEntry[] = [
  {
    type: "page",
    lang: "fr",
    title: "Hub YouTube",
    summary:
      "Parcours vidéo par piliers, playlists et étapes d'application pour transformer le visionnage en actions doctorales concrètes.",
    tags: ["youtube", "playlists", "doctorat", "progression"],
    path: "/youtube/"
  },
  {
    type: "page",
    lang: "fr",
    title: "Rejoindre la communauté",
    summary:
      "Hub de conversion éthique: pack gratuit, newsletter, communauté, chaîne YouTube et prochaines actions recommandées.",
    tags: ["communaute", "newsletter", "pack", "youtube"],
    path: "/communaute/rejoindre/"
  },
  {
    type: "page",
    lang: "fr",
    title: "Toolbox doctorat",
    summary:
      "Sélection d'outils classés par objectif, score éditorial, avis détaillés et redirections trackées via /out/.",
    tags: ["toolbox", "outils", "stack", "avis"],
    path: "/outils/"
  }
];

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

  const mergedEntries = [...guideEntries, ...videoEntries, ...pageEntries, ...articleEntries, ...reviewEntries, ...staticHubEntries];

  const dedupedByPath = new Map<string, SearchEntry>();
  mergedEntries.forEach((entry) => {
    const existing = dedupedByPath.get(entry.path);
    if (!existing) {
      dedupedByPath.set(entry.path, entry);
      return;
    }

    const existingHasDate = Boolean(existing.date);
    const incomingHasDate = Boolean(entry.date);
    if (!existingHasDate && incomingHasDate) {
      dedupedByPath.set(entry.path, entry);
    }
  });

  const payload = [...dedupedByPath.values()].sort(byMostRecent);

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
