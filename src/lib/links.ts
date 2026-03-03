export function withBase(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.replace(/^\/+/, "");

  if (normalizedPath.length === 0) {
    return normalizedBase;
  }

  return `${normalizedBase}${normalizedPath}`;
}
