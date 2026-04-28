import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextMorphDemo } from "../text-morph-demo";

const meta = {
  title: "Components/Text Morph",
  component: TextMorphDemo,
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </main>
    ),
  ],
} satisfies Meta<typeof TextMorphDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Labels: Story = {};
export const Headline: Story = { args: { initialMode: "headline" } };
export const Downward: Story = { args: { direction: "down" } };
export const SlowMotion: Story = { args: { duration: 1200 } };
