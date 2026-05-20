"use client";
import Scene from "../reference/generated/223544.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="live-cursors" Scene={Scene} />;
}
