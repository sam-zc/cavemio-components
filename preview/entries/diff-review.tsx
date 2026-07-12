"use client";
import Scene from "../reference/generated/560434.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="diff-review" Scene={Scene} />;
}
