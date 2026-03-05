export type StackItem = {
  key: string;
  reason: string;
};

export type StackDefinition = {
  slug: string;
  title: string;
  summary: string;
  budgetLine: string;
  items: StackItem[];
};

export const stacks: StackDefinition[] = [
  {
    slug: "stack-minimal-gratuit",
    title: "Stack minimal gratuit",
    summary: "Socle gratuit pour démarrer une thèse avec écriture, biblio, sauvegarde et routine sans abonnement.",
    budgetLine: "Budget: 0€ à 5€/mois selon options de synchronisation externes.",
    items: [
      {
        key: "zotero",
        reason: "Références et citations traçables avec formats ouverts dès le premier mois."
      },
      {
        key: "obsidian",
        reason: "Base locale de notes reliées pour transformer lecture en sections de chapitre."
      },
      {
        key: "syncthing",
        reason: "Synchronisation pair-à-pair pour sécuriser les dossiers critiques sans abonnement."
      },
      {
        key: "pomofocus",
        reason: "Lancer des blocs focus immédiats quand la charge mentale monte."
      },
      {
        key: "campus-france",
        reason: "Point d'ancrage institutionnel pour le cadrage administratif international."
      }
    ]
  },
  {
    slug: "stack-redaction",
    title: "Stack rédaction",
    summary: "Pipeline complet notes -> structure -> correction pour augmenter la sortie texte hebdomadaire.",
    budgetLine: "Budget: gratuit à €€ selon niveau de correction linguistique et besoins collaboratifs.",
    items: [
      {
        key: "obsidian",
        reason: "Orchestre les notes de lecture et les liens vers les sections en production."
      },
      {
        key: "overleaf",
        reason: "Facilite la co-rédaction de documents LaTeX et les itérations de revue."
      },
      {
        key: "language-tool",
        reason: "Nettoie les erreurs de première passe avant relecture scientifique finale."
      },
      {
        key: "todoist",
        reason: "Découpe la rédaction en livrables datés et protège les deadlines de chapitre."
      },
      {
        key: "readwise-reader",
        reason: "Centralise les highlights de lecture quand le flux documentaire devient massif."
      }
    ]
  },
  {
    slug: "stack-biblio",
    title: "Stack biblio",
    summary: "Chaîne de travail dédiée aux références fiables, annotations et réinjection dans l'écriture.",
    budgetLine: "Budget: principalement gratuit, option €€ pour lecture avancée selon volume documentaire.",
    items: [
      {
        key: "zotero",
        reason: "Noyau bibliographique durable avec export stable et contrôle des métadonnées."
      },
      {
        key: "jabref",
        reason: "Complément utile dans les contextes BibTeX/LaTeX exigeants."
      },
      {
        key: "hypothesis",
        reason: "Annotation web collaborative pour revue de littérature distribuée."
      },
      {
        key: "readwise-reader",
        reason: "Accélère la consolidation des annotations quand le corpus explose."
      },
      {
        key: "obsidian",
        reason: "Relie chaque source à une note de synthèse exploitable en rédaction."
      }
    ]
  },
  {
    slug: "stack-sauvegarde-321",
    title: "Stack sauvegarde 3-2-1",
    summary: "Empilement minimal pour réduire le risque de perte de données et tester la restauration réelle.",
    budgetLine: "Budget: gratuit à €€€ selon niveau de backup cloud managé choisi.",
    items: [
      {
        key: "syncthing",
        reason: "Première couche de réplication entre machines critiques du projet."
      },
      {
        key: "rclone",
        reason: "Automatise des copies chiffrées vers plusieurs destinations cloud."
      },
      {
        key: "google-drive",
        reason: "Point de stockage partagé simple pour documents administratifs et versions d'échange."
      },
      {
        key: "backblaze",
        reason: "Backup cloud continu pour couvrir les scénarios de panne matérielle."
      },
      {
        key: "todoist",
        reason: "Rappels de tests de restauration pour vérifier la stratégie 3-2-1 dans le temps."
      }
    ]
  }
];
