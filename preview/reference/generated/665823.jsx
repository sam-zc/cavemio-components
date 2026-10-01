"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency8 from "../../../registry/components/csv-import";
import * as dependency9 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
function C(props) {
  return dependency1.createElement(dependency8.CsvImport, props);
}
var L = dependency9;
let E = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let M = ["Free", "Starter", "Pro", "Team"];
let D = [
  { key: "name", label: "Name", required: !0, match: ["full name", "contact"] },
  {
    key: "email",
    label: "Email",
    required: !0,
    match: ["e-mail", "email address"],
    validate: (e) => (E.test(e) ? null : `“${e}” isn’t an email address.`),
  },
  {
    key: "company",
    label: "Company",
    match: ["organisation", "organization", "account"],
  },
  {
    key: "plan",
    label: "Plan",
    match: ["tier"],
    validate: (e) =>
      M.some((t) => t.toLowerCase() === e.toLowerCase())
        ? null
        : `Use ${M.slice(0, -1).join(", ")} or ${M.at(-1)}.`,
  },
  {
    key: "phone",
    label: "Phone",
    validate: (e) =>
      /^[+\d][\d\s()-]{6,}$/.test(e)
        ? null
        : "That doesn’t look like a phone number.",
  },
];
let T = [
  "Maya",
  "Leo",
  "Ana",
  "Sam",
  "Priya",
  "Tom",
  "Jo",
  "Kai",
  "Noor",
  "Ines",
  "Theo",
  "Aiko",
];
let R = [
  "Chen",
  "Park",
  "Ruiz",
  "Okafor",
  "Nair",
  "Becker",
  "Adeyemi",
  "Lindqvist",
  "Haddad",
  "Moreau",
  "Silva",
  "Tanaka",
];
let z = ["Fernhill", "Northwind", "Kept", "Halftone", "Parley", "Stillform"];
function B({ tab: e }) {
  let a = r.default.useRef(null);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)(C, {
        ref: a,
        title: "Import contacts",
        description:
          "From a spreadsheet or another CRM. Nothing is saved until you import.",
        noun: { one: "contact", many: "contacts" },
        fields: D,
        batchSize: 20,
        templateHref:
          "data:text/csv;charset=utf-8,Name%2CEmail%2CCompany%2CPlan%2CPhone%0D%0A",
        onImport: async (t, { signal: r }) => {
          if (
            (await new Promise((e) => setTimeout(e, 160)),
            !r.aborted && "Server refuses some" === e)
          )
            return {
              failed: t.flatMap((e, t) =>
                /^kai\./.test(e.email)
                  ? [{ index: t, reason: "Already a contact." }]
                  : [],
              ),
            };
        },
      }),
      (0, t.jsx)("div", {
        className: "mt-3 flex justify-center",
        children: (0, t.jsxs)("button", {
          type: "button",
          onClick: () =>
            a.current?.load(
              (function () {
                let e = [
                  "Full name,E-mail address,Organisation,Plan tier,Phone number,Notes",
                ];
                for (let t = 0; t < 240; t++) {
                  let r = T[t % T.length],
                    n = R[(7 * t) % R.length],
                    a = z[(5 * t) % z.length],
                    s = `${r}.${n}${t}@${a.toLowerCase()}.co`.toLowerCase(),
                    o = M[(3 * t) % M.length],
                    i = `+44 20 7${String(1e5 + 37 * t).slice(-6)}`;
                  (17 === t && (s = ""),
                    58 === t &&
                      (s = `${r.toLowerCase()} at ${a.toLowerCase()}.co`),
                    131 === t && (o = "Enterprise"),
                    199 === t && (i = "ask reception"));
                  let l =
                    t % 9 == 0 ? '"Met at the London meetup, ""keen"""' : "";
                  e.push([`"${n}, ${r}"`, s, a, o, i, l].join(","));
                }
                return e.join("\r\n");
              })(),
              "fernhill-contacts.csv",
            ),
          className:
            "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-accent hover:text-foreground",
          children: [
            (0, t.jsx)(n.FileSpreadsheet, {
              className: "size-3.5",
              strokeWidth: 1.75,
              "aria-hidden": "true",
            }),
            "Use a sample file (240 contacts)",
          ],
        }),
      }),
    ],
  });
}
export default (function ({ tab: e = "Import" }) {
  return (0, t.jsx)("div", {
    style: (0, L.demoAppearance)(),
    className: "w-full max-w-[680px] text-foreground",
    children: (0, t.jsx)(B, { tab: e }, e),
  });
});
