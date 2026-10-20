import { useState } from "react";
import {
  ClarifyingQuestion,
  type QuestionAnswer,
} from "../registry/components/clarifying-question";

const shops = [
  {
    id: "main",
    label: "Main Street",
    description: "Our original neighborhood shop.",
  },
  {
    id: "harbour",
    label: "Harbour Road",
    description: "The new shop by the waterfront.",
  },
  {
    id: "both",
    label: "Both locations",
    description: "One plan that works for both shops.",
  },
];
const priorities = [
  {
    id: "menu",
    label: "Seasonal menu",
    description: "New flavors and a refreshed menu.",
  },
  {
    id: "events",
    label: "Local events",
    description: "Tastings, pop-ups, and neighborhood partnerships.",
  },
  {
    id: "social",
    label: "Social media",
    description: "A launch calendar with photos and short videos.",
  },
];

export function ClarifyingQuestionDemo({
  multiple = false,
  allowOther = true,
  showSkip = true,
  autoFocus = false,
  initialState = "asking",
  longContent = false,
}: {
  multiple?: boolean;
  allowOther?: boolean;
  showSkip?: boolean;
  autoFocus?: boolean;
  initialState?: "asking" | "answered" | "skipped";
  longContent?: boolean;
}) {
  const options = multiple ? priorities : shops;
  const [answer, setAnswer] = useState<QuestionAnswer | null>(() =>
    initialState === "answered"
      ? { ids: [options[0].id], labels: [options[0].label] }
      : null,
  );
  const [skipped, setSkipped] = useState(initialState === "skipped");
  const [revision, setRevision] = useState(0);

  return (
    <div className="w-full max-w-[480px]">
      <ClarifyingQuestion
        key={revision}
        question={
          multiple
            ? "What should the launch plan include?"
            : "Which shop is this plan for?"
        }
        detail={
          longContent
            ? "Choose the location whose customers, opening hours, and neighborhood partnerships we should consider when preparing the seasonal launch plan."
            : "I’ll tailor the plan around your answer."
        }
        options={
          longContent
            ? options.map((option) => ({
                ...option,
                description: `${option.description} Include the full schedule, customer feedback, and practical next steps for the team.`,
              }))
            : options
        }
        multiple={multiple}
        allowOther={allowOther}
        autoFocus={autoFocus}
        answer={answer}
        onAnswer={setAnswer}
        skipped={skipped}
        onSkip={showSkip ? () => setSkipped(true) : undefined}
      />
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setAnswer(null);
            setSkipped(false);
            setRevision((value) => value + 1);
          }}
          className="cursor-pointer rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          Ask again
        </button>
      </div>
    </div>
  );
}
