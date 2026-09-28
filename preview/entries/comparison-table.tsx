"use client";
import Scene from "../reference/generated/911588.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="comparison-table" Scene={Scene} />;
}
