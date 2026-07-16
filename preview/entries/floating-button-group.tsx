"use client";
import Scene from "../reference/generated/2514.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return (
    <ReferenceDemo {...props} name="floating-button-group" Scene={Scene} />
  );
}
