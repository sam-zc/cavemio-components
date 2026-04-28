import { useState } from "react";
import {
  StepTimeline,
  type TimelineStep,
} from "../registry/components/step-timeline";
import {
  RequestLifecyclePreview,
  type RequestLifecycleData,
  type RequestLifecycleStage,
} from "../registry/components/request-lifecycle-preview";

export const lifecycleSteps: TimelineStep[] = [
  {
    id: "asked",
    title: "Asked.",
    description:
      "Alex asks in chat and Juno adds the vote. Others vote from the board and the widget, all on one post.",
  },
  {
    id: "planned",
    title: "Planned.",
    description:
      "It lands on your public roadmap, and every voter hears it’s coming.",
  },
  {
    id: "shipped",
    title: "Shipped.",
    description: "Publish a changelog post that links back to the request.",
  },
  {
    id: "answered",
    title: "Answered.",
    description: "Alex and every other voter get an email the day it ships.",
  },
];
const alex = {
  name: "Alex Martin",
  initials: "AM",
  color: "#67635f",
  image: "/lifecycle/avatar-female.jpg",
};
const marcus = {
  name: "Marcus Lee",
  initials: "ML",
  color: "#45615b",
  image: "/lifecycle/avatar-male.jpg",
};
const sofia = { name: "Sofia Ramos", initials: "SR", color: "#8b713a" };
export const lifecycleData: RequestLifecycleData = {
  title: "Mobile app",
  description:
    "The whole web app on iPhone and Android, with push notifications when something needs you.",
  votes: 128,
  voters: [
    alex,
    marcus,
    sofia,
    { name: "Daniel Kim", initials: "DK", color: "#5e742d" },
  ],
  activity: [
    { text: "“Any plans for a mobile app?”", channel: "Chat", voter: alex },
    { text: "Marcus voted", channel: "Board", voter: marcus },
    { text: "Sofia voted", channel: "Widget", voter: sofia },
  ],
  roadmap: { label: "Planned", count: 12, address: "acme.example.com/roadmap" },
  release: {
    badge: "New",
    date: "October 14",
    title: "Acme 2.4: The whole app, on your phone",
    description:
      "You asked for this more than anything else. Acme is now on iPhone and Android, with every project, comment, and file you have on the web.",
  },
  email: {
    sender: "Acme",
    initials: "A",
    recipient: "to Alex Martin",
    time: "9:41 AM",
    greeting: "Hi Alex,",
    message: "A submission you upvoted is now completed:",
  },
};

export function RequestLifecycleDemo({
  initialStage = "asked",
  autoPlay = true,
}: {
  initialStage?: RequestLifecycleStage;
  autoPlay?: boolean;
}) {
  const [stage, setStage] = useState<RequestLifecycleStage>(initialStage);
  return (
    <main className="cavemio-demo lifecycle-demo flex min-h-svh items-center bg-background px-5 py-12 md:px-10">
      <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <h1 className="mb-10 [font-family:var(--timeline-display-font)] text-[2.25rem] leading-[1.05] font-normal tracking-[-0.03em] text-foreground md:text-[3.25rem]">
            The life of{" "}
            <em className="font-['Instrument_Serif',serif] leading-[0.9] tracking-[-0.02em]">
              a request.
            </em>
          </h1>
          <StepTimeline
            steps={lifecycleSteps}
            value={stage}
            onValueChange={(id) => setStage(id as RequestLifecycleStage)}
            autoPlay={autoPlay}
            ariaLabel="The life of a request"
          />
        </div>
        <RequestLifecyclePreview stage={stage} data={lifecycleData} />
      </div>
    </main>
  );
}
