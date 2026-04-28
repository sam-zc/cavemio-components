import { z } from "zod";

export const metadataSchema = z.object({
  component: z.string().regex(/^[a-z][a-z0-9-]*$/),
  categories: z.array(z.string().regex(/^[a-z][a-z0-9-]*$/)).default([]),
  exportName: z.string().regex(/^[A-Z][A-Za-z0-9]*$/),
  usage: z.string(),
  accessibility: z.string(),
  previewNote: z.string(),
  documentation: z
    .object({
      useCases: z.array(
        z.object({ title: z.string(), description: z.string() }),
      ),
      features: z.array(
        z.object({ title: z.string(), description: z.string() }),
      ),
      states: z.array(z.object({ title: z.string(), description: z.string() })),
      props: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          description: z.string(),
        }),
      ),
    })
    .optional(),
});
export const catalogSchema = z.object({
  version: z.literal(2),
  items: z
    .array(
      metadataSchema.extend({
        name: z.string().regex(/^[a-z][a-z0-9-]*$/),
        title: z.string(),
        description: z.string(),
        item: z.string().regex(/^\.\/r\/[a-z0-9-]+\.json$/),
        preview: z.string().regex(/^\.\/previews\/[a-z0-9-]+\.html$/),
        sourceSha256: z.string().regex(/^[a-f0-9]{64}$/),
        dependencies: z.array(z.string()),
        registryDependencies: z.array(z.string()),
      }),
    )
    .min(1)
    .refine(
      (items) =>
        new Set(items.map((item) => item.component)).size === items.length,
      "Each component must have exactly one catalog entry",
    ),
});
