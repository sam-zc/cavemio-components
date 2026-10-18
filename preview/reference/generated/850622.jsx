"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/settings-form";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
class i extends Error {
  fields;
  constructor(e, t = {}) {
    (super(e), (this.name = "SettingsFormError"), (this.fields = t));
  }
}
function _(props) {
  return dependency1.createElement(dependency5.SettingsForm, props);
}
var E = dependency6;
let L = ["acme", "relay", "admin", "northwind", "kept"];
let C = (e) => new Promise((t) => setTimeout(t, e));
let T = [
  {
    title: "Workspace",
    description: "How Fernhill appears to people you invite.",
    fields: [
      {
        type: "text",
        name: "name",
        label: "Name",
        placeholder: "Fernhill",
        validate: (e) => (e.trim() ? null : "Your workspace needs a name."),
      },
      {
        type: "text",
        name: "slug",
        label: "Address",
        prefix: "relay.app/",
        description: "Links you share use it. Try “northwind”.",
        validate: (e) =>
          /^[a-z0-9-]{3,32}$/.test(e)
            ? null
            : "Use 3 to 32 lowercase letters, numbers or dashes.",
        check: async (e, { signal: t }) =>
          (await C(650), t.aborted)
            ? null
            : L.includes(e)
              ? `relay.app/${e} is taken.`
              : null,
        checkPassed: "Available",
      },
      {
        type: "textarea",
        name: "about",
        label: "About",
        placeholder: "What your team works on",
        rows: 2,
        maxLength: 160,
      },
    ],
  },
  {
    title: "Notifications",
    description: "Saved as you change them.",
    fields: [
      {
        type: "toggle",
        name: "digest",
        label: "Weekly digest",
        description: "A summary of what changed, every Monday.",
      },
      {
        type: "toggle",
        name: "mentions",
        label: "Mentions",
        description: "Email me when someone mentions me.",
      },
      {
        type: "choice",
        name: "product",
        label: "Product emails",
        options: [
          { value: "all", label: "All" },
          { value: "important", label: "Important" },
          { value: "none", label: "None" },
        ],
      },
    ],
  },
];
let R = {
  name: "Fernhill",
  slug: "fernhill",
  about: "Field notes and tooling for small farms.",
  digest: !0,
  mentions: !1,
  product: "important",
};
function O({ tab: e }) {
  let [n, a] = r.default.useState(R),
    s = r.default.useRef(
      "Server says no" === e
        ? { slug: 1, mentions: 1 }
        : { slug: 0, mentions: 0 },
    );
  return (0, t.jsx)(_, {
    sections: T,
    value: n,
    onValueChange: a,
    warnOnLeave: !1,
    onSave: async (e) => {
      if ((await C(750), "mentions" in e && s.current.mentions > 0))
        throw (
          s.current.mentions--,
          Error("An admin has turned mention emails off for Fernhill.")
        );
      if ("slug" in e && s.current.slug > 0)
        throw (
          s.current.slug--,
          new i("Nothing was saved.", {
            slug: `Someone took relay.app/${e.slug} a moment ago.`,
          })
        );
      return e;
    },
  });
}
export default (function ({ tab: e = "Settings" }) {
  return (0, t.jsx)("div", {
    style: (0, E.demoAppearance)(),
    className: "w-full max-w-[620px] text-foreground",
    children: (0, t.jsx)(O, { tab: e }, e),
  });
});
