import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { verifyInstallableSource } from "./install-contract.ts";

const fixture = {
  name: "fixture",
  dependencies: ["@example/icons@1.0.0"],
  files: [
    {
      path: "registry/answer.tsx",
      content:
        'import { value } from "./helper"; import { Icon } from "@example/icons/arrow"; export const Answer = () => <Icon>{value}</Icon>;',
    },
    { path: "registry/helper.ts", content: 'export const value = "answer";' },
  ],
};

test("an item closes over its shipped helpers and declared package subpaths", async () => {
  await verifyInstallableSource(fixture);
});

test("an omitted helper fails even when it exists in the workspace", async () => {
  const content = await readFile(
    "registry/components/response-versions.tsx",
    "utf8",
  );
  await assert.rejects(
    verifyInstallableSource({
      name: "response-with-missing-helper",
      dependencies: ["lucide-react"],
      files: [{ path: "registry/components/response-versions.tsx", content }],
    }),
    /missing bundled helper.*number-roll/,
  );
});

test("workspace packages cannot mask undeclared consumer dependencies", async () => {
  await assert.rejects(
    verifyInstallableSource({ ...fixture, dependencies: [] }),
    /undeclared installed dependency @example\/icons\/arrow/,
  );
});

test("demo imports cannot escape the shipped item", async () => {
  await assert.rejects(
    verifyInstallableSource({
      name: "leaking-fixture",
      files: [
        {
          path: "registry/example.ts",
          content: 'export { example } from "../preview/demo";',
        },
      ],
    }),
    /missing bundled helper.*preview\/demo/,
  );
});
