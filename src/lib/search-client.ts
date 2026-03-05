export type SearchEntryType = "guide" | "video" | "page" | "article" | "tool-review";
export type SearchEntryLang = "fr" | "en";

export interface SearchEntry {
  type: SearchEntryType;
  lang: SearchEntryLang;
  title: string;
  summary: string;
  tags: string[];
  date?: string;
  path: string;
}

export interface SearchFilters {
  types?: Iterable<SearchEntryType>;
  langs?: Iterable<SearchEntryLang>;
  limit?: number;
}

export interface SearchMatch {
  entry: SearchEntry;
  score: number;
}

export const searchTypeLabel: Record<SearchEntryType, string> = {
  article: "Article",
  guide: "Guide",
  page: "Page",
  "tool-review": "Avis outil",
  video: "Vidéo"
};

export const orderedSearchTypes: SearchEntryType[] = [
  "article",
  "guide",
  "video",
  "tool-review",
  "page"
];

export const normalizeSearchValue = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const recencyBoost = (entry: SearchEntry): number => {
  if (!entry.date) {
    return 0;
  }

  const publishedAt = Date.parse(entry.date);
  if (!Number.isFinite(publishedAt)) {
    return 0;
  }

  const ageDays = Math.max(0, (Date.now() - publishedAt) / (1000 * 60 * 60 * 24));

  if (ageDays <= 30) {
    return 1.6;
  }
  if (ageDays <= 90) {
    return 1.1;
  }
  if (ageDays <= 180) {
    return 0.7;
  }

  return 0;
};

const scoreEntry = (entry: SearchEntry, normalizedQuery: string, terms: string[]): number => {
  const title = normalizeSearchValue(entry.title);
  const summary = normalizeSearchValue(entry.summary);
  const path = normalizeSearchValue(entry.path);
  const tags = entry.tags.map((tag) => normalizeSearchValue(tag));
  const tagsJoined = tags.join(" ");

  let totalScore = 0;

  for (const term of terms) {
    let hasTerm = false;

    if (title.includes(term)) {
      totalScore += 12;
      hasTerm = true;
    }

    if (tags.some((tag) => tag.includes(term))) {
      totalScore += 8;
      hasTerm = true;
    }

    if (summary.includes(term)) {
      totalScore += 4;
      hasTerm = true;
    }

    if (path.includes(term)) {
      totalScore += 2;
      hasTerm = true;
    }

    if (!hasTerm) {
      return 0;
    }
  }

  if (title.startsWith(normalizedQuery)) {
    totalScore += 14;
  } else if (title.includes(normalizedQuery)) {
    totalScore += 8;
  }

  if (tagsJoined.includes(normalizedQuery)) {
    totalScore += 6;
  }

  if (summary.includes(normalizedQuery)) {
    totalScore += 3;
  }

  totalScore += recencyBoost(entry);
  return totalScore;
};

const compareByScore = (a: SearchMatch, b: SearchMatch): number => {
  if (a.score !== b.score) {
    return b.score - a.score;
  }

  const aDate = a.entry.date ? Date.parse(a.entry.date) : 0;
  const bDate = b.entry.date ? Date.parse(b.entry.date) : 0;
  if (aDate !== bDate) {
    return bDate - aDate;
  }

  return a.entry.title.localeCompare(b.entry.title, "fr");
};

export const runSearch = (
  entries: SearchEntry[],
  query: string,
  filters: SearchFilters = {}
): SearchMatch[] => {
  const normalizedQuery = normalizeSearchValue(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  const selectedTypes = filters.types ? new Set(filters.types) : null;
  const selectedLangs = filters.langs ? new Set(filters.langs) : null;
  const limit = typeof filters.limit === "number" ? filters.limit : 60;

  const matches = entries
    .filter((entry) => {
      if (selectedTypes && !selectedTypes.has(entry.type)) {
        return false;
      }
      if (selectedLangs && !selectedLangs.has(entry.lang)) {
        return false;
      }
      return true;
    })
    .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery, terms) }))
    .filter((match) => match.score > 0)
    .sort(compareByScore);

  return matches.slice(0, limit);
};

export const groupMatchesByType = (matches: SearchMatch[]): Record<SearchEntryType, SearchMatch[]> => {
  const grouped: Record<SearchEntryType, SearchMatch[]> = {
    article: [],
    guide: [],
    video: [],
    "tool-review": [],
    page: []
  };

  matches.forEach((match) => {
    grouped[match.entry.type].push(match);
  });

  return grouped;
};

export const toBasePath = (baseUrl: string, path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${String(path).replace(/^\/+/, "")}`;
};
