"use client";
import Scene from "../reference/generated/41231.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="split-pane" Scene={Scene} />;
}
