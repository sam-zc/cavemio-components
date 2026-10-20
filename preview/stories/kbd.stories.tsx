import type { Meta, StoryObj } from "@storybook/react-vite";
import { KbdDemo } from "../kbd-demo";

const meta = {
  title: "Components/Kbd",
  component: KbdDemo,
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof KbdDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Demo: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Passive: Story = { args: { passive: true } };
export const Propagation: Story = { args: { stopPropagation: false } };

export const WithLabel: Story = { args: { label: "Search..." } };
export const LiveKeys: Story = { args: { live: true, passive: true } };
export const StaticKeys: Story = { args: { live: false, passive: true } };
