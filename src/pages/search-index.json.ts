import { getCollection } from "astro:content";

interface SearchEntry {
  type: "guide" | "video";
  lang: "fr" | "en";
  title: string;
  summary: string;
  tags: string[];
  date: string;
  path: string;
}

export async function GET() {
  const guides = await getCollection("guides");
  const videos = await getCollection("videos");

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

  const payload = [...guideEntries, ...videoEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
