import type { CollectionEntry } from "astro:content";

export const normalizePageRoute = (route: string): string => {
  const trimmed = route.trim();
  if (trimmed === "/") {
    return "/";
  }

  const cleaned = trimmed.replace(/^\/+|\/+$/g, "");
  return `/${cleaned}/`;
};

export const routeToSlugParam = (route: string): string => normalizePageRoute(route).replace(/^\/|\/$/g, "");

export const assertPageRoutesAreUnique = (pages: CollectionEntry<"pages">[]): void => {
  const seenRoutes = new Map<string, string>();

  for (const page of pages) {
    const normalizedRoute = normalizePageRoute(page.data.route);

    if (normalizedRoute !== page.data.route) {
      throw new Error(
        `Page route must stay normalized and end with '/': "${page.data.route}" in entry "${page.id}"`
      );
    }

    const previousPage = seenRoutes.get(normalizedRoute);
    if (previousPage) {
      throw new Error(
        `Duplicate page route "${normalizedRoute}" found in entries "${previousPage}" and "${page.id}"`
      );
    }

    seenRoutes.set(normalizedRoute, page.id);
  }
};
