import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), "src/config/site.ts");
const publicPath = resolve(process.cwd(), "public");
const cnamePath = resolve(publicPath, "CNAME");

const configSource = readFileSync(configPath, "utf8");
const domainMatch = configSource.match(/productionDomain\s*=\s*"([^"]+)"/);
const toggleMatch = configSource.match(/useProductionDomain\s*=\s*(true|false)/);

if (!domainMatch || !toggleMatch) {
  throw new Error("Unable to read productionDomain/useProductionDomain from src/config/site.ts");
}

const productionDomain = domainMatch[1].trim();
const useProductionDomain = toggleMatch[1] === "true";

mkdirSync(publicPath, { recursive: true });

if (useProductionDomain) {
  writeFileSync(cnamePath, `${productionDomain}\n`, "utf8");
} else if (existsSync(cnamePath)) {
  rmSync(cnamePath);
}
