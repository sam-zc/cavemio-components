import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("public");
const types: Record<string, string> = {
  ".json": "application/json",
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
};
const port = Number(process.env.PORT ?? 4001);
createServer(async (request, response) => {
  try {
    const path = resolve(
      root,
      "." +
        decodeURIComponent(
          new URL(request.url ?? "/", "http://localhost").pathname,
        ),
    );
    if (!path.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const data = await readFile(path);
    response
      .writeHead(200, {
        "Content-Type": types[extname(path)] ?? "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      })
      .end(data);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Registry: http://localhost:${port}/r/registry.json`),
);
