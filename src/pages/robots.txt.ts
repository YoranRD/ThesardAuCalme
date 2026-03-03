import { getCanonicalUrl } from "../config/site";

export const GET = (): Response => {
  const content = `User-agent: *\nAllow: /\nDisallow: /out/\n\nSitemap: ${getCanonicalUrl("/sitemap-index.xml")}\n`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
