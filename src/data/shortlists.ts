export interface ObjectiveGroup {
  objective: string;
  keys: string[];
}

export interface ProfileConfig {
  slug: string;
  title: string;
  description: string;
  criteria: string;
  example: string;
  groups: ObjectiveGroup[];
}

export const shortlistProfiles: ProfileConfig[] = [
  {
    slug: "debut-these",
    title: "Début de thèse",
    description: "Stack minimal pour sécuriser l'administratif, les références et la routine scientifique dès le premier mois.",
    criteria:
      "Priorité à la traçabilité documentaire, à la robustesse administrative et à une routine de travail stable avec un coût logiciel minimal.",
    example:
      "Si le démarrage est flou, commencer par Zotero + Google Calendar + Syncthing, puis ajouter Obsidian la semaine suivante.",
    groups: [
      { objective: "Administratif", keys: ["campus-france", "france-visas", "service-public-fr"] },
      { objective: "Citer & bibliographie", keys: ["zotero", "jabref"] },
      { objective: "Écrire et organiser", keys: ["obsidian", "language-tool"] },
      { objective: "Sauvegarder", keys: ["syncthing", "google-drive"] },
      { objective: "Routine", keys: ["google-calendar", "google-tasks"] }
    ]
  },
  {
    slug: "redaction",
    title: "Rédaction",
    description: "Ensemble orienté production de texte: bibliographie propre, notes exploitables, focus répétable.",
    criteria:
      "Sélection orientée production de texte et réduction des frictions: chaîne note -> paragraphe -> section, citations propres, sessions profondes.",
    example:
      "Si la rédaction bloque, commencer par Obsidian + Zotero + Focus To-Do, puis ajouter LanguageTool pour la passe finale.",
    groups: [
      { objective: "Écrire", keys: ["obsidian", "notion", "typst", "language-tool"] },
      { objective: "Bibliographie", keys: ["zotero", "paperpile"] },
      { objective: "Lire & annoter", keys: ["hypothesis", "okular"] },
      { objective: "Focus", keys: ["focus-to-do", "todoist"] }
    ]
  },
  {
    slug: "soutenance",
    title: "Soutenance",
    description: "Outils utiles pour finaliser les versions, préparer les échanges et stabiliser le planning de défense.",
    criteria:
      "La shortlist privilégie la fiabilité des versions, la coordination avec l'encadrement et la discipline de planning plutôt que l'empilement d'outils.",
    example:
      "Si la soutenance approche, utiliser Overleaf ou Typst pour figer les versions, Todoist pour les jalons et Backblaze pour la redondance finale.",
    groups: [
      { objective: "Documents finaux", keys: ["overleaf", "typst", "antidote"] },
      { objective: "Bibliographie", keys: ["zotero", "mendeley"] },
      { objective: "Planning", keys: ["todoist", "google-calendar", "pomofocus"] },
      { objective: "Sauvegarde", keys: ["backblaze", "syncthing"] }
    ]
  }
];

export const shortlistBySlug = new Map(shortlistProfiles.map((profile) => [profile.slug, profile]));
