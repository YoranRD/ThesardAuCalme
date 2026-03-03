import type { CollectionEntry } from "astro:content";

export type VideoEntry = CollectionEntry<"videos">;
export type GuideEntry = CollectionEntry<"guides">;

export interface TagCount {
  tag: string;
  slug: string;
  videos: number;
  guides: number;
  total: number;
}

export const slugifyTag = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const tagMatchesSlug = (tag: string, slug: string): boolean => slugifyTag(tag) === slug;

export const buildTagCounts = (videos: VideoEntry[], guides: GuideEntry[]): TagCount[] => {
  const counts = new Map<
    string,
    {
      tag: string;
      slug: string;
      videos: number;
      guides: number;
    }
  >();

  for (const video of videos) {
    for (const tag of video.data.tags) {
      const slug = slugifyTag(tag);
      if (!slug) {
        continue;
      }

      const existing = counts.get(slug) ?? { tag, slug, videos: 0, guides: 0 };
      existing.videos += 1;
      counts.set(slug, existing);
    }
  }

  for (const guide of guides) {
    for (const tag of guide.data.tags) {
      const slug = slugifyTag(tag);
      if (!slug) {
        continue;
      }

      const existing = counts.get(slug) ?? { tag, slug, videos: 0, guides: 0 };
      existing.guides += 1;
      counts.set(slug, existing);
    }
  }

  return [...counts.values()]
    .map((entry) => ({
      ...entry,
      total: entry.videos + entry.guides
    }))
    .sort((a, b) => (b.total !== a.total ? b.total - a.total : a.tag.localeCompare(b.tag, "fr")));
};

export const filterVideosByTagSlug = (videos: VideoEntry[], slug: string): VideoEntry[] =>
  videos.filter((video) => video.data.tags.some((tag) => tagMatchesSlug(tag, slug)));

export const filterGuidesByTagSlug = (guides: GuideEntry[], slug: string): GuideEntry[] =>
  guides.filter((guide) => guide.data.tags.some((tag) => tagMatchesSlug(tag, slug)));

export const resolveTagNameFromSlug = (
  slug: string,
  videos: VideoEntry[],
  guides: GuideEntry[]
): string => {
  const allTags = [...videos.flatMap((video) => video.data.tags), ...guides.flatMap((guide) => guide.data.tags)];
  const match = allTags.find((tag) => tagMatchesSlug(tag, slug));
  return match ?? slug;
};
