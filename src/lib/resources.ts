import { parse } from "yaml";
import resourcesYaml from "../data/resources.yaml?raw";

export type ResourceCategory =
  | "ecriture"
  | "bibliographie"
  | "sauvegarde"
  | "equipement"
  | "focus"
  | "administratif";

export type PricingNote = "free" | "paid" | "freemium";

export interface ResourceEntry {
  key: string;
  name: string;
  category: ResourceCategory;
  description: string;
  whyRecommended: string[];
  criteriaUsed: string[];
  pricingNote: PricingNote;
  url: string;
  affiliateUrl?: string;
  freeAlternativeKeys: string[];
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const assertNonEmptyString = (value: unknown, field: string, key: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${field} for resource ${key}`);
  }
  return value.trim();
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

  if (!allowedCategories.has(category)) {
    throw new Error(`Unknown category ${category} for resource ${key}`);
  }

  if (!allowedPricingNotes.has(pricingNote)) {
    throw new Error(`Unknown pricing note ${pricingNote} for resource ${key}`);
  }

  const uniqueCriteria = new Set(criteriaUsed);
  if (uniqueCriteria.size !== criteriaUsed.length) {
    throw new Error(`criteriaUsed contains duplicates for resource ${key}`);
  }

  const uniqueWhyRecommended = new Set(whyRecommended);
  if (uniqueWhyRecommended.size !== whyRecommended.length) {
    throw new Error(`whyRecommended contains duplicates for resource ${key}`);
  }

  return {
    key,
    name,
    category,
    description,
    whyRecommended,
    criteriaUsed,
    pricingNote,
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

  for (const resource of normalized) {
    if (keySet.has(resource.key)) {
      throw new Error(`Duplicate resource key: ${resource.key}`);
    }
    keySet.add(resource.key);
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

export const getResourceOutboundPath = (key: string): string => `/out/${key}/`;

export const getResourceDestination = (resource: ResourceEntry): string => resource.affiliateUrl ?? resource.url;
