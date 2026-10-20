import { useEffect, useRef, useState } from "react";
import { ResponseVersions } from "../registry/components/response-versions";

// Prepared demo answers; installed components leave history and requests to the caller.
const answers = [
  "Small batches, big flavor.\nChurned this morning, gone by tonight.",
  "Cold scoops, warm welcomes.\nChurned on Main Street every morning.\nCome for a scoop, stay for the company.",
  "Real cream, slow churned.\nOne scoop and you’re a regular.",
];

export function ResponseVersionsDemo({
  initialVersions = false,
  regenerating = false,
  showRegenerate = true,
}: {
  initialVersions?: boolean;
  regenerating?: boolean;
  showRegenerate?: boolean;
}) {
  const [versions, setVersions] = useState(() =>
    initialVersions ? answers : [answers[0]],
  );
  const [index, setIndex] = useState(initialVersions ? 2 : 0);
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const busy = regenerating || streaming;

  useEffect(() => () => window.clearInterval(timer.current), []);

  const regenerate = () => {
    if (busy) return;
    const nextIndex = versions.length;
    const words = answers[nextIndex % answers.length].split(/(?<=\s)/);
    let count = 0;
    setVersions((previous) => [...previous, ""]);
    setIndex(nextIndex);
    setStreaming(true);
    timer.current = window.setInterval(() => {
      count += 1;
      setVersions((previous) =>
        previous.map((answer, i) =>
          i === nextIndex ? words.slice(0, count).join("") : answer,
        ),
      );
      if (count >= words.length) {
        window.clearInterval(timer.current);
        setStreaming(false);
      }
    }, 70);
  };

  return (
    <div className="flex w-full max-w-[480px] flex-col gap-6">
      <p className="self-end rounded-[14px] bg-muted px-4 py-2.5 text-[14px] leading-relaxed text-foreground">
        Write a tagline for our ice cream shop
      </p>
      <ResponseVersions
        count={versions.length}
        index={index}
        onIndexChange={setIndex}
        onRegenerate={showRegenerate ? regenerate : undefined}
        regenerating={busy}
      >
        <p className="min-h-[3.5rem] whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
          {versions[index]}
          {streaming && index === versions.length - 1 && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-foreground/70 motion-reduce:animate-none"
            />
          )}
        </p>
      </ResponseVersions>
    </div>
  );
}
