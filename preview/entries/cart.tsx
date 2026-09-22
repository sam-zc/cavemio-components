"use client";
import Scene from "../reference/generated/161787.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="cart" Scene={Scene} />;
}
