---
title: "Sauvegarde: règle 3-2-1 appliquée à une thèse"
date: 2026-03-03
lang: fr
summary: Mise en œuvre concrète de la règle 3-2-1 pour protéger une thèse, avec protocole hebdo, architecture de dossiers et tests de restauration.
tags:
  - sauvegarde
  - securite
  - workflow
  - these
---

La perte de données est l'un des risques les plus sous-estimés en doctorat. Le danger n'est pas uniquement la panne totale d'un disque. Le danger réel est souvent banal: suppression involontaire, fichier écrasé, synchronisation défaillante, corruption silencieuse. La règle 3-2-1 réduit ce risque de manière simple et robuste.

## Règle 3-2-1, définition opérationnelle

- **3 copies** des données critiques.
- **2 types de supports** différents.
- **1 copie hors site** (hors machine principale et hors lieu principal).

Appliquée à une thèse, cette règle doit couvrir:

- manuscrit et annexes,
- base bibliographique,
- notes de lecture,
- scripts et données d'analyse,
- présentations et documents administratifs.

## Cartographie des actifs critiques

Avant d'installer des outils, lister les actifs à protéger:

1. Texte en cours (chapitres, articles).
2. Références et PDF.
3. Données expérimentales ou corpus.
4. Scripts d'analyse.
5. Démarches administratives (inscription, visa, contrats, assurance).

Chaque actif reçoit un niveau de criticité: élevé, moyen, faible.

## Architecture de dossiers recommandée

Exemple simple:

- `these/01_manuscrit`
- `these/02_biblio`
- `these/03_donnees`
- `these/04_scripts`
- `these/05_admin`
- `these/99_exports`

Une arborescence stable facilite l'automatisation des sauvegardes.

## Choisir les trois copies

### Copie A: travail local

Machine principale, sauvegarde fréquente (snapshots locaux).

### Copie B: synchronisation active

Exemple: Syncthing ou cloud (Google Drive/Dropbox) pour continuité entre appareils.

### Copie C: sauvegarde froide hors site

Exemple: Backblaze ou disque externe stocké hors bureau principal.

La copie C ne doit pas dépendre du même compte cloud que la copie B.

## Fréquences recommandées

- Données de rédaction: quotidien.
- Données bibliographiques: quotidien ou après import massif.
- Données lourdes: hebdomadaire.
- Archive hors site complète: hebdomadaire ou bi-hebdomadaire.

La fréquence dépend du coût de reconstitution, pas du confort technique.

## Stratégie de versioning

Utiliser un versioning minimal pour le manuscrit:

- nommage daté,
- snapshot avant relecture majeure,
- commentaire de changement bref.

Exemple:

`chapitre-03_2026-03-03_v05.md`

Le versioning réduit le risque de perte logique, même quand les fichiers existent encore.

## Test de restauration: le point souvent oublié

Une sauvegarde non testée est une hypothèse, pas une sécurité.

### Test mensuel recommandé

1. Choisir un sous-dossier critique.
2. Supprimer une copie locale de test (pas la source réelle).
3. Restaurer depuis copie B puis depuis copie C.
4. Vérifier intégrité des fichiers restaurés.

Consigner la date et le résultat du test.

## Contrôle d'intégrité

Pour les données sensibles:

- vérifier tailles de fichiers,
- vérifier ouverture effective des documents,
- pour scripts: exécuter un test court après restauration.

L'intégrité se mesure par usage, pas par simple présence du fichier.

## Pipeline hebdomadaire de sauvegarde (30 min)

### Étape 1: nettoyage

- fermer fichiers temporaires,
- supprimer exports inutiles,
- confirmer l'arborescence active.

### Étape 2: sync active

- lancer synchronisation,
- vérifier qu'aucune erreur de conflit n'est en attente.

### Étape 3: backup hors site

- déclencher sauvegarde distante,
- contrôler journal de succès.

### Étape 4: journal

- noter date,
- taille approximative sauvegardée,
- incidents éventuels.

Ce journal permet un diagnostic rapide en cas d'incident.

## Cas particulier: gros fichiers de données

Les corpus volumineux demandent une stratégie dédiée:

- séparer données brutes et dérivées,
- compresser les versions figées,
- conserver une trace des transformations.

Éviter de synchroniser en temps réel des fichiers massifs non stabilisés.

## Sécurité minimale

- activer authentification forte sur comptes cloud,
- chiffrer les supports externes,
- limiter les partages publics non nécessaires,
- éviter stockage de mots de passe en clair dans les notes.

La sécurité n'a pas besoin d'être complexe pour être efficace.

## Erreurs fréquentes

### Erreur 1: confondre sync et backup

La synchronisation propage aussi les suppressions. Ce n'est pas une sauvegarde complète.

### Erreur 2: tout mettre dans un seul fournisseur

Un seul fournisseur crée un risque systémique.

### Erreur 3: pas de copie hors site

En cas de vol, sinistre ou panne multiple locale, la récupération devient impossible.

### Erreur 4: ignorer les documents administratifs

Les documents institutionnels perdus coûtent du temps et parfois des pénalités.

## Plan de continuité en cas de panne machine

Préparer une procédure écrite de 10 lignes:

- récupérer environnement de travail minimal,
- restaurer dossiers prioritaires,
- vérifier Zotero et manuscrit,
- reprendre la session d'écriture en moins de 24h.

Ce plan transforme une crise en interruption contrôlée.

## Checklist 3-2-1 doctorat

- Trois copies distinctes existent-elles pour les dossiers critiques?
- Deux supports différents sont-ils utilisés?
- Une copie hors site récente est-elle disponible?
- Un test de restauration a-t-il été réalisé ce mois-ci?
- Le journal de sauvegarde est-il à jour?

Si la réponse est oui aux cinq questions, la protection est déjà solide.

## Conclusion

La règle 3-2-1 n'est pas un luxe technique. C'est une garantie de continuité scientifique. Une thèse s'étale sur plusieurs années; la sauvegarde doit être conçue pour cette durée. En appliquant une architecture simple, des fréquences réalistes et des tests de restauration réguliers, le risque de perte devient fortement maîtrisable.
