import * as React from "react";
import { NumberRoll } from "../registry/components/number-roll";
import { PrimitiveTabs } from "./primitive-tabs";

type Mode = "Try it" | "Currency" | "Compact" | "Live";
const modes: Mode[] = ["Try it", "Currency", "Compact", "Live"];

export function NumberRollDemo({
  initialMode = "Try it",
  initialValue = 1248,
}: {
  initialMode?: Mode;
  initialValue?: number;
}) {
  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [value, setValue] = React.useState(
    initialMode === "Compact"
      ? 9400
      : initialMode === "Live"
        ? 12480
        : initialValue,
  );
  const [paused, setPaused] = React.useState(false);
  const panelId = React.useId();
  React.useEffect(() => {
    if (mode !== "Live" || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!reduced.matches && document.visibilityState === "visible")
        setValue((current) => current + 1);
    }, 1600);
    return () => window.clearInterval(timer);
  }, [mode, paused]);
  const selectMode = (next: Mode) => {
    setMode(next);
    setValue(next === "Compact" ? 9400 : next === "Live" ? 12480 : 1248);
  };
  const change = (update: (current: number) => number) =>
    setValue((current) =>
      Math.max(-9999999, Math.min(9999999, update(current))),
    );
  return (
    <div className="cavemio-demo primitive-demo" data-demo="number-roll">
      <div
        className="primitive-stage"
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-${mode}`}
      >
        <div className="primitive-number" data-testid="roll-value">
          <NumberRoll
            value={value}
            locales="en-GB"
            format={
              mode === "Currency"
                ? {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }
                : mode === "Compact"
                  ? { notation: "compact", maximumFractionDigits: 1 }
                  : { maximumFractionDigits: 0 }
            }
          />
        </div>
        <div
          className="primitive-options"
          role="group"
          aria-label="Change number"
        >
          {mode === "Live" ? (
            <>
              <span className="primitive-live">Live activity</span>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused((current) => !current)}
              >
                {paused ? "Resume" : "Pause"}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => change((n) => n - 1)}>
                −1
              </button>
              <button type="button" onClick={() => change((n) => n + 1)}>
                +1
              </button>
              <button type="button" onClick={() => change((n) => n + 752)}>
                +752
              </button>
              <button type="button" onClick={() => change((n) => n * 10)}>
                ×10
              </button>
              <button
                type="button"
                onClick={() => change((n) => Math.round(n / 10))}
              >
                ÷10
              </button>
              <button
                type="button"
                onClick={() => setValue(Math.floor(Math.random() * 10000))}
              >
                Random
              </button>
            </>
          )}
        </div>
      </div>
      <PrimitiveTabs
        items={modes.map((value) => ({ value, label: value }))}
        value={mode}
        onChange={selectMode}
        label="Number Roll examples"
        panelId={panelId}
      />
    </div>
  );
}
