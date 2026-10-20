import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageEditDemo } from "../message-edit-demo";

const meta = {
  title: "Components/Message Edit",
  component: MessageEditDemo,
  parameters: { layout: "fullscreen" },
  args: { disabled: false, initialBranches: false },
  decorators: [
    (Story) => (
      <main className="cavemio-demo flex min-h-svh items-center justify-center p-6 sm:p-12">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof MessageEditDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
export const Versions: Story = { args: { initialBranches: true } };
export const Disabled: Story = { args: { disabled: true } };
