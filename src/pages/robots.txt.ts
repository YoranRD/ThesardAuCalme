import { getCanonicalUrl } from "../config/site";

export const GET = (): Response => {
  const content =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /out/\n` +
    `Disallow: /ThesardAuCalme/out/\n\n` +
    `Sitemap: ${getCanonicalUrl("/sitemap-index.xml")}\n`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};