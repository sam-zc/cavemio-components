import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import { catalogSchema, metadataSchema } from "../lib/catalog.ts";
import { verifyInstallableSource } from "../lib/install-contract.ts";
const read = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const registry = registrySchema.parse(await read("registry.json"));
assert.equal(
  await readFile("public/previews/command-palette-demo.tsx.txt", "utf8"),
  await readFile("preview/command-palette-demo.tsx", "utf8"),
  "Stale native Command Palette demo source",
);
assert.deepEqual(
  await read("public/r/registry.json"),
  await read("registry.json"),
);
const catalog = catalogSchema.parse(await read("public/catalog.json"));
const native = await read("public/previews/native.json");
assert.equal(native.version, 1);
assert.deepEqual(
  native.entries.map((entry: { component: string; sourceSha256: string }) => [
    entry.component,
    entry.sourceSha256,
  ]),
  catalog.items.map((entry) => [entry.component, entry.sourceSha256]),
);
for (const file of native.files) {
  assert.equal(file.content, await readFile(file.path, "utf8"));
  assert.equal(
    file.sha256,
    createHash("sha256").update(file.content).digest("hex"),
  );
}
for (const entry of native.entries)
  assert.ok(
    native.files.some((file: { path: string }) => file.path === entry.entry),
  );
for (const asset of native.assets)
  assert.equal(
    asset.sha256,
    createHash("sha256")
      .update(await readFile(`public/${asset.path}`))
      .digest("hex"),
  );
assert.equal(
  new Set(catalog.items.map((i) => i.name)).size,
  registry.items.length,
);
assert.equal(
  new Set(catalog.items.map((i) => i.component)).size,
  registry.items.length,
);
assert.equal(catalog.items.length, registry.items.length);
for (const definition of registry.items) {
  const built = registryItemSchema.parse(
    await read(`public/r/${definition.name}.json`),
  );
  await verifyInstallableSource(built);
  const entry = catalog.items.find((i) => i.name === definition.name);
  assert.ok(entry);
  const { files, ...metadata } = built;
  const { files: sourceFiles, ...expectedMetadata } = definition;
  // Official build may add its item $schema.
  delete metadata.$schema;
  delete expectedMetadata.$schema;
  assert.deepEqual(metadata, expectedMetadata);
  assert.deepEqual(
    metadataSchema.parse(built.meta?.cavemio),
    metadataSchema.parse(entry),
  );
  assert.deepEqual(entry.dependencies, built.dependencies ?? []);
  assert.deepEqual(
    entry.registryDependencies,
    built.registryDependencies ?? [],
  );
  assert.equal(files?.length, sourceFiles?.length);
  for (const file of files ?? []) {
    assert.equal(
      file.content,
      await readFile(file.path, "utf8"),
      `Stale artifact: ${file.path}`,
    );
    assert.equal(file.type, "registry:component");
    assert.equal(
      file.target,
      undefined,
      "Use consumer aliases.components, not a forced target",
    );
  }
  const hash = createHash("sha256").update(files![0].content!).digest("hex");
  assert.equal(entry.sourceSha256, hash);
  assert.ok(
    (await readFile(`public/previews/${entry.name}.html`, "utf8")).includes(
      hash,
    ),
  );
}
console.log(
  `Validated schemas, isolated source imports, contents, metadata and preview hashes for ${catalog.items.length} items.`,
);
