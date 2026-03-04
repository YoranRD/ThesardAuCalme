import type { CollectionEntry } from "astro:content";

export type GuideEntry = CollectionEntry<"guides">;
export type VideoEntry = CollectionEntry<"videos">;

export interface SeriesRenderableItem {
  kind: "guide" | "video";
  slug: string;
  title: string;
  summary: string;
  date: Date;
  series: string;
  seriesOrder: number;
  path: string;
}

const computeSharedTagScore = (baseTags: string[], candidateTags: string[]): number => {
  const baseSet = new Set(baseTags.map((tag) => tag.toLowerCase()));
  let score = 0;

  for (const tag of candidateTags) {
    if (baseSet.has(tag.toLowerCase())) {
      score += 1;
    }
  }

  return score;
};

export const getRelatedGuidesForVideo = (video: VideoEntry, guides: GuideEntry[], limit = 3): GuideEntry[] =>
  guides
    .map((guide) => ({
      guide,
      score: computeSharedTagScore(video.data.tags, guide.data.tags)
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.guide.data.date.getTime() - a.guide.data.date.getTime() ||
        a.guide.data.title.localeCompare(b.guide.data.title, "fr")
    )
    .slice(0, limit)
    .map((entry) => entry.guide);

export const getRelatedVideosForGuide = (guide: GuideEntry, videos: VideoEntry[], limit = 3): VideoEntry[] =>
  videos
    .map((video) => ({
      video,
      score: computeSharedTagScore(guide.data.tags, video.data.tags)
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.video.data.date.getTime() - a.video.data.date.getTime() ||
        a.video.data.title.localeCompare(b.video.data.title, "fr")
    )
    .slice(0, limit)
    .map((entry) => entry.video);

export const getSeriesItems = (guides: GuideEntry[], videos: VideoEntry[], series: string, lang: "fr" | "en") => {
  const guideItems: SeriesRenderableItem[] = guides
    .filter((guide) => guide.data.lang === lang && guide.data.series === series && guide.data.seriesOrder)
    .map((guide) => ({
      kind: "guide",
      slug: guide.slug,
      title: guide.data.title,
      summary: guide.data.summary,
      date: guide.data.date,
      series,
      seriesOrder: guide.data.seriesOrder as number,
      path: `/guides/${guide.slug}/`
    }));

  const videoItems: SeriesRenderableItem[] = videos
    .filter((video) => video.data.lang === lang && video.data.series === series && video.data.seriesOrder)
    .map((video) => ({
      kind: "video",
      slug: video.slug,
      title: video.data.title,
      summary: video.data.summary,
      date: video.data.date,
      series,
      seriesOrder: video.data.seriesOrder as number,
      path: `/videos/${video.slug}/`
    }));

  return [...guideItems, ...videoItems].sort(
    (a, b) =>
      a.seriesOrder - b.seriesOrder ||
      a.date.getTime() - b.date.getTime() ||
      a.title.localeCompare(b.title, "fr")
  );
};

export const getSeriesNeighbors = (
  items: SeriesRenderableItem[],
  currentKind: "guide" | "video",
  currentSlug: string
): {
  previous?: SeriesRenderableItem;
  next?: SeriesRenderableItem;
} => {
  const index = items.findIndex((item) => item.kind === currentKind && item.slug === currentSlug);

  if (index === -1) {
    return {};
  }

  return {
    previous: index > 0 ? items[index - 1] : undefined,
    next: index < items.length - 1 ? items[index + 1] : undefined
  };
};
