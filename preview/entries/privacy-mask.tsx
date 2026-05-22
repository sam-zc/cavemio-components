"use client";
import Scene from "../reference/generated/123876.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="privacy-mask" Scene={Scene} />;
}
