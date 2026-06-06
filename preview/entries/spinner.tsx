"use client";
import Scene from "../reference/generated/19823.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="spinner" Scene={Scene} />;
}
