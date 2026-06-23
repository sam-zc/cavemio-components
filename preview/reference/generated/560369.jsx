"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/attachment-chip";
("use strict");
var t = dependency0;
var i = dependency1;
var r = dependency2;
export default (function ({ tab: e = "Live" }) {
  let [s, a] = (0, i.useState)(
      "Error" === e ? "error" : "Image" === e ? "ready" : "uploading",
    ),
    [n, o] = (0, i.useState)(0),
    [l, d] = (0, i.useState)(0),
    [c, u] = (0, i.useState)(!1);
  return ((0, i.useEffect)(() => {
    if ("Live" !== e) return;
    (a("uploading"), o(0));
    let t = Array.from({ length: 10 }, (e, t) =>
      window.setTimeout(() => o((t + 1) / 10), 250 * (t + 1)),
    );
    return (
      t.push(window.setTimeout(() => a("processing"), 2800)),
      t.push(window.setTimeout(() => a("ready"), 4400)),
      () => t.forEach((e) => window.clearTimeout(e))
    );
  }, [e, l]),
  c)
    ? (0, t.jsx)("button", {
        type: "button",
        onClick: () => u(!1),
        className:
          "cursor-pointer text-[12.5px] text-muted-foreground underline underline-offset-4",
        children: "Removed. Bring it back",
      })
    : "Image" === e
      ? (0, t.jsxs)("div", {
          className: "flex flex-wrap justify-center gap-2",
          children: [
            (0, t.jsx)(r.AttachmentChip, {
              name: "shop-front.webp",
              type: "image/webp",
              size: 82e4,
              previewUrl: "/demos/cavemio/previews/card/stillform.webp",
              onRemove: () => u(!0),
            }),
            (0, t.jsx)(r.AttachmentChip, {
              name: "menu-board.webp",
              type: "image/webp",
              size: 64e4,
              previewUrl: "/demos/cavemio/previews/card/kept.webp",
              status: "processing",
            }),
          ],
        })
      : (0, t.jsx)(r.AttachmentChip, {
          name: "q3-flavor-sales.pdf",
          type: "application/pdf",
          size: 24e5,
          status: s,
          progress: n,
          error: "File is over 20 MB",
          onRetry: () => d((e) => e + 1),
          onRemove: () => u(!0),
        });
});
