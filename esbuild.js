import esbuild from "esbuild";

// See https://github.com/evanw/esbuild/issues/1921
const commonJsPloyfil = `
globalThis.require = (await import("module")).createRequire(import.meta.url);
globalThis.__filename = (await import("url")).fileURLToPath(import.meta.url);
globalThis.__dirname = (await import("path")).dirname(__filename);
`;

await esbuild.build({
  entryPoints: process.argv.slice(2),
  define: { "process.env.BUNDLE": "true" },
  format: "esm",
  sourcemap: "inline",
  platform: "node",
  // minify: true,
  bundle: true,
  banner: { js: commonJsPloyfil },
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
});
