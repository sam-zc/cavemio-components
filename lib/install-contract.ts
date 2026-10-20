import { posix } from "node:path";
import { build } from "esbuild";

type SourceItem = {
  name: string;
  files?: { path: string; content?: string }[];
  dependencies?: string[];
};

/** Compile only the files an item ships, without resolving sibling source or
 * workspace node_modules. This proves source closure, not an npm installation. */
export async function verifyInstallableSource(item: SourceItem) {
  const files = new Map(
    (item.files ?? []).map((file) => [
      posix.normalize(file.path),
      file.content,
    ]),
  );
  const entry = item.files?.[0]?.path;
  if (!entry || !files.get(entry)) {
    throw new Error(`${item.name}: missing primary source content`);
  }
  const dependencies = new Set([
    "react",
    "react-dom",
    ...(item.dependencies ?? []).map((name) =>
      name.startsWith("@")
        ? name.split("@").slice(0, 2).join("@")
        : name.split("@")[0],
    ),
  ]);
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "esm",
    jsx: "automatic",
    logLevel: "silent",
    plugins: [
      {
        name: "installed-source-only",
        setup(builder) {
          builder.onResolve({ filter: /.*/ }, (args) => {
            if (args.kind === "entry-point" || args.path.startsWith(".")) {
              const target =
                args.kind === "entry-point"
                  ? posix.normalize(args.path)
                  : posix.normalize(
                      posix.join(posix.dirname(args.importer), args.path),
                    );
              const resolved = [
                target,
                `${target}.tsx`,
                `${target}.ts`,
                `${target}.jsx`,
                `${target}.js`,
                `${target}/index.tsx`,
                `${target}/index.ts`,
              ].find((candidate) => files.has(candidate));
              if (!resolved)
                throw new Error(
                  `${item.name}: missing bundled helper ${args.path} imported by ${args.importer}`,
                );
              return { path: resolved, namespace: "installed" };
            }
            const packageName = args.path.startsWith("@")
              ? args.path.split("/").slice(0, 2).join("/")
              : args.path.split("/")[0];
            if (!dependencies.has(packageName)) {
              throw new Error(
                `${item.name}: undeclared installed dependency ${args.path}`,
              );
            }
            return { path: args.path, external: true };
          });
          builder.onLoad({ filter: /.*/, namespace: "installed" }, (args) => {
            const contents = files.get(args.path);
            if (contents === undefined)
              throw new Error(`${item.name}: missing content for ${args.path}`);
            return {
              contents,
              loader: /\.[jt]sx$/.test(args.path) ? "tsx" : "ts",
            };
          });
        },
      },
    ],
  });
}
