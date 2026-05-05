import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import assert from "node:assert/strict";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import { metadataSchema } from "../lib/catalog.ts";
import { installExamples } from "./install-examples.ts";
import { verifyInstallableSource } from "../lib/install-contract.ts";

const { values } = parseArgs({
  options: {
    item: { type: "string" },
    installer: { type: "string", default: "namespace" },
    combined: { type: "boolean", default: false },
    list: { type: "boolean", default: false },
  },
});
assert.ok(
  ["both", "official", "namespace"].includes(values.installer),
  "--installer must be official, namespace, or both",
);
assert.ok(
  !(values.item && values.combined),
  "Choose --item or --combined, not both",
);
const source = registrySchema.parse(
  JSON.parse(await readFile("registry.json", "utf8")),
);
const definitions = source.items.map((item) => ({
  ...item,
  details: metadataSchema.parse(item.meta?.cavemio),
}));
for (const item of definitions) {
  assert.ok(
    installExamples[item.details.component],
    `Missing installed usage example for ${item.name}`,
  );
  assert.ok(item.files?.length, `Missing files for ${item.name}`);
}
if (values.item)
  assert.ok(
    definitions.some((item) => item.details.component === values.item),
    `Unknown item: ${values.item}`,
  );
const groups = values.item
  ? [definitions.filter((item) => item.details.component === values.item)]
  : values.combined
    ? [definitions]
    : [...definitions.map((item) => [item]), definitions];
const installers =
  values.installer === "both" ? ["official", "namespace"] : [values.installer];
const cases = installers.flatMap((installer) =>
  groups.map((items) => ({
    installer,
    items,
    label: `${installer}/${items.length === 1 ? items[0].details.component : "combined"}`,
  })),
);
if (values.list) {
  console.log(cases.map((entry) => entry.label).join("\n"));
  process.exit(0);
}
const npm = process.env.npm_execpath;
if (!npm?.endsWith("npm-cli.js"))
  throw new Error(
    "Run npm run verify:install; consumers intentionally use npm.",
  );
const registryValue =
  process.env.CAVEMIO_REGISTRY_URL ?? "http://127.0.0.1:4001/";
const registry = registryValue.endsWith("/")
  ? registryValue
  : `${registryValue}/`;
const official = fileURLToPath(import.meta.resolve("shadcn"));
// Fail before creating consumers when the registry is unavailable.
const response = await fetch(new URL("catalog.json", registry), {
  signal: AbortSignal.timeout(5000),
});
assert.ok(response.ok, `Registry unavailable: ${response.status}`);
// Prove every selected HTTP item closes over its own source before npm runs.
// This catches omitted helpers even when the workspace already contains them.
for (const item of new Map(
  cases.flatMap((entry) => entry.items).map((item) => [item.name, item]),
).values()) {
  const result = await fetch(new URL(`r/${item.name}.json`, registry), {
    signal: AbortSignal.timeout(5000),
  });
  assert.ok(result.ok, `${item.name}: registry returned ${result.status}`);
  const built = registryItemSchema.parse(await result.json());
  assert.equal(built.name, item.name);
  await verifyInstallableSource(built);
  const keyframes = Object.keys(built.css ?? {});
  for (const animation of installExamples[item.details.component].animations) {
    assert.ok(
      keyframes.includes(`@keyframes ${animation}`),
      `${item.name}: missing declared animation ${animation}`,
    );
  }
}

async function run(cwd: string, args: string[], phase: string) {
  await new Promise<void>((done, reject) => {
    const child = spawn(process.execPath, args, {
      cwd,
      stdio: "inherit",
      shell: false,
    });
    let timedOut = false;
    let forceKill: ReturnType<typeof setTimeout> | undefined;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
    }, 120000);
    child.once("error", (error) => {
      clearTimeout(timeout);
      clearTimeout(forceKill);
      reject(error);
    });
    child.once("close", (code, signal) => {
      clearTimeout(timeout);
      clearTimeout(forceKill);
      if (timedOut)
        reject(
          new Error(
            `${phase}: timed out after 120s (npm/shadcn downloads may be unavailable)`,
          ),
        );
      else if (code !== 0)
        reject(new Error(`${phase}: exited ${code ?? signal}`));
      else done();
    });
  });
}

