import * as React from "react";
import { TextMorph } from "../registry/components/text-morph";
import { PrimitiveTabs } from "./primitive-tabs";

const labels = [
  "Save",
  "Saving",
  "Saved",
  "Copy link",
  "Copied",
  "Follow",
  "Following",
  "Subscribe",
];
const audiences = ["founders", "designers", "developers", "everyone"];

export function TextMorphDemo({
  initialMode = "labels",
  duration = 460,
  direction = "up",
}: {
  initialMode?: "labels" | "headline";
  duration?: number;
  direction?: "up" | "down";
}) {
  const [mode, setMode] = React.useState(initialMode);
  const [label, setLabel] = React.useState("Save");
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const panelId = React.useId();
  React.useEffect(() => {
    if (mode !== "headline" || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!reduced.matches && document.visibilityState === "visible")
        setIndex((value) => (value + 1) % audiences.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [mode, paused]);
  return (
    <div className="cavemio-demo primitive-demo" data-demo="text-morph">
      <div
        className="primitive-stage"
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-${mode}`}
      >
        {mode === "labels" ? (
          <>
            <div className="primitive-text" data-testid="morph-value">
              <TextMorph duration={duration} direction={direction}>
                {label}
              </TextMorph>
            </div>
            <div
              className="primitive-options"
              role="group"
              aria-label="Choose a label"
            >
              {labels.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={label === value}
                  onClick={() => setLabel(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="primitive-headline">
            <div>
              Interfaces for{" "}
              <TextMorph
                className="text-[var(--accent-ink)]"
                duration={duration}
                direction={direction}
              >
                {audiences[index]}
              </TextMorph>
            </div>
            <div className="primitive-options headline-controls">
              <button
                type="button"
                onClick={() =>
                  setIndex((value) => (value + 1) % audiences.length)
                }
              >
                Next word
              </button>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? "Play" : "Pause"}
              </button>
            </div>
          </div>
        )}
      </div>
      <PrimitiveTabs
        items={[
          { value: "labels", label: "Labels" },
          { value: "headline", label: "Headline" },
        ]}
        value={mode}
        onChange={setMode}
        label="Text Morph examples"
        panelId={panelId}
      />
    </div>
  );
}
