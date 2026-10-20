import { useEffect, useRef, useState } from "react";
import { MessageEdit } from "../registry/components/message-edit";

const first = {
  question: "Write a two-line tagline for our ice cream shop",
  answer: "Small batches, big flavor.\nChurned this morning, gone by tonight.",
};
const replies = [
  "Cold scoops, warm welcomes.\nChurned on Main Street every morning.",
  "Small batches, big flavor.\nMade at dawn, gone by dusk.",
  "Real cream, slow churned.\nOne scoop and you’re a regular.",
];

export function MessageEditDemo({
  disabled = false,
  initialBranches = false,
}: {
  disabled?: boolean;
  initialBranches?: boolean;
}) {
  const [branches, setBranches] = useState(() =>
    initialBranches
      ? [
          first,
          {
            question: "Make it warmer and mention Main Street",
            answer: replies[0],
          },
          {
            question: "Keep it short and focus on real ingredients",
            answer: replies[2],
          },
        ]
      : [first],
  );
  const [index, setIndex] = useState(initialBranches ? 2 : 0);
  const [streaming, setStreaming] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const busy = streaming !== null;
  const branch = branches[index];
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-5">
      <MessageEdit
        text={branch.question}
        disabled={disabled || busy}
        onSubmit={(question) => {
          const answer = replies[branches.length % replies.length];
          const words = answer.split(/(?<=\s)/);
          setBranches((previous) => [...previous, { question, answer }]);
          setIndex(branches.length);
          setStreaming("");
          let count = 0;
          window.clearInterval(timer.current);
          timer.current = window.setInterval(() => {
            count += 1;
            setStreaming(words.slice(0, count).join(""));
            if (count >= words.length) {
              window.clearInterval(timer.current);
              setStreaming(null);
            }
          }, 70);
        }}
        versions={{
          index,
          count: branches.length,
          onIndexChange: (next) => !busy && setIndex(next),
        }}
      />
      <p
        key={index}
        className="min-h-[3.5rem] whitespace-pre-wrap text-[14px] leading-relaxed text-foreground animate-[ui-fade-in_250ms_ease-out_both] motion-reduce:animate-none"
      >
        {busy ? streaming : branch.answer}
        {busy && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-foreground/70 motion-reduce:animate-none"
          />
        )}
      </p>
    </div>
  );
}
