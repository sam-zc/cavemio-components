import * as React from "react";

export function PrimitiveTabs<T extends string>({
  items,
  value,
  onChange,
  label,
  panelId,
}: {
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  panelId: string;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ left: 3, width: 0 });
  React.useLayoutEffect(() => {
    const measure = () => {
      const active = root.current?.querySelector<HTMLElement>(
        '[aria-selected="true"]',
      );
      if (active)
        setPosition({ left: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div
      ref={root}
      className="primitive-tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={(event) => {
        let index = items.findIndex((item) => item.value === value);
        if (event.key === "ArrowRight") index++;
        else if (event.key === "ArrowLeft") index--;
        else if (event.key === "Home") index = 0;
        else if (event.key === "End") index = items.length - 1;
        else return;
        event.preventDefault();
        const next = (index + items.length) % items.length;
        onChange(items[next].value);
        root.current
          ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
          [next]?.focus();
      }}
    >
      <span
        className="primitive-tab-highlight"
        aria-hidden="true"
        style={{
          width: position.width,
          transform: `translateX(${position.left}px)`,
          opacity: position.width ? 1 : 0,
        }}
      />
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          key={item.value}
          id={`${panelId}-${item.value}`}
          aria-controls={panelId}
          aria-selected={value === item.value}
          tabIndex={value === item.value ? 0 : -1}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
