import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  copyFile,
  access,
} from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import { catalogSchema, metadataSchema } from "../lib/catalog.ts";
import ts from "typescript";

const registry = registrySchema.parse(
  JSON.parse(await readFile("registry.json", "utf8")),
);
await mkdir("public/previews", { recursive: true });
await mkdir("public/fonts", { recursive: true });
// A build-time source fixture for the website's native, page-wide demo.
// Kept separate from the installable component and sandbox preview bundles.
await copyFile(
  "preview/command-palette-demo.tsx",
  "public/previews/command-palette-demo.tsx.txt",
);
const fontPackage = "node_modules/@fontsource-variable/geist";
for (const style of ["normal", "italic"]) {
  const filename = `geist-latin-wght-${style}.woff2`;
  await copyFile(
    `${fontPackage}/files/${filename}`,
    `public/fonts/${filename}`,
  );
}
await writeFile("public/fonts/Geist-LICENSE.txt", "");
await copyFile(
  "preview/assets/inter-display-regular.woff2",
  "public/fonts/inter-display-regular.woff2",
);
for (const [pkg, file, license] of [
  [
    "@fontsource-variable/inter",
    "inter-latin-wght-normal.woff2",
    "Inter-LICENSE.txt",
  ],
  [
    "@fontsource/instrument-serif",
    "instrument-serif-latin-400-italic.woff2",
    "Instrument-Serif-LICENSE.txt",
  ],
]) {
  await copyFile(`node_modules/${pkg}/files/${file}`, `public/fonts/${file}`);
  await writeFile(`public/fonts/${license}`, "");
}
execFileSync(
  process.execPath,
  [
    "node_modules/@tailwindcss/cli/dist/index.mjs",
    "-i",
    "scripts/preview.css",
    "-o",
    "public/previews/styles.css",
    "--minify",
  ],
  { stdio: "inherit" },
);
const previewCssPath = "public/previews/styles.css";
await writeFile(
  previewCssPath,
  (await readFile(previewCssPath, "utf8")).replace(/\/\*![\s\S]*?\*\//g, ""),
);
const items = [];
const nativeSourcePaths = new Set<string>();
const nativeEntries: {
  component: string;
  entry: string;
  sourceSha256: string;
}[] = [];
for (const definition of registry.items) {
  const item = registryItemSchema.parse(
    JSON.parse(await readFile(`public/r/${definition.name}.json`, "utf8")),
  );
  const meta = metadataSchema.parse(item.meta?.cavemio);
  const file = item.files?.[0];
  if (!file?.content) throw new Error(`Missing built source: ${item.name}`);
  const sourceSha256 = createHash("sha256").update(file.content).digest("hex");
  // The preview imports the same canonical file that shadcn embedded above.
  const previewBuild = await build({
    metafile: true,
    stdin: {
      contents: `import "./preview/theme-bridge"; import {createRoot} from "react-dom/client"; import {Demo} from "./preview/entries/${meta.component}"; createRoot(document.getElementById("root")).render(<Demo />);`,
      resolveDir: process.cwd(),
      loader: "tsx",
    },
    bundle: true,
    minify: true,
    format: meta.component === "video-player" ? "esm" : "iife",
    splitting: meta.component === "video-player",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    ...(meta.component === "video-player"
      ? {
          outdir: "public/previews",
          entryNames: item.name,
          chunkNames: `${item.name}-[name]-[hash]`,
        }
      : { outfile: `public/previews/${item.name}.js` }),
    legalComments: meta.component === "video-player" ? "external" : "none",
  });
  nativeEntries.push({
    component: meta.component,
    entry: `preview/entries/${meta.component}.tsx`,
    sourceSha256,
  });
  for (const input of Object.keys(previewBuild.metafile.inputs)) {
    if (/^(preview|registry\/components)\/.*\.tsx?$/.test(input))
      nativeSourcePaths.add(input);
  }
  // Keep existing distribution paths while omitting extracted comment text.
  if (meta.component !== "video-player")
    await writeFile(`public/previews/${item.name}.js.LEGAL.txt`, "");
  await writeFile(
    `public/previews/${item.name}.html`,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="cavemio-source-sha256" content="${sourceSha256}"><title>${item.title}</title><link rel="stylesheet" href="./styles.css"></head><body><main id="root"></main><script ${meta.component === "video-player" ? 'type="module"' : "defer"} src="./${item.name}.js"></script></body></html>`,
  );
  items.push({
    ...meta,
    name: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    item: `./r/${item.name}.json`,
    preview: `./previews/${item.name}.html`,
    sourceSha256,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
  });
}
await writeFile(
  "public/catalog.json",
  JSON.stringify(catalogSchema.parse({ version: 2, items }), null, 2) + "\n",
);
const notices = await readFile("preview/video-player-notices.txt", "utf8");
await writeFile("public/previews/THIRD_PARTY_NOTICES.txt", notices);
// Build-time source installation for native website previews; never runtime TSX.
const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const nativeDependencies: Record<string, string> = {};
// Bundler metafiles omit type-only modules. Native installed source must also
// close over those imports so downstream TypeScript consumers can compile it.
for (const path of nativeSourcePaths) {
  for (const imported of ts.preProcessFile(await readFile(path, "utf8"))
    .importedFiles) {
    if (!imported.fileName.startsWith(".")) continue;
    const base = resolve(dirname(path), imported.fileName);
    for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
      const candidate = relative(process.cwd(), base + suffix).replaceAll(
        "\\",
        "/",
      );
      if (!/^(preview|registry\/components)\/.*\.tsx?$/.test(candidate))
        continue;
      try {
        await access(candidate);
        nativeSourcePaths.add(candidate);
        break;
      } catch {
        /* Try the next source extension. */
      }
    }
  }
}
const nativeFiles = await Promise.all(
  [...nativeSourcePaths].sort().map(async (path) => {
    const content = await readFile(path, "utf8");
    for (const imported of ts.preProcessFile(content).importedFiles) {
      if (imported.fileName.startsWith(".")) continue;
      const name = imported.fileName.startsWith("@")
        ? imported.fileName.split("/").slice(0, 2).join("/")
        : imported.fileName.split("/")[0];
      if (["react", "react-dom"].includes(name)) continue;
      const version =
        packageJson.dependencies[name] ?? packageJson.devDependencies[name];
      if (!version)
        throw new Error(`Undeclared native preview dependency ${name}`);
      nativeDependencies[name] = version;
    }
    return {
      path,
      content,
      sha256: createHash("sha256").update(content).digest("hex"),
    };
  }),
);
const nativeAssets = [];
for (const directory of ["fonts", "lifecycle"]) {
  for (const filename of (await readdir(`public/${directory}`)).sort()) {
    const path = `${directory}/${filename}`;
    nativeAssets.push({
      path,
      sha256: createHash("sha256")
        .update(await readFile(`public/${path}`))
        .digest("hex"),
    });
  }
}
const nativeStyles = (await readFile("preview/styles.css", "utf8"))
  .replace(
    '@import "./theme.css";',
    await readFile("preview/theme.css", "utf8"),
  )
  .replace(/^@(?:import|source)[^\n]*\n/gm, "")
  .replaceAll(",\n.cavemio-command-palette", "")
  .replace(
    /\/\* The palette portals[\s\S]*?\.cavemio-command-palette \{[\s\S]*?\}\n/,
    "",
  )
  .replace(/^body \{/m, ".native-component-preview {")
  .replaceAll("/fonts/", "/registry-previews/fonts/");
await writeFile(
  "public/previews/native.json",
  JSON.stringify(
    {
      version: 1,
      entries: nativeEntries,
      files: nativeFiles,
      dependencies: nativeDependencies,
      styles: nativeStyles,
      themeCss: await readFile("preview/theme.css", "utf8"),
      assets: nativeAssets,
      notices,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Built ${items.length} registry previews.`);
