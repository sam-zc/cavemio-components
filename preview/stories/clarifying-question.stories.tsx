import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClarifyingQuestionDemo } from "../clarifying-question-demo";

const meta = {
  title: "Components/Clarifying Question",
  component: ClarifyingQuestionDemo,
  parameters: { layout: "fullscreen" },
  args: {
    multiple: false,
    allowOther: true,
    showSkip: true,
    autoFocus: false,
    initialState: "asking",
    longContent: false,
  },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6 sm:p-12">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof ClarifyingQuestionDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
export const Multiple: Story = { args: { multiple: true } };
export const Answered: Story = { args: { initialState: "answered" } };
export const Skipped: Story = { args: { initialState: "skipped" } };
export const OptionsOnly: Story = {
  args: { allowOther: false, showSkip: false },
};
export const Keyboard: Story = { args: { autoFocus: true } };
export const LongContent: Story = { args: { longContent: true } };
