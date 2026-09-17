/** Resolve hook so plain Node can run the project's .ts modules, which use
 *  TypeScript "bundler" resolution: extensionless relative imports and the
 *  "@/..." alias for src/. Throwaway test harness only — Node 24 strips the
 *  types itself. */
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "../../src") + "/";

function tryFiles(base) {
  const candidates = [base + ".ts", base + ".tsx", base, base + "/index.ts", base + "/index.tsx"];
  for (const cand of candidates) {
    if (existsSync(cand) && statSync(cand).isFile()) return cand;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  let target = null;

  if (specifier.startsWith("@/")) {
    target = tryFiles(path.resolve(SRC, specifier.slice(2)));
  } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    target = tryFiles(path.resolve(parentDir, specifier));
  }

  if (target) return next(pathToFileURL(target).href, context);
  return next(specifier, context);
}
