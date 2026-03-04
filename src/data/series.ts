export interface SeriesDefinition {
  key: string;
  slug: string;
  title: string;
  description: string;
}

export const seriesCatalog: SeriesDefinition[] = [
  {
    key: "zotero-propre",
    slug: "zotero-propre",
    title: "Zotero propre",
    description:
      "Mettre en place une bibliographie traçable, sans doublons et sans surprises au moment de l'export final."
  },
  {
    key: "ecriture-sans-friction",
    slug: "ecriture-sans-friction",
    title: "Écriture sans friction",
    description:
      "Installer un système de rédaction tenable qui transforme les notes en sections publiables, semaine après semaine."
  },
  {
    key: "doctorat-france-international",
    slug: "doctorat-france-international",
    title: "Doctorat en France (international)",
    description:
      "Comprendre les bases administratives et l'ordre des démarches pour sécuriser le premier trimestre doctoral en France."
  }
];

export const seriesByKey = new Map(seriesCatalog.map((series) => [series.key, series]));
