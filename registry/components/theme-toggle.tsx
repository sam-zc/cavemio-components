"use client";

import { useId, useState, type ComponentPropsWithoutRef } from "react";

import { useThemeWipe } from "./use-theme-wipe";
import { ThemeToggleVariants, type Theme } from "./theme-toggle-variants";

export type ThemeToggleMode = "light" | "dark";

export interface ThemeToggleProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> {
  variant?: "icon" | "pill" | "segmented";
  onValueChange?: (theme: Theme) => void;
  storageKey?: string;
  attribute?: "class" | "data-theme";
  reveal?: boolean;
  theme?: ThemeToggleMode;
  defaultTheme?: ThemeToggleMode;
  onThemeChange?: (theme: ThemeToggleMode) => void;
  size?: number;
  /** Opt in to a document reveal. onThemeChange must apply the theme synchronously. */
  pageTransition?: "none" | "circular";
}

const morph =
  "origin-center [transform-box:view-box] transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

function LegacyThemeToggle({
  theme,
  defaultTheme = "light",
  onThemeChange,
  size = 48,
  pageTransition = "none",
  disabled,
  className = "",
  style,
  onClick,
  type = "button",
  "aria-label": label,
  ...props
}: ThemeToggleProps) {
  const [localTheme, setLocalTheme] = useState(defaultTheme);
  const currentTheme = theme ?? localTheme;
  const wipe = useThemeWipe();
  const dark = currentTheme === "dark";
  const maskId = `theme-toggle-${useId().replaceAll(":", "")}`;

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      aria-label={label ?? `Switch to ${dark ? "light" : "dark"} mode`}
      aria-pressed={dark}
      data-theme-toggle={currentTheme}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white p-0 text-black transition-[background-color,color,scale] duration-200 hover:scale-[1.04] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 data-[theme-toggle=dark]:bg-black data-[theme-toggle=dark]:text-white motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 ${pageTransition === "circular" ? "hover:scale-100! active:scale-100!" : ""} ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: 44,
        minHeight: 44,
        ...style,
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        wipe(
          event.currentTarget,
          currentTheme,
          pageTransition,
          (next) => {
            if (theme === undefined) setLocalTheme(next);
            onThemeChange?.(next);
          },
          props.nonce,
        );
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 32 32"
        className="size-2/3 overflow-visible"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="32"
            height="32"
          >
            <rect width="32" height="32" fill="white" />
            <circle
              data-theme-toggle-cutout=""
              cx="36"
              cy="-4"
              r="8"
              fill="black"
              className={morph}
              style={{
                transform: dark
                  ? "translate(-16px, 16px)"
                  : "translate(0px, 0px)",
              }}
            />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <circle
            cx="16"
            cy="16"
            r="7.5"
            fill="currentColor"
            className={morph}
            style={{ transform: dark ? "scale(1.2)" : "scale(1)" }}
          />
        </g>
        <g
          data-theme-toggle-rays=""
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={morph}
          style={{
            opacity: dark ? 0 : 1,
            transform: dark
              ? "rotate(45deg) scale(0.5)"
              : "rotate(0deg) scale(1)",
          }}
        >
          {Array.from({ length: 8 }, (_, index) => (
            <line
              key={index}
              x1="16"
              y1="2"
              x2="16"
              y2="6"
              transform={`rotate(${index * 45} 16 16)`}
            />
          ))}
        </g>
      </svg>
    </button>
  );
}

export function ThemeToggle(props: ThemeToggleProps) {
  if (
    props.variant !== undefined ||
    props.onValueChange ||
    props.storageKey ||
    props.attribute ||
    props.reveal !== undefined
  ) {
    const choice = (value: unknown): Theme | undefined =>
      value === "light" || value === "dark" || value === "system"
        ? value
        : undefined;
    return (
      <ThemeToggleVariants
        variant={props.variant}
        value={choice(props.value)}
        defaultValue={choice(props.defaultValue)}
        onValueChange={props.onValueChange}
        storageKey={props.storageKey}
        attribute={props.attribute}
        reveal={props.reveal}
        className={props.className}
        style={props.style}
        id={props.id}
      />
    );
  }
  return <LegacyThemeToggle {...props} />;
}
