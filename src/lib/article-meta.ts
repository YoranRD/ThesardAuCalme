import type { CollectionEntry } from "astro:content";
import { getResourceObjectiveKey, type ResourceEntry } from "./resources";

export type ArticleEntry = CollectionEntry<"articles">;

export interface ArticleCategory {
  key: string;
  label: string;
  keywords: string[];
}

const categoryMap: ArticleCategory[] = [
  {
    key: "redaction",
    label: "Rédaction",
    keywords: ["redaction", "ecriture", "chapitre", "reviewers", "slides", "soutenance"]
  },
  {
    key: "biblio",
    label: "Bibliographie",
    keywords: ["zotero", "bibliographie", "citation", "papier", "lecture"]
  },
  {
    key: "admin",
    label: "Administratif",
    keywords: ["administratif", "visa", "caf", "apl", "sejour", "banque", "international"]
  },
  {
    key: "focus",
    label: "Organisation",
    keywords: ["routine", "focus", "procrastination", "planning", "stress"]
  },
  {
    key: "outils",
    label: "Outils",
    keywords: ["outil", "stack", "workflow", "backup", "sauvegarde"]
  }
];

const fallbackCategory: ArticleCategory = {
  key: "methodes",
  label: "Méthodes",
  keywords: []
};

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const toTokens = (value: string): string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);

export const articleCategories = categoryMap;

export const getArticleCategory = (tags: string[]): ArticleCategory => {
  const normalizedTags = tags.map(normalize);

  for (const category of categoryMap) {
    const hasMatch = category.keywords.some((keyword) =>
      normalizedTags.some((tag) => tag.includes(normalize(keyword)))
    );

    if (hasMatch) {
      return category;
    }
  }

  return fallbackCategory;
};

export const getArticleKeyTakeaways = (
  article: ArticleEntry,
  headings: Array<{ text: string }>
): string[] => {
  const category = getArticleCategory(article.data.tags);
  const firstHeading = headings[0]?.text;
  const firstTag = article.data.tags[0];

  const candidates = [
    `Cap prioritaire: ${category.label.toLowerCase()} appliquée à une progression doctorale stable.`,
    firstHeading ? `Point de passage: ${firstHeading}.` : undefined,
    firstTag ? `Application directe: intégrer #${firstTag} dans la routine de semaine.` : undefined,
    "Sortie attendue: une action concrète terminée et vérifiable avant la prochaine revue."
  ].filter((entry): entry is string => Boolean(entry));

  return candidates.slice(0, 3);
};

const objectiveKeywords: Record<string, string[]> = {
  ecrire: ["redaction", "ecriture", "chapitre", "style", "grammaire", "reviewers"],
  "citer-bibliographie": ["zotero", "bibliographie", "citation", "references", "mendeley"],
  "lire-pdf-annoter": ["lecture", "papier", "pdf", "annotation", "highlights"],
  "sauvegarder-synchroniser": ["sauvegarde", "backup", "sync", "syncthing", "rclone"],
  "focus-routine": ["routine", "focus", "planning", "procrastination", "todo"],
  administratif: ["visa", "caf", "apl", "sejour", "international", "administratif", "banque"]
};

const resolveObjectivesFromTokens = (tokens: string[]): string[] => {
  const objectives = new Set<string>();

  for (const [objectiveKey, keywords] of Object.entries(objectiveKeywords)) {
    const hasMatch = keywords.some((keyword) =>
      tokens.some((token) => token.includes(normalize(keyword)))
    );

    if (hasMatch) {
      objectives.add(objectiveKey);
    }
  }

  return [...objectives];
};

export const getRelatedToolsForArticle = (
  article: ArticleEntry,
  resources: ResourceEntry[],
  limit = 4
): ResourceEntry[] => {
  const textTokens = [
    ...article.data.tags.flatMap(toTokens),
    ...toTokens(article.data.title),
    ...toTokens(article.data.summary)
  ];

  const articleObjectives = resolveObjectivesFromTokens(textTokens);

  const scored = resources
    .map((resource) => {
      let score = 0;

      const resourceTokens = [
        ...resource.bestFor.flatMap(toTokens),
        ...toTokens(resource.name),
        ...toTokens(resource.category)
      ];

      for (const token of textTokens) {
        if (resourceTokens.includes(token)) {
          score += 1;
        }
      }

      const objectiveKey = getResourceObjectiveKey(resource);
      if (articleObjectives.includes(objectiveKey)) {
        score += 4;
      }

      if (resource.isFeatured) {
        score += 1.2;
      }

      score += resource.wizardScore / 10;

      return { resource, score };
    })
    .sort((a, b) => b.score - a.score || b.resource.wizardScore - a.resource.wizardScore);

  const positive = scored.filter((entry) => entry.score > 0).slice(0, limit).map((entry) => entry.resource);

  if (positive.length >= limit) {
    return positive;
  }

  const fallback = scored
    .filter((entry) => !positive.some((resource) => resource.key === entry.resource.key))
    .slice(0, limit - positive.length)
    .map((entry) => entry.resource);

  return [...positive, ...fallback];
};
