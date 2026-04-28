import { useId, useState } from "react";
import {
  ThemeToggle,
  type ThemeToggleMode,
} from "../registry/components/theme-toggle";

import { PrimitiveTabs } from "./primitive-tabs";

export function ThemeToggleDemo({
  initialTheme = "light",
  theme: controlledTheme,
  onThemeChange,
  disabled = false,
  initialWipe = true,
}: {
  initialTheme?: ThemeToggleMode;
  theme?: ThemeToggleMode;
  onThemeChange?: (theme: ThemeToggleMode) => void;
  disabled?: boolean;
  initialWipe?: boolean;
}) {
  const [localTheme, setLocalTheme] = useState<ThemeToggleMode>(initialTheme);
  const theme = controlledTheme ?? localTheme;
  const groupId = useId();
  const [wipe, setWipe] = useState(initialWipe);
  const transition = wipe ? "circular" : "none";
  return (
    <div
      data-theme-toggle-demo={theme}
      className="cavemio-demo flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6"
      style={{
        background: theme === "dark" ? "#000" : "#fff",
        color: theme === "dark" ? "#fff" : "#171717",
      }}
    >
      <PrimitiveTabs
        label="Page transition"
        panelId={groupId}
        items={[
          { label: "With wipe", value: "circular" },
          { label: "Without wipe", value: "none" },
        ]}
        value={transition}
        onChange={(value) => setWipe(value === "circular")}
      />
      <div
        id={groupId}
        role="tabpanel"
        aria-labelledby={`${groupId}-${transition}`}
        className="flex flex-col items-center gap-6"
      >
        <ThemeToggle
          theme={theme}
          onThemeChange={(next) => {
            if (controlledTheme === undefined) setLocalTheme(next);
            onThemeChange?.(next);
          }}
          pageTransition={transition}
          disabled={disabled}
        />
        <p role="status" className="text-sm opacity-70">
          {theme === "light" ? "Light mode" : "Dark mode"}
        </p>
      </div>
    </div>
  );
}
