import { parse } from "yaml";
import resourcesYaml from "../data/resources.yaml?raw";
import { withBase } from "./links";

export type ResourceCategory =
  | "ecriture"
  | "bibliographie"
  | "sauvegarde"
  | "equipement"
  | "focus"
  | "administratif";

export type PricingNote = "free" | "paid" | "freemium";
export type PriceTier = "€" | "€€" | "€€€";

export type ResourceObjectiveKey =
  | "ecrire"
  | "citer-bibliographie"
  | "lire-pdf-annoter"
  | "sauvegarder-synchroniser"
  | "focus-routine"
  | "administratif";

export interface ResourcePerk {
  label: string;
  code?: string;
  description?: string;
}

export interface ResourceEntry {
  key: string;
  name: string;
  category: ResourceCategory;
  description: string;
  whyRecommended: string[];
  criteriaUsed: string[];
  pricingNote: PricingNote;
  priceTier: PriceTier;
  wizardScore: number;
  bestFor: string[];
  avoidIf: string[];
  perk?: ResourcePerk;
  badge?: string;
  isFeatured: boolean;
  reviewSlug?: string;
  url: string;
  affiliateUrl?: string;
  freeAlternativeKeys: string[];
}

export interface ResourceObjectiveDefinition {
  key: ResourceObjectiveKey;
  label: string;
  description: string;
}

const allowedCategories = new Set<ResourceCategory>([
  "ecriture",
  "bibliographie",
  "sauvegarde",
  "equipement",
  "focus",
  "administratif"
]);

const allowedPricingNotes = new Set<PricingNote>(["free", "paid", "freemium"]);
const allowedPriceTiers = new Set<PriceTier>(["€", "€€", "€€€"]);

const slugPattern = /^[a-z0-9-]{3,120}$/;

const pdfAndAnnotationKeys = new Set<string>(["readwise-reader", "hypothesis", "okular", "pdf-xchange"]);

const defaultPriceTierByPricingNote: Record<PricingNote, PriceTier> = {
  free: "€",
  freemium: "€€",
  paid: "€€€"
};

const defaultWizardScoreByPricingNote: Record<PricingNote, number> = {
  free: 4,
  freemium: 3.5,
  paid: 3.5
};

const defaultBestForByObjective: Record<ResourceObjectiveKey, string[]> = {
  ecrire: ["redaction", "organisation", "qualite-de-texte"],
  "citer-bibliographie": ["bibliographie", "citation", "revue-de-litterature"],
  "lire-pdf-annoter": ["lecture-pdf", "annotation", "synthese"],
  "sauvegarder-synchroniser": ["sauvegarde", "synchronisation", "resilience"],
  "focus-routine": ["focus", "routine", "pilotage-hebdo"],
  administratif: ["administratif", "france", "international"]
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const assertNonEmptyString = (value: unknown, field: string, key: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${field} for resource ${key}`);
  }
  return value.trim();
};

const assertOptionalString = (value: unknown, field: string, key: string): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error(`Invalid ${field} for resource ${key}`);
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const assertStringArray = (
  value: unknown,
  field: string,
  key: string,
  options: { min: number; max: number }
): string[] => {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid ${field} for resource ${key}: expected an array`);
  }

  const entries = value.map((item) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new Error(`Invalid ${field} entry for resource ${key}`);
    }
    return item.trim();
  });

  if (entries.length < options.min || entries.length > options.max) {
    throw new Error(`Invalid ${field} count for resource ${key}`);
  }

  return entries;
};

const assertSlug = (value: string, field: string, key: string): string => {
  if (!slugPattern.test(value)) {
    throw new Error(`Invalid ${field} for resource ${key}`);
  }
  return value;
};

const assertHttpUrl = (value: string, field: string, key: string): string => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid URL in ${field} for resource ${key}`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Unsupported URL protocol in ${field} for resource ${key}`);
  }

  return parsed.toString();
};

const inferObjectiveKey = (resource: Pick<ResourceEntry, "category" | "key">): ResourceObjectiveKey => {
  if (pdfAndAnnotationKeys.has(resource.key)) {
    return "lire-pdf-annoter";
  }

  switch (resource.category) {
    case "bibliographie":
      return "citer-bibliographie";
    case "sauvegarde":
      return "sauvegarder-synchroniser";
    case "focus":
      return "focus-routine";
    case "administratif":
      return "administratif";
    case "ecriture":
    case "equipement":
      return "ecrire";
    default:
      return "ecrire";
  }
};

