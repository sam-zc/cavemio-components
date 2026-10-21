"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/terms";
("use strict");
var e = dependency0;
function I(props) {
  return dependency1.createElement(dependency5.Terms, props);
}
let f = [
  {
    id: "use",
    title: "Using Relay",
    tldr: "Use it for your work. Nothing illegal, nothing that breaks it for others.",
    body: (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("p", {
          children:
            "These terms apply to your use of Relay and any related services provided by Relay Labs Ltd. By creating an account or using the service you agree to be bound by them on behalf of yourself and any organisation you represent.",
        }),
        (0, e.jsx)("p", {
          children:
            "You may not use the service to break the law, infringe the rights of others, distribute malware, attempt to gain unauthorised access to any system, or place an unreasonable load on our infrastructure.",
        }),
      ],
    }),
  },
  {
    id: "account",
    title: "Your account",
    tldr: "Keep your password to yourself. What happens on your account is on you.",
    body: (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("p", {
          children:
            "You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account, whether or not authorised by you.",
        }),
        (0, e.jsx)("p", {
          children:
            "You must notify us promptly of any unauthorised use. We are not liable for losses arising from your failure to keep your credentials secure.",
        }),
      ],
    }),
  },
  {
    id: "data",
    title: "Your data",
    tldr: "Your files stay yours. We only touch them to run Relay for you.",
    body: (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("p", {
          children:
            "You retain all right, title and interest in content you upload. You grant us a limited, non-exclusive licence to host, copy, process and display that content solely as necessary to provide and improve the service.",
        }),
        (0, e.jsx)("p", {
          children:
            "We process personal data in accordance with our Privacy Policy and, where applicable, the Data Processing Addendum, which form part of these terms.",
        }),
      ],
    }),
  },
  {
    id: "payment",
    title: "Payment",
    tldr: "Monthly or yearly, cancel any time. No refunds for part of a month.",
    body: (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("p", {
          children:
            "Paid plans are billed in advance on a monthly or annual basis and are non-refundable except where required by law. Fees are exclusive of applicable taxes.",
        }),
        (0, e.jsx)("p", {
          children:
            "We may change prices with at least 30 days’ notice; changes take effect at the start of your next billing period.",
        }),
      ],
    }),
  },
  {
    id: "ending",
    title: "Ending things",
    tldr: "Either of us can end this. You can export everything first.",
    body: (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("p", {
          children:
            "You may terminate your account at any time from your settings. We may suspend or terminate access for material breach of these terms after reasonable notice where practicable.",
        }),
        (0, e.jsx)("p", {
          children:
            "On termination you may export your content for 30 days, after which it will be deleted from our systems in accordance with our retention schedule.",
        }),
      ],
    }),
  },
];
export default (function ({ tab: A = "Read" }) {
  return (0, e.jsx)(
    I,
    {
      sections: f,
      version: "2026-10-21",
      updated: "Updated 21 October 2026",
      onDecline: () => {},
      onAccept: async () => {
        if ((await new Promise((A) => setTimeout(A, 700)), "Not saved" === A))
          throw Error("Couldn’t save that.");
      },
    },
    A,
  );
});
