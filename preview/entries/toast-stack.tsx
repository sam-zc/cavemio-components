"use client";
import Scene from "../reference/generated/600707.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="toast-stack" Scene={Scene} />;
}
