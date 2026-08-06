"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/prompt-composer";
import * as dependency4 from "../../../registry/components/mode-switcher";
import * as dependency5 from "../../../registry/components/attachment-chip";
("use strict");
var t = dependency0;
var r = dependency1;
var a = dependency2;
var s = dependency2;
var i = dependency2;
var n = dependency3;
var o = dependency4;
var l = dependency5;
let d = [
  { value: "fast", label: "Fast", icon: (0, t.jsx)(i.Zap, {}) },
  { value: "thinking", label: "Thinking", icon: (0, t.jsx)(a.Brain, {}) },
  {
    value: "research",
    label: "Research",
    icon: (0, t.jsx)(s.Telescope, {}),
    locked: !0,
  },
];
export default (function ({ tab: e = "Live" }) {
  let [a, s] = (0, r.useState)("ready"),
    [i, c] = (0, r.useState)(null),
    u = (0, r.useRef)([]),
    [p, m] = (0, r.useState)(
      "With files" === e
        ? [
            {
              id: 1,
              name: "q3-flavor-sales.pdf",
              size: 24e5,
              type: "application/pdf",
              status: "uploading",
              progress: 0,
            },
            {
              id: 2,
              name: "shop-front.webp",
              size: 82e4,
              type: "image/webp",
              status: "ready",
              progress: 1,
              previewUrl: "/demos/cavemio/previews/card/stillform.webp",
            },
          ]
        : [],
    );
  return (
    (0, r.useEffect)(
      () => () => u.current.forEach((e) => window.clearTimeout(e)),
      [],
    ),
    (0, r.useEffect)(() => {
      if (!p.some((e) => "uploading" === e.status || "processing" === e.status))
        return;
      let e = window.setTimeout(
        () => {
          m((e) =>
            e.map((e) =>
              "uploading" === e.status
                ? e.progress >= 1
                  ? { ...e, status: "processing" }
                  : { ...e, progress: Math.min(1, e.progress + 0.12) }
                : "processing" === e.status
                  ? { ...e, status: "ready" }
                  : e,
            ),
          );
        },
        p.some((e) => "processing" === e.status) ? 1100 : 160,
      );
      return () => window.clearTimeout(e);
    }, [p]),
    (0, t.jsxs)("div", {
      className: "flex w-full max-w-[520px] flex-col gap-3",
      children: [
        (0, t.jsx)("p", {
          className:
            "h-5 truncate text-center text-[12.5px] text-muted-foreground",
          children: i
            ? (0, t.jsxs)("span", {
                className: "animate-[ui-fade-in_250ms_ease-out_both]",
                children: [
                  "ready" === a
                    ? "Answered"
                    : "submitted" === a
                      ? "Sending"
                      : "Answering",
                  " · “",
                  i,
                  "”",
                ],
              })
            : "Type something and press Enter",
        }),
        (0, t.jsx)(n.PromptComposer, {
          defaultValue:
            "Live" === e ? "Plan a peach special for this weekend" : "",
          status: a,
          onSubmit: (e) => {
            (c(e || "Attached files"),
              m([]),
              s("submitted"),
              u.current.push(window.setTimeout(() => s("streaming"), 700)),
              u.current.push(window.setTimeout(() => s("ready"), 3600)));
          },
          onStop: () => {
            (u.current.forEach((e) => window.clearTimeout(e)), s("ready"));
          },
          disabled: "Rate limited" === e,
          disabledReason:
            "Rate limited" === e
              ? "You’ve used today’s 50 messages. They reset at midnight."
              : void 0,
          onFilesSelected: (e) =>
            m((t) => [
              ...t,
              ...e.map((e, t) => ({
                id: Date.now() + t,
                name: e.name,
                size: e.size,
                type: e.type,
                status: "uploading",
                progress: 0,
                previewUrl: e.type.startsWith("image/")
                  ? URL.createObjectURL(e)
                  : void 0,
              })),
            ]),
          allowEmpty: p.length > 0,
          maxLength: 2e3,
          attachments:
            p.length > 0 &&
            p.map((e) =>
              (0, t.jsx)(
                l.AttachmentChip,
                {
                  name: e.name,
                  size: e.size,
                  type: e.type,
                  status: e.status,
                  progress: e.progress,
                  previewUrl: e.previewUrl,
                  onRemove: () => m((t) => t.filter((t) => t.id !== e.id)),
                },
                e.id,
              ),
            ),
          toolbar: (0, t.jsx)(o.ModeSwitcher, {
            modes: d,
            defaultValue: "fast",
          }),
        }),
      ],
    })
  );
});
