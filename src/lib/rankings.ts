import { resourcesCatalog, type ResourceEntry } from "./resources";

const priceTierOrder: Record<ResourceEntry["priceTier"], number> = {
  "€": 1,
  "€€": 2,
  "€€€": 3
};

export const sortByRankingHeuristic = (entries: ResourceEntry[]): ResourceEntry[] =>
  [...entries].sort((a, b) => {
    if (a.wizardScore !== b.wizardScore) {
      return b.wizardScore - a.wizardScore;
    }

    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }

    const aTier = priceTierOrder[a.priceTier] ?? Number.MAX_SAFE_INTEGER;
    const bTier = priceTierOrder[b.priceTier] ?? Number.MAX_SAFE_INTEGER;
    if (aTier !== bTier) {
      return aTier - bTier;
    }

    return a.name.localeCompare(b.name, "fr");
  });

export const pickRankedResources = (
  predicate: (entry: ResourceEntry) => boolean,
  limit = 12
): ResourceEntry[] => sortByRankingHeuristic(resourcesCatalog.filter(predicate)).slice(0, limit);
