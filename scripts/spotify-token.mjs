#!/usr/bin/env node
/* Gets a Spotify refresh token for the site's Spotify section and writes it to
   .env as SPOTIFY_REFRESH_TOKEN.

   Prerequisites:
   - SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env (or in the environment)
   - http://127.0.0.1:8888/callback added under Redirect URIs in the app's
     settings at https://developer.spotify.com/dashboard

   Usage: node scripts/spotify-token.mjs */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { exec } from "node:child_process";

const ENV_FILE = new URL("../.env", import.meta.url);
const REDIRECT = "http://127.0.0.1:8888/callback";
const SCOPES = "user-read-currently-playing user-read-recently-played user-top-read";

const env = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
const fromFile = (key) => env.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
const id = process.env.SPOTIFY_CLIENT_ID || fromFile("SPOTIFY_CLIENT_ID");
const secret = process.env.SPOTIFY_CLIENT_SECRET || fromFile("SPOTIFY_CLIENT_SECRET");
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.");
  process.exit(1);
}

const state = randomBytes(12).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ response_type: "code", client_id: id, scope: SCOPES, redirect_uri: REDIRECT, state });

function saveToken(token) {
  const line = `SPOTIFY_REFRESH_TOKEN=${token}`;
  const next = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(env)
    ? env.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line)
    : `${env.replace(/\n?$/, "\n")}${line}\n`;
  writeFileSync(ENV_FILE, next);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  const finish = (status, message) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end(message);
    console.log(message);
    server.close();
    process.exitCode = status === 200 ? 0 : 1;
  };

  if (url.searchParams.get("state") !== state) return finish(400, "State mismatch; run the script again.");
  const code = url.searchParams.get("code");
  if (!code) return finish(400, `Spotify refused: ${url.searchParams.get("error") ?? "no code"}`);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
  });
  const data = await tokenRes.json();
  if (!tokenRes.ok || !data.refresh_token) return finish(500, `Token exchange failed: ${JSON.stringify(data)}`);

  // Prove the token works before saving it.
  const check = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  if (!check.ok) return finish(500, `Token works for login but not the API (${check.status}).`);

  saveToken(data.refresh_token);
  finish(200, "Saved SPOTIFY_REFRESH_TOKEN to .env. You can close this tab.");
});

server.listen(8888, "127.0.0.1", () => {
  console.log(`Open this URL if a browser does not open by itself:\n${authUrl}\n`);
  const opener = process.platform === "win32" ? `start "" "${authUrl}"` : process.platform === "darwin" ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(opener);
});
