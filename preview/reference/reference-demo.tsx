"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import metadata from "./metadata";

export interface ReferenceDemoProps {
  initialTab?: string;
}

export function ReferenceDemo({
  name,
  Scene,
  initialTab,
}: ReferenceDemoProps & {
  name: string;
  Scene: ComponentType<{ tab?: string }>;
}) {
  const settings = metadata.find((item) => item.slug === name)!;
  const [tab, setTab] = useState(
    initialTab && settings.tabs.includes(initialTab)
      ? initialTab
      : settings.tabs[0],
  );
  const [revision, setRevision] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const hasModes = settings.tabs.length > 1;

  useEffect(() => {
    const element = root.current;
    const replay = () => setRevision((value) => value + 1);
    element?.addEventListener("cavemio-demo-replay", replay);
    return () => element?.removeEventListener("cavemio-demo-replay", replay);
  }, []);

  return (
    <div
      ref={root}
      className="reference-demo"
      data-demo={name}
      data-mode={tab}
      data-stage={settings.stage || undefined}
    >
      <div
        className={`flex min-h-[300px] items-center justify-center px-3 pt-12 sm:min-h-[380px] sm:px-8 sm:pt-16 ${hasModes ? "pb-20 sm:pb-24" : "pb-6 sm:pb-14"}`}
      >
        <Scene key={`${tab ?? ""}-${revision}`} tab={tab} />
      </div>
      {hasModes && (
        <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
          <div
            role="tablist"
            aria-label={settings.tabsLabel}
            className="flex max-w-full items-center overflow-x-auto rounded-full bg-surface-4 p-1 text-[12.5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {settings.tabs.map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={tab === mode}
                onClick={() => {
                  setTab(mode);
                  setRevision((value) => value + 1);
                }}
                className={`shrink-0 rounded-full px-3.5 py-1 font-medium transition-colors ${tab === mode ? "bg-surface text-ink shadow-[0_1px_2px_rgb(var(--edge-rgb)/0.08)]" : "text-ink-6 hover:text-ink"}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
