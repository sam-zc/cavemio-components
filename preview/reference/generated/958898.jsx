"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency12 from "../../../registry/components/team-members";
import * as dependency13 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function A(props) {
  return dependency1.createElement(dependency12.TeamMembers, props);
}
var L = dependency13;
let z = [
  {
    value: "admin",
    label: "Admin",
    description: "Members, billing and API keys",
  },
  { value: "member", label: "Member", description: "Create and edit projects" },
  {
    value: "viewer",
    label: "Viewer",
    description: "Read projects and comment",
  },
];
let B = [
  {
    value: "priya@fernhill.co",
    label: "Priya Nair",
    description: "priya@fernhill.co · Product",
  },
  {
    value: "tom@northwind.dev",
    label: "Tom Becker",
    description: "tom@northwind.dev · Northwind",
  },
  {
    value: "jo@fernhill.co",
    label: "Jo Adeyemi",
    description: "jo@fernhill.co · Support",
  },
  {
    value: "kai@fernhill.co",
    label: "Kai Lindqvist",
    description: "kai@fernhill.co · Engineering",
  },
];
let I = (e) => new Promise((t) => setTimeout(t, e));
let F = (e) => new Date(Date.now() - e);
let W = () => [
  {
    id: "u_maya",
    name: "Maya Chen",
    email: "maya@fernhill.co",
    role: "Owner",
    you: !0,
    locked: !0,
    lastActiveAt: F(0),
  },
  {
    id: "u_leo",
    name: "Leo Park",
    email: "leo@fernhill.co",
    role: "admin",
    lastActiveAt: F(18e4),
  },
  {
    id: "u_ana",
    name: "Ana Ruiz",
    email: "ana@fernhill.co",
    role: "member",
    lastActiveAt: F(1728e5),
  },
  {
    id: "u_sam",
    email: "sam@fernhill.co",
    role: "member",
    status: "invited",
    invitedAt: F(12e3),
  },
];
function P({ tab: e }) {
  let [n, a] = r.default.useState(W),
    i = r.default.useRef(
      "Errors" === e ? { invite: 1, role: 1 } : { invite: 0, role: 0 },
    );
  return (0, t.jsx)(A, {
    value: n,
    onValueChange: a,
    roles: z,
    seats: "Seat limit" === e ? 5 : 8,
    suggestions: B,
    onInvite: async (e, t) => {
      if ((await I(900), i.current.invite > 0))
        throw (
          i.current.invite--,
          Error("The mail server didn’t answer. Your addresses are still here.")
        );
      return e.map((e) => ({
        id: `u_${e}`,
        email: e,
        name: B.find((t) => t.value === e)?.label,
        role: t,
        status: "invited",
        invitedAt: new Date(),
      }));
    },
    onRoleChange: async (e, t) => {
      if ((await I(800), i.current.role > 0 && "admin" === t))
        throw (
          i.current.role--,
          Error(`Only the owner can make ${e.name ?? e.email} an admin.`)
        );
    },
    onRemove: () => I(700),
    onResend: () => I(800),
    resendAfter: 30,
  });
}
export default (function ({ tab: e = "Members" }) {
  return (0, t.jsx)("div", {
    style: (0, L.demoAppearance)(),
    className: "w-full max-w-[580px] text-foreground",
    children: (0, t.jsx)(P, { tab: e }, e),
  });
});
