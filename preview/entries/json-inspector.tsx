"use client";
import Scene from "../reference/generated/635201.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="json-inspector" Scene={Scene} />;
}
