"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency8 from "../../../registry/components/auth-card";
import * as dependency9 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
function T(props) {
  return dependency1.createElement(dependency8.AuthCard, props);
}
var E = dependency9;
let R = (e) => new Promise((t) => setTimeout(t, e));
let M = [
  {
    id: "google",
    label: "Google",
    icon: (0, t.jsx)(function () {
      return (0, t.jsx)("svg", {
        viewBox: "0 0 16 16",
        "aria-hidden": "true",
        children: (0, t.jsx)("text", {
          x: "8",
          y: "12.4",
          textAnchor: "middle",
          fontSize: "13",
          fontWeight: "700",
          fontFamily: "inherit",
          fill: "currentColor",
          children: "G",
        }),
      });
    }, {}),
  },
  {
    id: "sso",
    label: "SSO",
    icon: (0, t.jsx)(n.Building2, { strokeWidth: 1.75 }),
  },
];
let z = {
  Password: {
    email: "maya@fernhill.co",
    hint: "Fernhill addresses use a password: fernhill",
  },
  Code: {
    email: "leo@northwind.dev",
    hint: "Other work addresses get a code: 424242",
  },
  "Magic link": {
    email: "ana.ruiz@gmail.com",
    hint: "Gmail addresses get a link, and a button that opens Gmail",
  },
};
function L({ email: e }) {
  let [n, i] = r.default.useState(0);
  return (0, t.jsx)(
    T,
    {
      logo: (0, t.jsx)("span", {
        className:
          "inline-flex size-8 items-center justify-center rounded-[10px] bg-primary text-[13px] font-semibold text-primary-foreground",
        children: "R",
      }),
      copy: {
        email: {
          title: "Sign in to Relay",
          description: "Welcome back. Use the email you signed up with.",
        },
      },
      defaultEmail: e,
      providers: M,
      onProvider: async (e) => {
        if ((await R(1200), "sso" === e))
          throw Error("Fernhill hasn’t set up single sign-on yet.");
      },
      onPasskey: async () => {
        throw (await R(1400), Error("No passkey for Relay on this device."));
      },
      onEmail: async (e) =>
        (await R(700), e.endsWith("@fernhill.co"))
          ? "password"
          : /@(gmail|googlemail)\.com$/.test(e)
            ? "link"
            : "code",
      onPassword: async (e, t) => {
        if ((await R(800), "fernhill" !== t))
          throw Error("That password isn’t right.");
      },
      onCode: async (e, t) => {
        if ((await R(700), "424242" !== t)) throw Error("Wrong code");
      },
      onResend: () => R(800),
      onForgot: () => R(900),
      onSuccess: () => setTimeout(() => i((e) => e + 1), 1800),
      footer: (0, t.jsxs)(t.Fragment, {
        children: [
          "No account yet? ",
          (0, t.jsx)("a", { href: "#auth-card", children: "Create one" }),
        ],
      }),
    },
    n,
  );
}
export default (function ({ tab: e = "Password" }) {
  let r = z[e] ?? z.Password;
  return (0, t.jsxs)("div", {
    style: (0, E.demoAppearance)(),
    className: "w-full max-w-[400px] text-foreground",
    children: [
      (0, t.jsx)(L, { email: r.email }, e),
      (0, t.jsx)("p", {
        className: "mt-3 text-center text-[11.5px] text-muted-foreground",
        children: r.hint,
      }),
    ],
  });
});
