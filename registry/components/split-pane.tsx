"use client";

/* ─────────────────────────────────────────────────────────
 * SPLIT PANE: desktop-grade resizable dual surface
 *
 *   divider    1px thin line border with a centered grab pill;
 *              hover expands the line to an active primary accent
 *   drag       zero-lag direct DOM updates; dragging beyond
 *              min/max limits introduces logarithmic rubber-band
 *              resistance
 *   spring     releasing past boundary limits triggers an
 *              analytical WAAPI damped harmonic spring back
 *              to the boundary threshold
 *   snapping   double-clicking the divider smoothly cycles
 *              between 50%, 25%, and 75% preset layouts
 *   collapse   built-in controls fold either pane to 0 width,
 *              docking the thin line divider flush to the edge
 *   touch      expanded touch targets enable fluid dragging on
 *              mobile devices
 *
 * Fully accessible separator semantics with keyboard step.
 * ───────────────────────────────────────────────────────── */

import * as React from "react";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import {
  INTERACTION_FOCUS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";
import { useSplitPane } from "./use-split-pane";

export interface SplitPaneProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  first: React.ReactNode;
  second: React.ReactNode;
  split?: number;
  defaultSplit?: number;
  minSize?: number;
  maxSize?: number;
  orientation?: "horizontal" | "vertical";
  collapsible?: boolean;
  disabled?: boolean;
  onSplitChange?: (split: number) => void;
  onSplitCommit?: (split: number) => void;
}

export function SplitPane({
  first,
  second,
  split,
  defaultSplit = 50,
  minSize = 15,
  maxSize = 85,
  orientation = "horizontal",
  collapsible = true,
  disabled = false,
  onSplitChange,
  onSplitCommit,
  className = "",
  ...props
}: SplitPaneProps) {
  const reduced = useInteractionReducedMotion();
  const isHorizontal = orientation !== "vertical";

  const pane = useSplitPane({
    orientation,
    split,
    defaultSplit,
    minSize,
    maxSize,
    disabled,
    reduced,
    onChange: onSplitChange,
    onCommit: onSplitCommit,
  });

  return (
    <div
      {...props}
      ref={(el) => pane.attachContainer(el)}
      className={`relative flex select-none overflow-hidden rounded-[14px] border border-border bg-background ${
        isHorizontal ? "flex-row" : "flex-col"
      } ${className}`}
    >
      {/* First Pane */}
      <div
        ref={(el) => pane.attachFirstPane(el)}
        className={`relative min-h-0 min-w-0 overflow-hidden ${
          pane.collapsed === "first" ? "pointer-events-none" : ""
        }`}
        style={{ flexBasis: `${defaultSplit}%` }}
      >
        <div className="size-full overflow-auto">{first}</div>
      </div>

      {/* 1px thin line Divider Container */}
      <div
        className={`relative z-10 shrink-0 touch-none ${
          isHorizontal ? "w-px cursor-col-resize" : "h-px cursor-row-resize"
        }`}
      >
        {/* Full thin line Line */}
        <div
          className={`absolute inset-0 bg-border transition-colors ${
            pane.dragging ? "bg-primary" : "hover:bg-primary/70"
          }`}
        />

        {/* Dead-Centered Draggable Grab Handle Button */}
        <button
          ref={(el) => pane.attachDivider(el)}
          {...pane.dividerProps}
          type="button"
          role="separator"
          disabled={disabled}
          aria-orientation={isHorizontal ? "vertical" : "horizontal"}
          aria-valuenow={Math.round(split ?? defaultSplit)}
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          aria-label="Resize split panes"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            touchAction: "none",
          }}
          className={`group flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground active:scale-95 disabled:cursor-default disabled:opacity-40 before:absolute before:-inset-3 before:content-[''] ${
            isHorizontal
              ? "h-8 w-4.5 cursor-col-resize"
              : "h-4.5 w-8 cursor-row-resize"
          } ${INTERACTION_FOCUS}`}
        >
          <GripVertical className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
        </button>

        {/* Optional Collapsible Controls */}
        {collapsible && !pane.dragging && (
          <div
            style={{
              position: "absolute",
              left: isHorizontal ? "50%" : "12px",
              top: isHorizontal ? "12px" : "50%",
              transform: isHorizontal
                ? "translate(-50%, 0)"
                : "translate(0, -50%)",
            }}
            className={`z-20 flex items-center gap-0.5 ${
              isHorizontal ? "flex-col" : "flex-row"
            }`}
          >
            {pane.collapsed === "first" ? (
              <button
                type="button"
                onClick={pane.expand}
                title="Restore pane"
                className="cursor-pointer rounded-full border border-border bg-surface p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="size-3" />
              </button>
            ) : pane.collapsed === "second" ? (
              <button
                type="button"
                onClick={pane.expand}
                title="Restore pane"
                className="cursor-pointer rounded-full border border-border bg-surface p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-3" />
              </button>
            ) : (
              <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100">
                <button
                  type="button"
                  onClick={() => pane.collapse("first")}
                  title="Collapse left"
                  className="cursor-pointer rounded border border-border bg-surface p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => pane.collapse("second")}
                  title="Collapse right"
                  className="cursor-pointer rounded border border-border bg-surface p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="size-2.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Second Pane */}
      <div
        className={`relative min-h-0 min-w-0 flex-1 overflow-hidden ${
          pane.collapsed === "second" ? "pointer-events-none" : ""
        }`}
      >
        <div className="size-full overflow-auto">{second}</div>
      </div>
    </div>
  );
}
