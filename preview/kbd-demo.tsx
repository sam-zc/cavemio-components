import * as React from "react";
import { Kbd } from "../registry/components/kbd";

export function KbdDemo({
  disabled = false,
  stopPropagation = true,
  passive = false,
  label,
  live = true,
}: {
  disabled?: boolean;
  stopPropagation?: boolean;
  passive?: boolean;
  label?: string;
  live?: boolean;
}) {
  const [count, setCount] = React.useState(0);
  const [bubbled, setBubbled] = React.useState(0);
  const [hotkey, setHotkey] = React.useState("k");
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-6" data-demo-hotkey={hotkey}>
      <section
        aria-label="Live keys"
        className="flex flex-col items-center gap-3"
      >
        <h3 className="text-sm font-medium">Live keys</h3>
        <p className="text-sm text-muted-foreground">
          Keys sink 1px while held. Try Shift, Enter, or the arrow keys.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Kbd
            keys="mod+k"
            live={live}
            disabled={disabled}
            aria-label="Command or Control K"
          />
          <Kbd keys={["shift", "enter"]} live={live} disabled={disabled} />
          <Kbd
            keys={["up", "down", "left", "right"]}
            live={live}
            disabled={disabled}
          />
        </div>
      </section>
      <div
        onClick={() => setBubbled((value) => value + 1)}
        onKeyDown={(event) => {
          if (
            (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            !event.altKey &&
            event.key === hotkey
          )
            setBubbled((value) => value + 1);
        }}
      >
        {visible && (
          <Kbd
            hotkey={hotkey}
            label={label}
            disabled={disabled}
            stopPropagation={stopPropagation}
            onTrigger={
              passive ? undefined : () => setCount((value) => value + 1)
            }
            aria-label="Run shortcut"
          />
        )}
        <input
          aria-label="Type here"
          className="ml-4 rounded border p-2"
          placeholder="Shortcuts work here too"
        />
      </div>
      <p role="status">
        Triggered {count} times; bubbled {bubbled} times
      </p>
      <div className="flex gap-4">
        <button onClick={() => setHotkey((key) => (key === "k" ? "j" : "k"))}>
          Change shortcut
        </button>
        <button onClick={() => setVisible((value) => !value)}>
          Toggle shortcut
        </button>
      </div>
      <div className="flex gap-2">
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
        <Kbd>↑</Kbd>
      </div>
    </div>
  );
}
