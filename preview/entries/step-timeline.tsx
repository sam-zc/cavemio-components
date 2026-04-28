import { StepTimeline } from "../../registry/components/step-timeline";
import { lifecycleSteps } from "../request-lifecycle-demo";
export function Demo() {
  return (
    <main className="cavemio-demo lifecycle-demo grid min-h-svh place-items-center bg-background p-8">
      <StepTimeline
        steps={lifecycleSteps}
        defaultValue="planned"
        autoPlay
        className="max-w-[480px]"
      />
    </main>
  );
}
