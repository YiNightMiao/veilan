import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const whole = join(root, "scripts/binaries.json");
const partsDir = join(root, "scripts/binaries.parts");

let raw;
if (existsSync(whole)) {
  raw = readFileSync(whole, "utf8");
} else {
  const parts = readdirSync(partsDir)
    .filter((name) => name.endsWith(".txt"))
    .sort();
  raw = parts.map((name) => readFileSync(join(partsDir, name), "utf8")).join("");
}

const manifest = JSON.parse(raw);

for (const [rel, b64] of Object.entries(manifest)) {
  const dest = join(root, rel);
  if (existsSync(dest)) continue;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(b64, "base64"));
}
