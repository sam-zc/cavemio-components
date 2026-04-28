import {
  InlineRewrite,
  type InlineRewriteProps,
  type RewriteVersion,
} from "../registry/components/inline-rewrite";

export const lengthVersions: RewriteVersion[] = [
  {
    label: "Shortest",
    text: "Fresh beans from small roasters, at your door every two weeks.",
  },
  {
    label: "Shorter",
    text: "Fresh beans from small roasters, roasted to order and at your door every two weeks. Skip or cancel anytime.",
  },
  {
    label: "Original",
    text: "Kept sends fresh beans from small roasters, roasted to order and at your door every two weeks. Each bag comes with a note from the roaster on how to brew it. Skip a delivery or cancel anytime from your phone.",
  },
  {
    label: "Longer",
    text: "Kept sends fresh beans from small roasters across Europe, roasted to order on Monday and at your door every two weeks. Each bag comes with a handwritten note from the roaster on where the beans grew and how to brew it. Skip a delivery, swap a bag or cancel anytime from your phone, with no calls and no forms.",
  },
  {
    label: "Longest",
    text: "Kept sends fresh beans from small roasters across Europe, roasted to order on Monday and at your door every two weeks. Each bag comes with a handwritten note from the roaster on where the beans grew and how to brew it. Skip a delivery, swap a bag or cancel anytime from your phone, with no calls and no forms. And if a bag doesn’t become your favourite, the next one is on us.",
  },
];

const toneVersions: RewriteVersion[] = [
  { label: "Formal" },
  { label: "Neutral" },
  {
    label: "Friendly",
    text: "Sorry, your order shipped late. It should arrive on Thursday, and we’ve refunded the shipping.",
  },
  { label: "Warm" },
  { label: "Playful" },
];
const toneReplies: Record<string, string> = {
  Formal:
    "Your order shipped late. It arrives on Thursday. We’ve refunded the shipping.",
  Neutral:
    "Your order shipped late. It should arrive on Thursday, and we’ve refunded the shipping.",
  Warm: "We’re so sorry your order shipped late. It should arrive on Thursday, and we’ve refunded the shipping so you’re not out of pocket. Thank you for bearing with us.",
  Playful:
    "Your beans took the scenic route, sorry about that. They should arrive on Thursday, and we’ve refunded the shipping. The next coffee’s on us.",
};

export function InlineRewriteDemo(props: Partial<InlineRewriteProps>) {
  return (
    <div className="w-full max-w-[520px]">
      <p className="mb-3 text-[13px] font-medium text-foreground">
        Product description
      </p>
      <InlineRewrite
        versions={lengthVersions}
        defaultValue={2}
        label="Length"
        description="Adjust how much detail the paragraph includes."
        {...props}
      />
      <p className="mt-6 text-center text-[12px] text-muted-foreground">
        Drag the dial.
      </p>
    </div>
  );
}

export function InlineRewriteToneDemo(props: Partial<InlineRewriteProps>) {
  return (
    <div className="w-full max-w-[520px]">
      <p className="text-[13px] font-medium text-foreground">
        Re: Where’s my order?
      </p>
      <p className="mb-3 text-[11.5px] text-muted-foreground">
        Reply to Maya, drafted
      </p>
      <InlineRewrite
        versions={toneVersions}
        defaultValue={2}
        label="Tone"
        description="Adjust the tone from formal to playful."
        onRewrite={({ label, signal }) =>
          new Promise((resolve, reject) => {
            const cancel = () => {
              window.clearTimeout(timer);
              reject(new DOMException("Aborted", "AbortError"));
            };
            const timer = window.setTimeout(() => {
              signal.removeEventListener("abort", cancel);
              resolve(toneReplies[label]);
            }, 1300);
            if (signal.aborted) cancel();
            else signal.addEventListener("abort", cancel, { once: true });
          })
        }
        {...props}
      />
    </div>
  );
}
