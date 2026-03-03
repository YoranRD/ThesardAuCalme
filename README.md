# Thésard Au Calme

Site statique Astro pour une marque YouTube no-face autour de la vie en doctorat en France.

## Stack

- Astro + TypeScript
- Content collections (`videos`, `guides`)
- Catalogue ressources YAML validé au build
- Déploiement GitHub Actions vers GitHub Pages

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuration domaine (staging d'abord)

Toute la configuration domaine est centralisée dans:

- `src/config/site.ts`

Variables clés:

- `stagingBaseUrl = "https://<user>.github.io/<repo>/"`
- `productionDomain = "thesardaucalme.com"`
- `useProductionDomain = false`

Comportement:

- `useProductionDomain = false`:
  - canonical URLs sur l'URL GitHub Pages (staging)
  - pas de `public/CNAME`
- `useProductionDomain = true`:
  - canonical URLs sur `https://thesardaucalme.com`
  - génération automatique de `public/CNAME` avec `thesardaucalme.com` via `scripts/sync-cname.mjs`

## Déploiement GitHub Pages (sans domaine custom)

Préparation obligatoire:

1. Remplacer `stagingBaseUrl` dans `src/config/site.ts` par l'URL réelle du dépôt, par exemple `https://mon-user.github.io/mon-repo/`.

Puis:

1. Pousser le repo sur GitHub.
2. Vérifier que la branche par défaut est `main`.
3. Dans GitHub: `Settings > Pages`.
4. Dans `Build and deployment`, sélectionner `Source: GitHub Actions`.
5. Pousser un commit sur `main` (ou lancer le workflow manuellement).
6. Le site sera public sur `https://<user>.github.io/<repo>/`.

## Bascule future vers domaine custom

Quand le domaine est prêt:

1. Modifier `src/config/site.ts`:
   - `useProductionDomain = true`
   - garder `productionDomain = "thesardaucalme.com"`
2. Commit + push.
3. Le build génère `public/CNAME` automatiquement.
4. Dans GitHub Pages, renseigner le custom domain si nécessaire.

## DNS (résumé)

Pour un apex domain (`thesardaucalme.com`):

- Ajouter les A records GitHub Pages recommandés:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

Pour `www`:

- Ajouter un CNAME `www -> <user>.github.io`

Toujours vérifier les instructions officielles GitHub Pages:

- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Cloudflare Web Analytics

Par défaut, l'intégration est inactive.

Activer en définissant le token dans `src/config/site.ts`:

- `cloudflareWebAnalyticsToken = "<TOKEN>"`

Quand le token est présent, le script beacon est injecté automatiquement dans le layout.

Snippet équivalent (déjà géré automatiquement dans le layout):

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token":"<TOKEN>"}'
></script>
```

Emplacement d'intégration:

- `src/layouts/BaseLayout.astro`

Lecture des métriques utiles côté Cloudflare:

- Top pages
- Referrers
- Countries
- Clics affiliés via les pages les plus vues sous `/out/[key]/`

## Tracking des clics affiliés (statique)

Toutes les ressources externes passent par:

- `/out/[key]/`

Le routeur `/out/[key]/`:

- `noindex, nofollow`
- redirection immédiate JS
- fallback meta refresh

Cela permet de suivre les clics sortants dans n'importe quel outil analytics sans service payant.

## Structure principale

- `src/pages/` routes du site (FR + scaffold EN)
- `src/content/videos/` fiches vidéos
- `src/content/guides/` guides longs
- `src/data/resources.yaml` catalogue ressources
- `src/config/site.ts` config domaine + canonical + analytics
- `.github/workflows/deploy.yml` déploiement automatique Pages

## Remplacer les youtubeId

Les entrées vidéo dans `src/content/videos/` utilisent des IDs YouTube valides (11 caractères) pour que le build passe.

Pour remplacer par les IDs définitifs:

1. Ouvrir le fichier Markdown de la vidéo concernée.
2. Mettre à jour `youtubeId:` avec l'ID réel (exactement 11 caractères).
3. Lancer `npm run build` pour valider le schéma de collection.

## Ajouter du contenu ensuite

- Nouvelles vidéos: `src/content/videos/*.md`
- Nouveaux guides: `src/content/guides/*.md`
- Nouvelles ressources software: `src/data/resources.yaml`

À chaque ajout, vérifier:

- tags cohérents pour les pages `/themes` et `/en/topics`
- clés de ressources valides dans `featuredResourceKeys`
- build vert avec `npm run build`
