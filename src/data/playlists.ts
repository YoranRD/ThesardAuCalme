export type PlaylistStep = {
  title: string;
  goal: string;
  videoSlug?: string;
  articleSlug?: string;
  placeholder?: string;
};

export type PlaylistDefinition = {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  steps: PlaylistStep[];
  nextAction: string;
};

export const playlists: PlaylistDefinition[] = [
  {
    slug: "demarrer",
    title: "Playlist démarrer",
    summary: "Passer de l'incertitude à un système doctoral exploitable en une semaine.",
    audience: "Nouveau doctorant ou redémarrage après une phase de flottement.",
    steps: [
      {
        title: "Cartographier les priorités des 30 premiers jours",
        goal: "Identifier les démarches non négociables et les livrables scientifiques immédiats.",
        videoSlug: "doctorat-france-kit-administratif",
        articleSlug: "checklists-0-30-jours-doctorat-france-fr"
      },
      {
        title: "Construire une stack minimale d'outils",
        goal: "Éviter l'empilement d'applications et stabiliser un socle simple.",
        videoSlug: "top-5-outils-these",
        articleSlug: "top-5-outils-gratuits-demarrer-these-2026"
      },
      {
        title: "Sécuriser les procédures administratives",
        goal: "Réduire les risques de retard liés aux pièces manquantes.",
        videoSlug: "international-phd-france-admin-sequence",
        articleSlug: "top-5-pieges-administratifs-doctorat-france"
      },
      {
        title: "Planifier un rythme hebdomadaire réaliste",
        goal: "Passer d'une todo floue à trois sorties hebdomadaires mesurables.",
        videoSlug: "build-weekly-phd-routine-france",
        articleSlug: "top-5-routines-hebdo-doctorat"
      },
      {
        title: "Installer une boucle revue + ajustement",
        goal: "Créer une revue courte pour corriger la trajectoire dès la première semaine.",
        placeholder: "Vidéo de synthèse démarrage (à venir)",
        articleSlug: "top-5-mini-systemes-anti-procrastination"
      }
    ],
    nextAction: "Réserver 90 minutes cette semaine pour appliquer les 2 premières étapes et produire une checklist personnelle."
  },
  {
    slug: "redaction",
    title: "Playlist rédaction",
    summary: "Structurer la production de texte sans casser la charge cognitive.",
    audience: "Doctorant en phase de chapitre, mémoire ou article long.",
    steps: [
      {
        title: "Découper la rédaction en unités livrables",
        goal: "Transformer un chapitre vague en séquences de 60 à 90 minutes.",
        videoSlug: "top-5-methodes-ecrire-quand-manque-temps",
        articleSlug: "top-5-methodes-ecrire-manque-temps"
      },
      {
        title: "Passer des notes au paragraphe",
        goal: "Construire un pipeline stable lecture -> notes -> section.",
        videoSlug: "routine-lecture-45-minutes",
        articleSlug: "pipeline-note-paragraphe-section-exemple-complet"
      },
      {
        title: "Cadrer la structure de chapitre",
        goal: "Limiter les réécritures tardives avec une architecture claire.",
        articleSlug: "planifier-chapitre-90-minutes-template-exemple",
        placeholder: "Vidéo structure de chapitre (à venir)"
      },
      {
        title: "Améliorer la relation feedback encadrement",
        goal: "Gagner en clarté dans les itérations de relecture.",
        videoSlug: "relecture-directeur-sans-blocage",
        articleSlug: "gerer-relation-directeur-systeme-suivi-mail-templates"
      },
      {
        title: "Finaliser la relecture en passes séparées",
        goal: "Séparer logique, preuves et style pour éviter la confusion de correction.",
        articleSlug: "relire-chapitre-protocole-3-passes-logique-preuves-style"
      }
    ],
    nextAction: "Choisir une section en cours et l'avancer avec le protocole notes -> paragraphe avant la prochaine revue de semaine."
  },
  {
    slug: "zotero-biblio",
    title: "Playlist Zotero & bibliographie",
    summary: "Fiabiliser les citations et éviter les dettes bibliographiques en fin de thèse.",
    audience: "Doctorant qui écrit avec citations fréquentes et corpus en croissance.",
    steps: [
      {
        title: "Installer une base Zotero propre",
        goal: "Définir collections, tags et contrôle des métadonnées minimales.",
        videoSlug: "top-5-outils-these",
        articleSlug: "top-5-erreurs-zotero-fixes"
      },
      {
        title: "Éliminer les doublons dès l'entrée",
        goal: "Éviter la contamination de la base par des imports incohérents.",
        videoSlug: "top-5-erreurs-zotero-et-solutions",
        articleSlug: "comparatif-zotero-vs-mendeley"
      },
      {
        title: "Stabiliser le style de citation",
        goal: "Réduire les corrections tardives sur bibliographie finale.",
        placeholder: "Vidéo styles CSL et citations (à venir)",
        articleSlug: "repondre-reviewers-modele-reponse-checklist"
      },
      {
        title: "Relier bibliographie et rédaction",
        goal: "Maintenir une traçabilité claire entre source et argument.",
        videoSlug: "top-5-methodes-ecrire-quand-manque-temps",
        articleSlug: "pipeline-note-paragraphe-section-exemple-complet"
      },
      {
        title: "Préparer la phase reviewers",
        goal: "Structurer les références pour répondre vite et proprement.",
        articleSlug: "repondre-reviewers-modele-reponse-checklist"
      }
    ],
    nextAction: "Auditer 20 références cette semaine avec un contrôle de métadonnées et un export test."
  },
  {
    slug: "international-france",
    title: "Playlist international en France",
    summary: "Ordonnancer les démarches critiques pour sécuriser l'installation doctorale.",
    audience: "Doctorant international entrant ou en renouvellement administratif.",
    steps: [
      {
        title: "Poser la séquence administrative globale",
        goal: "Comprendre l'ordre des démarches avant d'exécuter.",
        videoSlug: "international-phd-france-admin-sequence",
        articleSlug: "checklists-0-30-jours-doctorat-france-fr"
      },
      {
        title: "Gérer logement, banque et couverture santé",
        goal: "Sécuriser les fondamentaux de vie pour protéger le temps de recherche.",
        videoSlug: "international-logement-banque-secu-ordre-demarches",
        articleSlug: "banque-choisir-ouvrir-compte-sans-pieges"
      },
      {
        title: "Caler les aides et droits sociaux",
        goal: "Éviter les retards coûteux sur dossiers CAF et justificatifs.",
        articleSlug: "caf-apl-doctorat-checklists-erreurs-2-mois"
      },
      {
        title: "Organiser les preuves et renouvellements",
        goal: "Conserver un historique exploitable en cas de relance.",
        articleSlug: "renouvellement-titre-sejour-calendrier-preuves-archiver"
      },
      {
        title: "Prévoir les points de friction du semestre",
        goal: "Mettre en place une routine de vérification mensuelle.",
        placeholder: "Vidéo audit administratif trimestriel (à venir)"
      }
    ],
    nextAction: "Créer un tableau unique (démarche, date limite, preuve) et bloquer une revue hebdo de 20 minutes."
  },
  {
    slug: "soutenance",
    title: "Playlist soutenance",
    summary: "Préparer la soutenance comme un projet complet: contenu, rythme et preuves.",
    audience: "Doctorant en phase finale ou pré-finale.",
    steps: [
      {
        title: "Lancer un plan de préparation à 90 jours",
        goal: "Segmenter la préparation en jalons clairs et datés.",
        videoSlug: "plan-soutenance-90-jours",
        articleSlug: "top-5-preparer-soutenance-sans-stress"
      },
      {
        title: "Structurer le deck de soutenance",
        goal: "Obtenir une narration concise avec preuve et limites explicites.",
        articleSlug: "slides-soutenance-structure-12-15-slides"
      },
      {
        title: "Renforcer la cohérence des chapitres finaux",
        goal: "Éviter les contradictions entre manuscrit, slides et oral.",
        articleSlug: "relire-chapitre-protocole-3-passes-logique-preuves-style"
      },
      {
        title: "Préparer les questions critiques",
        goal: "Construire un protocole de réponses courtes et argumentées.",
        videoSlug: "top-5-erreurs-these",
        articleSlug: "repondre-reviewers-modele-reponse-checklist"
      },
      {
        title: "Caler le plan d'après-soutenance",
        goal: "Réduire la charge mentale finale avec un cap carrière explicite.",
        articleSlug: "postdoc-shortlist-7-jours-criteres-emails-pieges"
      }
    ],
    nextAction: "Définir les 3 livrables de soutenance du mois puis associer une échéance et une revue de contrôle."
  },
  {
    slug: "focus-routine",
    title: "Playlist focus & routine",
    summary: "Tenir une cadence durable sans sacrifier la qualité scientifique.",
    audience: "Doctorant en surcharge ou en perte de rythme.",
    steps: [
      {
        title: "Diagnostiquer les points de dispersion",
        goal: "Repérer les fuites d'attention et les tâches sans impact réel.",
        videoSlug: "top-5-erreurs-these",
        articleSlug: "top-5-mini-systemes-anti-procrastination"
      },
      {
        title: "Installer un planning hebdo tenable",
        goal: "Limiter la surcharge avec des blocs de sortie réalistes.",
        videoSlug: "build-weekly-phd-routine-france",
        articleSlug: "top-5-routines-hebdo-doctorat"
      },
      {
        title: "Conserver l'élan en période dense",
        goal: "Maintenir les livrables clés malgré imprévus administratifs.",
        articleSlug: "stress-protocole-stop-48h-reprise-5-jours"
      },
      {
        title: "Soutenir la lecture active",
        goal: "Éviter d'accumuler sans transformer en écriture.",
        videoSlug: "routine-lecture-45-minutes",
        articleSlug: "top-5-techniques-lire-papier-efficacement"
      },
      {
        title: "Boucler sur une revue mensuelle",
        goal: "Mesurer ce qui produit réellement du texte ou des preuves.",
        placeholder: "Vidéo revue mensuelle doctorat (à venir)"
      }
    ],
    nextAction: "Choisir une règle simple de pilotage (3 priorités/jour) et l'appliquer pendant 14 jours avant ajustement."
  }
];
