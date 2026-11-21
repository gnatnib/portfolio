#!/usr/bin/env node
/* Copies the Spotify (and GitHub) values from .env to the linked Vercel
   project, replacing old values, for Production and Preview.

   Needs the Vercel CLI logged in and linked once:
     npx vercel login
     npx vercel link
   Usage: npm run env:push   (redeploy afterwards so the new values load) */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const KEYS = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN", "GITHUB_TOKEN"];
const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
const vercel = (args, input) =>
  spawnSync("npx", ["vercel", ...args], { input, encoding: "utf8", shell: process.platform === "win32" });

for (const key of KEYS) {
  const value = env.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
  if (!value) {
    console.log(`skip ${key}: empty in .env`);
    continue;
  }
  for (const target of ["production", "preview"]) {
    vercel(["env", "rm", key, target, "--yes"]);
    const added = vercel(["env", "add", key, target], value);
    console.log(`${added.status === 0 ? "set " : "FAILED"} ${key} (${target})${added.status === 0 ? "" : `: ${added.stderr.trim()}`}`);
  }
}
