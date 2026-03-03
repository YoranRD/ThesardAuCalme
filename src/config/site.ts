const placeholderPattern = /<[^>]+>/;

export const brandName = "Thésard Au Calme";
export const brandDisplayName = "Thésard Au Calme";
export const brandTagline = "Des méthodes fiables pour avancer en doctorat en France, sans bruit.";

//export const stagingBaseUrl = "https://<user>.github.io/<repo>/";
export const stagingBaseUrl = "https://yoranrd.github.io/ThesardAuCalme/";
export const productionDomain = "thesardaucalme.com";
export const useProductionDomain = false;

export const cloudflareWebAnalyticsToken = "";

const fallbackStagingBaseUrl = "https://yoranrd.github.io/ThesardAuCalme/";
const normalizedStagingBaseUrl = placeholderPattern.test(stagingBaseUrl)
  ? fallbackStagingBaseUrl
  : stagingBaseUrl;

const ensureTrailingSlash = (value: string): string => (value.endsWith("/") ? value : `${value}/`);

export const activeSiteUrl = useProductionDomain
  ? `https://${productionDomain}/`
  : ensureTrailingSlash(normalizedStagingBaseUrl);

const activeSite = new URL(activeSiteUrl);
export const activeBasePath = activeSite.pathname === "/" ? "/" : activeSite.pathname.replace(/\/$/, "");

export const shouldGenerateCname = useProductionDomain;

export const getCanonicalUrl = (pathname: string): string => {
  const cleanedPath = pathname === "/" ? "" : `${pathname.replace(/^\/+|\/+$/g, "")}/`;
  return new URL(cleanedPath, activeSiteUrl).toString();
};

export const getAbsoluteAssetUrl = (assetPath: string): string => {
  const cleanedPath = assetPath.replace(/^\/+/, "");
  return new URL(cleanedPath, activeSiteUrl).toString();
};

export const siteDefaultTitle = `${brandDisplayName} | Doctorat en France`;
export const siteDefaultDescription =
  "Videos et guides concrets pour organiser un doctorat en France: outils, ecriture, focus et preparation de soutenance.";
