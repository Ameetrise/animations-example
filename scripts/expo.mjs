import { execFileSync, spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let repository = process.env.VERCEL_GIT_REPO_SLUG;

if (!repository) {
  try {
    const remote = execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    repository = remote
      .split("/")
      .at(-1)
      .replace(/\.git$/, "");
  } catch {
    repository = "animations-example";
  }
}

const brand =
  process.env.EXPO_PUBLIC_BRAND ||
  (repository === "spinquest" ? "spinquest" : "pack");

if (!["pack", "spinquest"].includes(brand)) {
  throw new Error("EXPO_PUBLIC_BRAND must be pack or spinquest.");
}

console.log(
  `Starting Expo with ${brand === "spinquest" ? "SpinQuest" : "Pack.com"} branding`,
);
const result = spawnSync(
  process.execPath,
  [require.resolve("expo/bin/cli"), ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      EXPO_PUBLIC_BRAND: brand,
    },
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
