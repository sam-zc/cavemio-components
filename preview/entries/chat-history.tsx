"use client";
import Scene from "../reference/generated/189607.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="chat-history" Scene={Scene} />;
}
