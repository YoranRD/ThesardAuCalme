const assetModule = import.meta.glob("../assets/brand/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const pickFirstAsset = (candidates: string[]): string | null => {
  for (const candidate of candidates) {
    const found = assetModule[candidate];
    if (found) {
      return found;
    }
  }
  return null;
};

export const brandLogoSrc = pickFirstAsset([
  "../assets/brand/logo.svg"
]);

export const brandWordmarkSrc = pickFirstAsset(["../assets/brand/wordmark.svg"]);

export const brandMascotSrc = pickFirstAsset([
  "../assets/brand/mascot-afro-samurai.svg",
  "../assets/brand/mascot-afro-samurai.png",
  "../assets/brand/mascot.svg"
]);

export const hasBrandMascot = Boolean(brandMascotSrc);
