"use client";
import Scene from "../reference/generated/6838.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="command-palette" Scene={Scene} />;
}
