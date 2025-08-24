// post\scripts\prisma.mjs

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

/** Change this line per service */
const DB_PACKAGE = "nihildbpost";

const require = createRequire(import.meta.url);
const originalSchemaPath = require.resolve(
  `${DB_PACKAGE}/prisma/schema.prisma`,
);

function patchSchemaToNative(srcPath) {
  const raw = fs.readFileSync(srcPath, "utf8");

  // Find generator client { ... } and replace/insert binaryTargets = ["native"]
  const genRegex = /generator\s+client\s*\{([\s\S]*?)\}/m;
  const m = raw.match(genRegex);
  if (!m) return srcPath; // nothing to patch

  let block = m[1];
  if (/binaryTargets\s*=/.test(block)) {
    block = block.replace(
      /binaryTargets\s*=\s*\[[^\]]*\]/m,
      'binaryTargets = ["native"]',
    );
  } else {
    // Insert after provider line
    block = block.replace(
      /(provider\s*=\s*["'][^"']+["'][^\n]*\n)/m,
      `$1  binaryTargets = ["native"]\n`,
    );
  }

  const patched = raw.replace(genRegex, `generator client {${block}}`);
  const tmpDir = path.join(process.cwd(), ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  const tmpFile = path.join(
    tmpDir,
    `patched-${DB_PACKAGE}-${Date.now()}.prisma`,
  );
  fs.writeFileSync(tmpFile, patched, "utf8");
  return tmpFile;
}

const [cmd, ...rest] = process.argv.slice(2);
const isGenerate = cmd === "generate";
const isMigrate = cmd === "migrate";

let args = [];
let schemaToUse = originalSchemaPath;

if (isGenerate) {
  // Use patched schema so we only download native engine
  schemaToUse = patchSchemaToNative(originalSchemaPath);
  args = ["prisma", "generate", "--schema", schemaToUse];
} else if (isMigrate) {
  // Always skip generate here; we'll call generate explicitly after if needed
  const sub = rest[0] || "";
  const pass = rest.slice(1);
  args = ["prisma", "migrate", sub, ...pass, "--schema", originalSchemaPath];
  if (["dev", "reset"].includes(sub)) {
    args.push("--skip-generate");
  }
} else {
  // Fallback: pass through and append our schema
  args = ["prisma", cmd, ...rest, "--schema", originalSchemaPath];
}

const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(npxBin, args, { stdio: "inherit", shell: true });

// Cleanup temp schema (best-effort)
if (isGenerate && schemaToUse !== originalSchemaPath) {
  try {
    fs.unlinkSync(schemaToUse);
  } catch (err) {
    console.error(err);
  }
}

process.exit(result.status ?? 1);
