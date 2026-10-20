import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberRollDemo } from "../number-roll-demo";

const meta = {
  title: "Components/Number Roll",
  component: NumberRollDemo,
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </main>
    ),
  ],
} satisfies Meta<typeof NumberRollDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TryIt: Story = {};
export const Currency: Story = {
  args: { initialMode: "Currency", initialValue: 49 },
};
export const Compact: Story = {
  args: { initialMode: "Compact", initialValue: 12480 },
};
export const Live: Story = { args: { initialMode: "Live" } };
export const DigitBoundary: Story = { args: { initialValue: 999 } };
export const Negative: Story = { args: { initialValue: -24 } };
