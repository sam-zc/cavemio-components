import {
  CavemioAnswerPaper,
  type AnswerPaperLevel,
  type CavemioAnswerPaperProps,
} from "../registry/components/cavemio-answer-paper";

// Prepared demo answers and reading times.
export const riceAnswerLevels: readonly AnswerPaperLevel[] = [
  {
    id: "minimal",
    label: "Just the answer",
    readTime: 1,
    content: <p>No, throw it away.</p>,
  },
  {
    id: "brief",
    label: "Brief",
    readTime: 4,
    content: (
      <div className="space-y-3">
        <p>Rice spores survive cooking and produce toxins.</p>
        <p>If your rice has been out overnight, throw it away.</p>
      </div>
    ),
  },
  {
    id: "summary",
    label: "Summary",
    readTime: 10,
    content: (
      <>
        <p>
          Rice can contain spores which survive cooking and produce toxins that
          reheating won’t destroy.
        </p>
        <ul>
          <li>Cool rice within one hour</li>
          <li>Store it in the fridge</li>
          <li>Eat within 24 hours</li>
        </ul>
        <p>If your rice has been out overnight, throw it away.</p>
      </>
    ),
  },
  {
    id: "full",
    label: "Full answer",
    readTime: 20,
    content: (
      <>
        <section>
          <h3>Why it matters</h3>
          <p>
            Uncooked rice can contain spores of <em>Bacillus cereus</em>, which
            survive cooking. At room temperature they can germinate and produce
            toxins that reheating won’t destroy.
          </p>
        </section>
        <section>
          <h3>What experts recommend</h3>
          <ul>
            <li>Cool rice within one hour of cooking</li>
            <li>Store it in the fridge at or below 5°C</li>
            <li>Eat leftovers within 24 hours</li>
            <li>Reheat only once, until steaming hot</li>
          </ul>
        </section>
        <section>
          <h3>The bottom line</h3>
          <p>
            If your rice has been out overnight, the safest choice is to throw
            it away.
          </p>
        </section>
      </>
    ),
  },
];

export function AnswerPaperDemo(props: Partial<CavemioAnswerPaperProps>) {
  return (
    <main className="cavemio-demo min-h-svh px-5 pb-24 pt-[clamp(48px,14.6vh,105px)] sm:px-10">
      <div className="mx-auto w-full max-w-[494px]">
        <div className="mb-4 flex justify-end">
          <p className="rounded-full bg-muted px-5 py-3 text-[15px] leading-5 tracking-[-0.02em] text-foreground">
            Can I leave cooked rice out overnight?
          </p>
        </div>
        <CavemioAnswerPaper levels={riceAnswerLevels} {...props} />
      </div>
    </main>
  );
}