const normalizeWizardScore = (value: unknown, key: string, pricingNote: PricingNote): number => {
  const fallbackScore = defaultWizardScoreByPricingNote[pricingNote];
  const score = value === undefined ? fallbackScore : value;

  if (typeof score !== "number" || !Number.isFinite(score)) {
    throw new Error(`Invalid wizardScore for resource ${key}`);
  }

  if (score < 1 || score > 5) {
    throw new Error(`wizardScore out of bounds for resource ${key}`);
  }

  const doubled = score * 2;
  if (Math.abs(doubled - Math.round(doubled)) > 1e-8) {
    throw new Error(`wizardScore must use 0.5 increments for resource ${key}`);
  }

  return Number(score.toFixed(1));
};

const normalizePerk = (value: unknown, key: string): ResourcePerk | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!isRecord(value)) {
    throw new Error(`Invalid perk for resource ${key}`);
  }

  const label = assertNonEmptyString(value.label, "perk.label", key);
  const code = assertOptionalString(value.code, "perk.code", key);
  const description = assertOptionalString(value.description, "perk.description", key);

  return {
    label,
    ...(code ? { code } : {}),
    ...(description ? { description } : {})
  };
};

const normalizeResource = (item: unknown, index: number): ResourceEntry => {
  if (!isRecord(item)) {
    throw new Error(`Invalid resource entry at index ${index}`);
  }

  const key = assertNonEmptyString(item.key, "key", `index-${index}`);
  const name = assertNonEmptyString(item.name, "name", key);
  const category = assertNonEmptyString(item.category, "category", key) as ResourceCategory;
  const description = assertNonEmptyString(item.description, "description", key);
  const whyRecommended = assertStringArray(item.whyRecommended, "whyRecommended", key, { min: 2, max: 4 });
  const criteriaUsed = assertStringArray(item.criteriaUsed, "criteriaUsed", key, { min: 2, max: 8 });
  const pricingNote = assertNonEmptyString(item.pricingNote, "pricingNote", key) as PricingNote;

  if (!allowedCategories.has(category)) {
    throw new Error(`Unknown category ${category} for resource ${key}`);
  }

  if (!allowedPricingNotes.has(pricingNote)) {
    throw new Error(`Unknown pricing note ${pricingNote} for resource ${key}`);
  }

  const objectiveKey = inferObjectiveKey({ key, category });

  const priceTierRaw = typeof item.priceTier === "string" ? item.priceTier.trim() : defaultPriceTierByPricingNote[pricingNote];
  const priceTier = priceTierRaw as PriceTier;
  if (!allowedPriceTiers.has(priceTier)) {
    throw new Error(`Unknown price tier ${priceTierRaw} for resource ${key}`);
  }

  const wizardScore = normalizeWizardScore(item.wizardScore, key, pricingNote);

  const bestFor = Array.isArray(item.bestFor)
    ? assertStringArray(item.bestFor, "bestFor", key, { min: 2, max: 6 })
    : [...defaultBestForByObjective[objectiveKey]];

  const avoidIf = item.avoidIf === undefined ? [] : assertStringArray(item.avoidIf, "avoidIf", key, { min: 0, max: 3 });

  const perk = normalizePerk(item.perk, key);
  const badge = assertOptionalString(item.badge, "badge", key);

  const isFeatured = item.isFeatured === undefined ? false : item.isFeatured;
  if (typeof isFeatured !== "boolean") {
    throw new Error(`Invalid isFeatured for resource ${key}`);
  }

  const reviewSlugRaw = assertOptionalString(item.reviewSlug, "reviewSlug", key);
  const reviewSlug = reviewSlugRaw ? assertSlug(reviewSlugRaw, "reviewSlug", key) : undefined;

  const url = assertHttpUrl(assertNonEmptyString(item.url, "url", key), "url", key);
  const affiliateUrl =
    typeof item.affiliateUrl === "string" && item.affiliateUrl.trim().length > 0
      ? assertHttpUrl(item.affiliateUrl.trim(), "affiliateUrl", key)
      : undefined;

  const freeAlternativeKeys = Array.isArray(item.freeAlternativeKeys)
    ? item.freeAlternativeKeys.map((alt, altIndex) => {
        if (typeof alt !== "string" || alt.trim().length === 0) {
          throw new Error(`Invalid freeAlternativeKeys[${altIndex}] for resource ${key}`);
        }
        return alt.trim();
      })
    : [];

  const uniqueCriteria = new Set(criteriaUsed);
  if (uniqueCriteria.size !== criteriaUsed.length) {
    throw new Error(`criteriaUsed contains duplicates for resource ${key}`);
  }

  const uniqueWhyRecommended = new Set(whyRecommended);
  if (uniqueWhyRecommended.size !== whyRecommended.length) {
    throw new Error(`whyRecommended contains duplicates for resource ${key}`);
  }

  const uniqueBestFor = new Set(bestFor);
  if (uniqueBestFor.size !== bestFor.length) {
    throw new Error(`bestFor contains duplicates for resource ${key}`);
  }

  const uniqueAvoidIf = new Set(avoidIf);
  if (uniqueAvoidIf.size !== avoidIf.length) {
    throw new Error(`avoidIf contains duplicates for resource ${key}`);
  }

  return {
    key,
    name,
    category,
    description,
    whyRecommended,
    criteriaUsed,
    pricingNote,
    priceTier,
    wizardScore,
    bestFor,
    avoidIf,
    perk,
    badge,
    isFeatured,
    reviewSlug,
    url,
    affiliateUrl,
    freeAlternativeKeys
  };
};

