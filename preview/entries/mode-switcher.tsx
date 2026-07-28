"use client";
import Scene from "../reference/generated/6448.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="mode-switcher" Scene={Scene} />;
}
