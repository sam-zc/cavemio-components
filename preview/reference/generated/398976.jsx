"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency8 from "../../../registry/components/integrations";
import * as dependency9 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency2;
var s = dependency2;
var i = dependency2;
var o = dependency2;
var l = dependency2;
var d = dependency3;
let c = (0, d.default)("PenTool", [
  [
    "path",
    {
      d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",
      key: "nt11vn",
    },
  ],
  [
    "path",
    {
      d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",
      key: "15qc1e",
    },
  ],
  ["path", { d: "m2.3 2.3 7.286 7.286", key: "1wuzzi" }],
  ["circle", { cx: "11", cy: "11", r: "2", key: "xmgehs" }],
]);
let u = (0, d.default)("Ticket", [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
      key: "qn84l0",
    },
  ],
  ["path", { d: "M13 5v2", key: "dyzc3o" }],
  ["path", { d: "M13 17v2", key: "1ont0d" }],
  ["path", { d: "M13 11v2", key: "1wjjxi" }],
]);
function C(props) {
  return dependency1.createElement(dependency8.Integrations, props);
}
var S = dependency9;
let z = (e) => new Promise((t) => setTimeout(t, e));
let L = (e) => (0, t.jsx)(e, { strokeWidth: 1.75 });
let R = () => [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    icon: L(l.MessageSquare),
    description: "Post releases and alerts to your channels.",
    scopes: ["Read channels", "Post messages"],
    account: { name: "Fernhill", detail: "Posts to #releases and #alerts" },
  },
  {
    id: "github",
    name: "GitHub",
    category: "Engineering",
    icon: L(i.GitBranch),
    description: "Link pull requests to projects and close tasks on merge.",
    scopes: ["Read repositories", "Pull requests"],
  },
  {
    id: "linear",
    name: "Linear",
    category: "Engineering",
    icon: L(u),
    description: "Turn feedback into issues with one click.",
    scopes: ["Create issues"],
  },
  {
    id: "drive",
    name: "Google Drive",
    category: "Files",
    icon: L(s.FolderOpen),
    description: "Attach files from Drive without downloading them.",
    scopes: ["Read files you pick"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "Files",
    icon: L(c),
    description: "Live previews of frames in comments.",
    scopes: ["Read files"],
  },
  {
    id: "notion",
    name: "Notion",
    category: "Files",
    icon: L(n.BookOpen),
    description: "Sync project briefs both ways.",
    scopes: ["Read pages", "Update pages"],
  },
  {
    id: "calendar",
    name: "Google Calendar",
    category: "Communication",
    icon: L(a.CalendarDays),
    description: "Show deadlines on your team calendar.",
    scopes: ["Create events"],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "Communication",
    icon: L(o.LifeBuoy),
    description: "See a customer's tickets next to their projects.",
    scopes: ["Read tickets"],
  },
];
let E = {
  github: { name: "fernhill-co", detail: "12 repositories" },
  linear: { name: "Fernhill", detail: "Team: Product" },
  drive: { name: "maya@fernhill.co" },
  figma: { name: "Fernhill Design" },
  notion: { name: "Fernhill wiki", detail: "3 pages shared" },
  calendar: { name: "maya@fernhill.co", detail: "Calendar: Releases" },
  zendesk: { name: "fernhill.zendesk.com" },
  slack: { name: "Fernhill", detail: "Posts to #releases and #alerts" },
};
function T({ tab: e }) {
  let [n, a] = r.default.useState(R),
    s = r.default.useRef(
      "Errors" === e
        ? {
            github: "The window was closed before it finished.",
            drive:
              "Your Google admin hasn’t allowed Relay yet. Ask them to approve it.",
          }
        : {},
    );
  return (0, t.jsx)(C, {
    value: n,
    onValueChange: a,
    settingsHref: (e) => `#${e.id}`,
    onConnect: async (e) => {
      await z(1600);
      let t = s.current[e.id];
      if (t) throw (delete s.current[e.id], Error(t));
      return E[e.id] ?? { name: "Fernhill" };
    },
    onDisconnect: () => z(700),
  });
}
export default (function ({ tab: e = "Integrations" }) {
  return (0, t.jsx)("div", {
    style: (0, S.demoAppearance)(),
    className: "w-full max-w-[620px] text-foreground",
    children: (0, t.jsx)(T, { tab: e }, e),
  });
});
