import { brandMascotSrc } from "./brand";

export type MascotAction = "default" | "meditate" | "work" | "sport" | "sleep" | "present";

const mascotVariants = import.meta.glob("../assets/brand/mascot/mascot-afro-samurai_*.png", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const rootFallback = import.meta.glob("../assets/brand/mascot-afro-samurai.png", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const parseActionFromPath = (path: string): string | null => {
  const match = path.match(/mascot-afro-samurai_([a-z-]+)\.png$/i);
  return match ? match[1].toLowerCase() : null;
};

const actionOrder: MascotAction[] = ["default", "meditate", "work", "sport", "sleep", "present"];

const actionSrcMap = new Map<string, string>();

Object.entries(mascotVariants).forEach(([path, src]) => {
  const action = parseActionFromPath(path);
  if (!action) {
    return;
  }
  actionSrcMap.set(action, src);
});

const rootFallbackSrc = rootFallback["../assets/brand/mascot-afro-samurai.png"];
const computedDefaultSrc =
  actionSrcMap.get("default") ??
  rootFallbackSrc ??
  brandMascotSrc ??
  null;

if (computedDefaultSrc) {
  actionSrcMap.set("default", computedDefaultSrc);
}

export const listActions = (): MascotAction[] =>
  actionOrder.filter((action) => actionSrcMap.has(action));

export const getMascotSrc = (action: MascotAction | string = "default"): string | null => {
  const normalizedAction = String(action).toLowerCase();
  return actionSrcMap.get(normalizedAction) ?? actionSrcMap.get("default") ?? null;
};
