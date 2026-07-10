import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const expectedCanaryDigest =
  "66123cf909a458066069383d6a67c8c523f2f48581423e88bee79a82b69d165c";
const candidate = process.env.GOBLINS_NETLIFY_BUILD_CANARY ?? "";
const candidateDigest = createHash("sha256").update(candidate).digest("hex");

const proof = {
  marker: "GOBLINS-NETLIFY-PROD-20260709-8718fc95",
  canary_match: candidate.length > 0 && candidateDigest === expectedCanaryDigest,
  context: process.env.CONTEXT ?? null,
  branch: process.env.BRANCH ?? null,
  head: process.env.HEAD ?? null,
  pull_request: process.env.PULL_REQUEST ?? null,
  review_id: process.env.REVIEW_ID ?? null,
  commit_ref: process.env.COMMIT_REF ?? null
};

await mkdir("dist", { recursive: true });
await writeFile(
  "dist/index.html",
  `<!doctype html><meta charset="utf-8"><title>Netlify boundary fixture</title><pre>${JSON.stringify(proof, null, 2)}</pre>\n`
);
await writeFile("dist/proof.json", `${JSON.stringify(proof, null, 2)}\n`);

console.log(JSON.stringify(proof));