const root = await mkdtemp(join(tmpdir(), "cavemio-consumers-"));
try {
  for (const { installer, items, label } of cases) {
    console.log(`VERIFY ${label}: fresh consumer`);
    const cwd = join(root, `${label.replace("/", "-")} consumer with spaces`);
    await mkdir(join(cwd, "src", "nested"), { recursive: true });
    const write = (name: string, value: unknown) =>
      writeFile(
        join(cwd, name),
        typeof value === "string" ? value : JSON.stringify(value, null, 2),
      );
    await write("package.json", {
      name: "cavemio-test-consumer",
      version: "0.0.0",
      private: true,
      type: "module",
      scripts: { build: "tsc --noEmit && vite build" },
      dependencies: { react: "19.3.0", "react-dom": "19.3.0" },
      devDependencies: {
        typescript: "5.9.3",
        "@types/react": "19.3.0",
        "@types/react-dom": "19.3.0",
        vite: "8.3.4",
        tailwindcss: "4.3.3",
        "@tailwindcss/vite": "4.3.3",
      },
    });
    await write("tsconfig.json", {
      compilerOptions: {
        target: "ES2022",
        lib: ["DOM", "ES2022"],
        strict: true,
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "Bundler",
        skipLibCheck: true,
        noEmit: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src"],
    });
    const config = {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "new-york",
      rsc: false,
      tsx: true,
      tailwind: {
        config: "",
        css: "src/index.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      registries: {
        "@cavemio": new URL("r/cavemio-{name}.json", registry).href.replace(
          "%7Bname%7D",
          "{name}",
        ),
      },
      aliases: {
        components: "@/custom/compositions",
        ui: "@/custom/primitives",
        utils: "@/lib/utils",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    };
    await write("components.json", config);
    const originalConfig = await readFile(join(cwd, "components.json"), "utf8");
    await write(
      "index.html",
      '<html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    );
    await write("src/index.css", '@import "tailwindcss";');
    await write(
      "vite.config.ts",
      'import {defineConfig} from "vite"; import tailwind from "@tailwindcss/vite"; import {fileURLToPath} from "node:url"; export default defineConfig({plugins:[tailwind()],build:{rolldownOptions:{onwarn(warning,defaultHandler){if(warning.code!=="MODULE_LEVEL_DIRECTIVE")defaultHandler(warning);}}},resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}}});',
    );
    await run(
      cwd,
      [npm, "install", "--no-audit", "--no-fund"],
      `${label}: install consumer dependencies`,
    );
    const existingPath = join(cwd, "src/custom/primitives/consumer-note.ts");
    const existingSource =
      "export const consumerNote = 'Keep my local files';\n";
    await mkdir(join(cwd, "src/custom/primitives"), { recursive: true });
    await writeFile(existingPath, existingSource);

    // Each isolated case starts with no component source, helpers, or registry CSS.
    assert.equal(
      await readFile(join(cwd, "src/index.css"), "utf8"),
      '@import "tailwindcss";',
    );
    for (const item of items) {
      await run(
        join(cwd, "src", "nested"),
        [
          official,
          "add",
          installer === "namespace"
            ? `@cavemio/${item.name.replace(/^cavemio-/, "")}`
            : new URL(`r/${item.name}.json`, registry).href,
          "--cwd",
          cwd,
          "--yes",
        ],
        `${label}: install ${item.name}`,
      );
    }
    const expectedFiles = [
      ...new Set(
        items.flatMap((item) => item.files!.map((file) => basename(file.path))),
      ),
    ].sort();
    assert.deepEqual(
      (await readdir(join(cwd, "src/custom/compositions"))).sort(),
      expectedFiles,
      `${label}: installed helper/source files`,
    );
    assert.equal(
      await readFile(existingPath, "utf8"),
      existingSource,
      `${label}: existing file changed`,
    );
    assert.equal(
      await readFile(join(cwd, "components.json"), "utf8"),
      originalConfig,
      `${label}: aliases/config changed`,
    );
    const pkg = JSON.parse(await readFile(join(cwd, "package.json"), "utf8"));
    const css = await readFile(join(cwd, "src/index.css"), "utf8");
    for (const item of items) {
      for (const animation of installExamples[item.details.component]
        .animations) {
        assert.ok(
          css.includes(`@keyframes ${animation}`),
          `${label}: missing required animation ${animation}`,
        );
      }
      for (const dependency of item.dependencies ?? []) {
        const name = dependency.startsWith("@")
          ? dependency.split("@").slice(0, 2).join("@")
          : dependency.split("@")[0];
        assert.ok(
          pkg.dependencies[name],
          `${label}: missing dependency ${name}`,
        );
      }
      for (const rule of Object.keys(item.css ?? {})) {
        if (rule.startsWith("@keyframes "))
          assert.ok(css.includes(rule), `${label}: missing ${rule}`);
        if (rule.startsWith("@utility "))
          assert.ok(css.includes(rule.slice(9)), `${label}: missing ${rule}`);
      }
    }
    const importLines: string[] = [];
    const renderLines: string[] = [];
    for (const [index, item] of items.entries()) {
      const example = installExamples[item.details.component];
      if (example.source) {
        await mkdir(join(cwd, "src/examples"), { recursive: true });
        await write(
          `src/examples/${item.details.component}.tsx`,
          example.source,
        );
        importLines.push(
          `import { Demo as InstalledExample${index} } from "./examples/${item.details.component}";`,
        );
        renderLines.push(`<InstalledExample${index} />`);
      } else {
        importLines.push(
          `import { ${item.details.exportName} } from "./custom/compositions/${basename(item.files![0].path).replace(/\.tsx?$/, "")}";`,
        );
        renderLines.push(example.render!);
      }
    }
    const imports = importLines.join("\n");
    const usages = renderLines.join("\n");
    await write(
      "src/main.tsx",
      `import {createRoot} from "react-dom/client";\n${imports}\nimport "./index.css";\ncreateRoot(document.getElementById("root")!).render(<>${usages}</>);`,
    );
    await run(cwd, [npm, "run", "build"], `${label}: compile installed usage`);
    console.log(
      `PASS ${label}: source/helpers/CSS/dependencies, aliases, preservation, TypeScript and production build`,
    );
    await rm(cwd, { recursive: true, force: true });
  }
} finally {
  await rm(root, { recursive: true, force: true });
  console.log("Removed owned temporary consumers:", root);
}
