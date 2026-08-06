"use client";
import Scene from "../reference/generated/662450.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="prompt-composer" Scene={Scene} />;
}