const loadResources = (): ResourceEntry[] => {
  const parsed = parse(resourcesYaml);

  if (!Array.isArray(parsed)) {
    throw new Error("resources.yaml must contain a top-level array");
  }

  const normalized = parsed.map(normalizeResource);
  const keySet = new Set<string>();
  const reviewSlugSet = new Set<string>();

  for (const resource of normalized) {
    if (keySet.has(resource.key)) {
      throw new Error(`Duplicate resource key: ${resource.key}`);
    }
    keySet.add(resource.key);

    if (resource.reviewSlug) {
      if (reviewSlugSet.has(resource.reviewSlug)) {
        throw new Error(`Duplicate reviewSlug: ${resource.reviewSlug}`);
      }
      reviewSlugSet.add(resource.reviewSlug);
    }
  }

  for (const resource of normalized) {
    const alternativeSet = new Set(resource.freeAlternativeKeys);
    if (alternativeSet.size !== resource.freeAlternativeKeys.length) {
      throw new Error(`Duplicate free alternatives for resource ${resource.key}`);
    }

    for (const alternativeKey of resource.freeAlternativeKeys) {
      if (!keySet.has(alternativeKey)) {
        throw new Error(`Unknown free alternative key ${alternativeKey} in resource ${resource.key}`);
      }
      if (alternativeKey === resource.key) {
        throw new Error(`Resource ${resource.key} cannot reference itself as free alternative`);
      }
    }
  }

  return normalized;
};

export const resourcesCatalog = loadResources();

export const resourceByKey = new Map(resourcesCatalog.map((resource) => [resource.key, resource]));

export const resourceCategories: { key: ResourceCategory; label: string }[] = [
  { key: "ecriture", label: "Ecriture" },
  { key: "bibliographie", label: "Bibliographie" },
  { key: "sauvegarde", label: "Sauvegarde" },
  { key: "equipement", label: "Equipement" },
  { key: "focus", label: "Focus" },
  { key: "administratif", label: "Administratif" }
];

export const resourceObjectives: ResourceObjectiveDefinition[] = [
  {
    key: "ecrire",
    label: "Ecrire",
    description: "Structurer ses notes, produire du texte et améliorer la qualité linguistique."
  },
  {
    key: "citer-bibliographie",
    label: "Citer & bibliographie",
    description: "Gérer les références, les styles de citation et la traçabilité des sources."
  },
  {
    key: "lire-pdf-annoter",
    label: "Lire des PDF & annoter",
    description: "Lire efficacement, annoter et réinjecter les idées dans le système de notes."
  },
  {
    key: "sauvegarder-synchroniser",
    label: "Sauvegarder & synchroniser",
    description: "Sécuriser les fichiers de thèse et conserver des versions exploitables."
  },
  {
    key: "focus-routine",
    label: "Focus & routine",
    description: "Installer des séquences de travail régulières et pilotables."
  },
  {
    key: "administratif",
    label: "Administratif (France/international)",
    description: "Suivre les démarches institutionnelles avec des sources officielles."
  }
];

export const getResourceObjectiveKey = (resource: ResourceEntry): ResourceObjectiveKey => inferObjectiveKey(resource);

export const getResourcesByObjective = (): Array<{
  objective: ResourceObjectiveDefinition;
  items: ResourceEntry[];
}> =>
  resourceObjectives.map((objective) => ({
    objective,
    items: resourcesCatalog.filter((resource) => getResourceObjectiveKey(resource) === objective.key)
  }));

export const featuredResources = resourcesCatalog.filter((resource) => resource.isFeatured);

export const getResourceOutboundPath = (key: string): string => withBase(`/out/${key}/`);

export const getResourceReviewPath = (resource: ResourceEntry): string | null =>
  resource.reviewSlug ? withBase(`/outils/avis/${resource.reviewSlug}/`) : null;

export const getResourceDestination = (resource: ResourceEntry): string => resource.affiliateUrl ?? resource.url;
