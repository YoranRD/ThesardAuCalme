import { activeSiteUrl } from "../config/site";

export const GET = (): Response => {
  const sitemapUrl = new URL("sitemap-index.xml", activeSiteUrl).toString();

  const content =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /out/\n` +
    `Disallow: /ThesardAuCalme/out/\n\n` +
    `Sitemap: ${sitemapUrl}\n`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
