"use client";
import Scene from "../reference/generated/30083.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="action-receipt" Scene={Scene} />;
}
