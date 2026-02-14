#!/usr/bin/env node

import statsCard from "./api/index.js";
import repoCard from "./api/pin.js";
import langCard from "./api/top-langs.js";
import wakatimeCard from "./api/wakatime.js";
import gistCard from "./api/gist.js";

import path from "path";
import { promises as fs } from "fs";
import { createRequest, createResponse } from "node-mocks-http";

/** @type Record<string, (req, res) => Promise<void>> **/
const routes = {
  "/": statsCard,
  "/pin": repoCard,
  "/top-langs": langCard,
  "/wakatime": wakatimeCard,
  "/gist": gistCard,
};

for (const input of process.argv.slice(2)) {
  console.log(`build card for '${input}'`);
  const json = await fs.readFile(input, { encoding: "utf8" });
  const data = JSON.parse(json);

  const router = routes[data.url];
  if (router === undefined) {
    throw new Error(`unknown route '${data.url}'`);
  }

  const query = data.query || {};
  for (const k in query) {
    query[k] = String(query[k]);
  }

  const req = createRequest({
    method: "GET",
    url: data.url,
    query: data.query,
  });
  const res = createResponse();
  await router(req, res);

  const svg = res._getData();
  if (data.outfile) {
    await fs.mkdir(path.dirname(data.outfile), { recursive: true });
    await fs.writeFile(data.outfile, svg);
  } else {
    process.stdout.write(svg);
  }
}
