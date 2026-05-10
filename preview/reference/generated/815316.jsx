"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/breadcrumb";
("use strict");
var r = dependency0;
function i(props) {
  return dependency1.createElement(dependency3.Breadcrumb, props);
}
export default (function ({ tab: e = "Short" }) {
  return "Long" === e
    ? (0, r.jsx)(i, {
        items: [
          { label: "Fernhill", href: "#" },
          { label: "Projects", href: "#" },
          { label: "Northwind", href: "#" },
          { label: "Brand", href: "#" },
          { label: "Assets", href: "#" },
          { label: "Logo.svg" },
        ],
      })
    : (0, r.jsx)(i, {
        items: [
          { label: "Customers", href: "#" },
          { label: "Ada Okafor", href: "#" },
          { label: "Invoices" },
        ],
      });
});
