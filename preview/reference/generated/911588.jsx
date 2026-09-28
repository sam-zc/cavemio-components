"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/comparison-table";
("use strict");
var r = dependency0;
function c(props) {
  return dependency1.createElement(dependency3.ComparisonTable, props);
}
let u = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "For a first shop finding its feet.",
    cta: { label: "Start free" },
  },
  {
    id: "growth",
    name: "Growth",
    price: { monthly: 24, yearly: 19 },
    description: "For shops with a queue out the door.",
    featured: !0,
    badge: "Popular",
    cta: { label: "Start a trial" },
  },
  {
    id: "scale",
    name: "Scale",
    price: { monthly: 79, yearly: 63 },
    description: "For several shops and a kitchen.",
    cta: { label: "Start a trial" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    description: "For chains with their own IT team.",
    cta: { label: "Talk to us" },
  },
];
let m = [
  {
    title: "Orders and stock",
    rows: [
      {
        label: "Orders a month",
        values: {
          free: "500",
          growth: "10,000",
          scale: "Unlimited",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Shops",
        values: {
          free: "1",
          growth: "3",
          scale: "10",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Stock alerts",
        hint: "A nudge before a flavour runs out",
        values: { free: !0, growth: !0, scale: !0, enterprise: !0 },
      },
      {
        label: "Batch planning",
        values: { free: !1, growth: !0, scale: !0, enterprise: !0 },
      },
    ],
  },
  {
    title: "Team",
    rows: [
      {
        label: "Seats",
        values: {
          free: "2",
          growth: "10",
          scale: "50",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Roles and permissions",
        values: { free: !1, growth: !0, scale: !0, enterprise: !0 },
      },
      {
        label: "Shift scheduling",
        values: { free: !1, growth: !1, scale: !0, enterprise: !0 },
      },
    ],
  },
  {
    title: "Security and support",
    rows: [
      {
        label: "Single sign-on",
        values: { free: !1, growth: !1, scale: !0, enterprise: !0 },
      },
      {
        label: "Audit log",
        values: {
          free: !1,
          growth: !1,
          scale: "90 days",
          enterprise: "Unlimited",
        },
      },
      {
        label: "Support",
        values: {
          free: "Email",
          growth: "Email, 1 day",
          scale: "Chat, 4 hours",
          enterprise: "Named contact",
        },
      },
    ],
  },
];
export default (function () {
  return (0, r.jsx)("div", {
    className: "w-full max-w-[880px]",
    children: (0, r.jsx)(c, { plans: u, groups: m, yearlyBadge: "Save 20%" }),
  });
});
